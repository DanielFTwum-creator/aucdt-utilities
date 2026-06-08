
import { FunctionDeclaration, GoogleGenAI, Type } from "@google/genai";
import { STUDENT_LOAN_RATE } from "../constants";
import { AuditLogEvent, SalaryCalculationLogDetails, StepCodeData } from "../types";
import { calculateSsnit, performFullSalaryCalculation } from "../utils/salaryCalculations";
import { getLogs } from "./auditLogService";
import { getItem } from "../lib/persistentStore";

/**
 * Parses a PDF file (as a base64 string) to extract salary scale data.
 */
export const parseSalaryScalePdf = async (base64Pdf: string): Promise<Partial<StepCodeData>[]> => {
  try {
    // Initialize client locally to ensure fresh config
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      You are an expert data extraction assistant for Techbridge HR department.
      Analyze the provided PDF document, which is a Salary Scale table.
      
      Extract all Grade, Step, Position/Status, and Annual Salary information.
      
      Structure the output as a JSON array of objects. Each object should represent a specific Step within a Grade.
      
      Use this exact JSON schema for the objects:
      {
        "code": "string", // Format: Grade/Step (e.g., SM0101/1). If Step is a number, append it to Grade with a slash.
        "status": "string", // The Position or Rank title (e.g., President, Senior Lecturer).
        "annualSalary": number, // The 'Annually' value. Remove commas.
        "allowance": number, // The 'Monthly Consolidated Allowance' if explicitly listed. If not found, default to 0.
        "isSsnitExempt": boolean // Default to false unless the document specifically marks it as exempt.
      }
      
      Important rules:
      1. Look for tables with "GRADE", "STEPS", "Annually" or "Annual".
      2. The "code" must be unique for each step (e.g. SM0101/1, SM0101/2).
      3. If multiple positions share a grade, list the main one in "status".
      4. Return ONLY the JSON array. Do not include markdown code blocks or explanation.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64Pdf
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from AI model.");
    }

    try {
      const data = JSON.parse(responseText);
      if (Array.isArray(data)) {
        return data;
      } else {
        throw new Error("AI response was not a JSON array.");
      }
    } catch (e) {
      console.error("Failed to parse AI JSON response", e);
      throw new Error("Failed to parse extracted data.");
    }

  } catch (error) {
    console.error("Error in parseSalaryScalePdf:", error);
    throw error;
  }
};

// --- CLAUDE SERVICE ---

const salaryTool: FunctionDeclaration = {
    name: "calculateSalary",
    description: "Calculate the net monthly salary breakdown based on annual salary and allowance.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            annualSalary: { type: Type.NUMBER, description: "Annual basic salary in GHS" },
            monthlyAllowance: { type: Type.NUMBER, description: "Monthly consolidated allowance in GHS" },
            isSsnitExempt: { type: Type.BOOLEAN, description: "Is exempt from SSNIT deduction" },
            includeStudentLoan: { type: Type.BOOLEAN, description: "Apply student loan deduction" }
        },
        required: ["annualSalary", "monthlyAllowance"]
    }
};

const logsTool: FunctionDeclaration = {
    name: "getAuditLogs",
    description: "Retrieve recent security audit logs to analyze system activity.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            limit: { type: Type.NUMBER, description: "Number of logs to retrieve (default 20)" }
        }
    }
};

const stepsTool: FunctionDeclaration = {
    name: "getStepCodes",
    description: "Search for Grade/Step codes to find standard salaries and allowances.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            query: { type: Type.STRING, description: "Search query for grade code or position title" }
        }
    }
};

export class ClaudeService {
    private chat: any;
    
    constructor() {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        this.chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: "You are CLAUDE (Conversational Language Audit & User Diagnostic Engine), an expert AI assistant for the TSAP (Techbridge Salary Administration Portal). You help users with salary calculations, audit log analysis, and tax regulations. You strictly follow Ghanaian tax laws for 2025. All currency is in Ghanaian Cedis (₵). When showing calculation results, be concise and format numbers clearly.",
                tools: [{ functionDeclarations: [salaryTool, logsTool, stepsTool] }]
            }
        });
    }

    async sendMessage(message: string): Promise<string> {
        try {
            let response = await this.chat.sendMessage(message);
            
            // Handle function calls loop
            while (response.functionCalls && response.functionCalls.length > 0) {
                const toolResponses = [];
                for (const call of response.functionCalls) {
                    let result: any = { error: "Unknown function" };
                    
                    if (call.name === "calculateSalary") {
                        const args = call.args as any;
                        
                        let studentLoanAmount = null;
                        if (args.includeStudentLoan) {
                             // Calculate tentative student loan amount if requested (5% of taxable income)
                             // 1. Calculate Annual Consolidated Allowance
                             const annualAllowance = (args.monthlyAllowance || 0) * 12;
                             const grossAnnual = args.annualSalary + annualAllowance;
                             // 2. Calculate SSNIT to find taxable base
                             const { annualContribution } = calculateSsnit(args.annualSalary, args.isSsnitExempt || false);
                             // 3. Taxable Income
                             const taxable = grossAnnual - annualContribution;
                             // 4. Student Loan (5% of Taxable)
                             const annualStudentLoan = taxable * STUDENT_LOAN_RATE;
                             studentLoanAmount = annualStudentLoan / 12;
                        }

                        const breakdown = performFullSalaryCalculation(
                            args.annualSalary, 
                            args.monthlyAllowance, 
                            args.isSsnitExempt || false, 
                            studentLoanAmount,
                            0 // Additional allowance
                        );
                        
                        result = breakdown || { error: "Invalid inputs for calculation" };

                    } else if (call.name === "getAuditLogs") {
                        const args = call.args as any;
                        const logs = getLogs().slice(0, args.limit || 20);
                        
                        // Process logs to be token-efficient and AI-readable
                        result = logs.map(l => {
                            let cleanDetails: any = l.details;
                            
                            // Parse the JSON details for salary calculations to give the AI structured data
                            if (l.event === AuditLogEvent.SALARY_CALCULATION && typeof l.details === 'string') {
                                try {
                                    const parsed = JSON.parse(l.details) as SalaryCalculationLogDetails;
                                    cleanDetails = {
                                        recruit: parsed.recruitName,
                                        grade: parsed.stepCode,
                                        netMonthly: parsed.netSalary,
                                        basic: parsed.monthlyBasic,
                                        allowance: parsed.consolidatedAllowance,
                                        override: parsed.wasSalaryOverridden || parsed.wasAllowanceOverridden ? 'Yes' : 'No'
                                    };
                                } catch (e) {
                                    cleanDetails = "Details unreadable";
                                }
                            } else if (typeof l.details === 'string' && l.details.length > 200) {
                                cleanDetails = l.details.substring(0, 200) + '...';
                            }
                            
                            return {
                                time: l.timestamp,
                                event: l.event,
                                details: cleanDetails
                            };
                        });

                    } else if (call.name === "getStepCodes") {
                         const args = call.args as any;
                         try {
                             const steps = getItem<any[]>('tuc-salary-step-codes', []);
                             const query = (args.query || '').toLowerCase();
                             
                             const filtered = steps.filter((s: any) => 
                                 s.code.toLowerCase().includes(query) || 
                                 s.status.toLowerCase().includes(query)
                             ).slice(0, 10); // Limit to 10 results to save context window
                             
                             result = filtered.map((s: any) => ({
                                 code: s.code,
                                 status: s.status,
                                 annualSalary: s.annualSalary,
                                 allowance: s.allowance
                             }));
                         } catch(e) { result = { error: "Failed to load steps" }; }
                    }
                    
                    toolResponses.push({
                        functionResponse: {
                            name: call.name,
                            id: call.id,
                            response: { result }
                        }
                    });
                }
                
                // Send tool results back
                response = await this.chat.sendMessage(toolResponses);
            }
            
            return response.text || "I'm not sure how to answer that.";
        } catch (e) {
            console.error("Claude Error:", e);
            return "I encountered an error processing your request. Please try again.";
        }
    }
}