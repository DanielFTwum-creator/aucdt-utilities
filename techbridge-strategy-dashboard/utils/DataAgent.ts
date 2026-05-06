
import { DashboardData, AgentProcessResult, BudgetItem, FinancialYear, MarketingChannel } from '../types';

export class DataAgent {
  /**
   * Main entry point for the agent to process input.
   */
  static process(input: string, currentData: DashboardData): { newData: DashboardData; result: AgentProcessResult } {
    const cleanInput = input.trim();
    const result: AgentProcessResult = { success: false, message: '', changes: [] };
    let newData = { ...currentData };

    try {
      // 1. Try parsing as JSON first
      if (cleanInput.startsWith('{') || cleanInput.startsWith('[')) {
        try {
          const jsonData = JSON.parse(cleanInput);
          if (jsonData.budget) {
             newData.budget = jsonData.budget;
             result.changes?.push('Replaced Budget Data');
          }
          if (jsonData.financials) {
            newData.financials = jsonData.financials;
            result.changes?.push('Replaced Financial Projections');
          }
          if (jsonData.marketing) {
            newData.marketing = jsonData.marketing;
            result.changes?.push('Replaced Marketing Data');
          }
          
          if (result.changes && result.changes.length > 0) {
            result.success = true;
            result.message = `Successfully imported JSON data.`;
            return { newData, result };
          }
        } catch (e) {
          // JSON parse failed, fall through to text processing
        }
      }

      // 2. Natural Language / Unstructured Text Processing
      const lines = cleanInput.split('\n');
      let mode: 'unknown' | 'budget' | 'financial' | 'marketing' = 'unknown';
      let processedLines = 0;

      for (const line of lines) {
        const lowerLine = line.toLowerCase().trim();

        // Detect Section Headers
        if (lowerLine.includes('budget allocation') || lowerLine.includes('implementation budget')) {
            mode = 'budget';
            result.changes?.push('Detected Budget Context');
            continue;
        }
        if (lowerLine.includes('financial trajectory') || lowerLine.includes('financial projections')) {
            mode = 'financial';
            result.changes?.push('Detected Financial Context');
            continue;
        }
        if (lowerLine.includes('marketing') || lowerLine.includes('recruitment channels') || lowerLine.includes('marketing strategy')) {
            mode = 'marketing';
            result.changes?.push('Detected Marketing Context');
            continue;
        }

        // Parse Line Data based on mode
        if (mode === 'budget') {
            // Pattern: "Item Name: 100,000" or "- Item Name - 100000"
            // Clean bullets
            const cleanLine = line.replace(/^[\-\*]\s+/, '');
            
            const match = cleanLine.match(/([a-zA-Z\s]+)[:\-]?\s*(\d{1,3}(?:,\d{3})*|\d+)/);
            if (match && match[2]) {
                const name = match[1].trim().replace(/[:\-]$/, '');
                const value = parseInt(match[2].replace(/,/g, ''), 10);
                
                // Update or Add
                const index = newData.budget.findIndex(b => b.name.toLowerCase() === name.toLowerCase());
                if (index !== -1) {
                    newData.budget[index] = { ...newData.budget[index], value };
                    result.changes?.push(`Updated Budget: ${name} -> ${value.toLocaleString()}`);
                } else {
                    // Simple heuristic for color assignment
                    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
                    newData.budget.push({ name, value, color: colors[newData.budget.length % colors.length] });
                    result.changes?.push(`Added Budget Item: ${name}`);
                }
                processedLines++;
            }
        }
        
        if (mode === 'marketing') {
            const cleanLine = line.replace(/^[\-\*]\s+/, '');
            const match = cleanLine.match(/([a-zA-Z\s]+)[:\-]?\s*(\d{1,3}(?:,\d{3})*|\d+)/);
            if (match && match[2]) {
                const name = match[1].trim().replace(/[:\-]$/, '');
                const value = parseInt(match[2].replace(/,/g, ''), 10);
                
                 const index = newData.marketing.findIndex(m => m.name.toLowerCase() === name.toLowerCase());
                 if (index !== -1) {
                     newData.marketing[index] = { ...newData.marketing[index], value };
                     result.changes?.push(`Updated Marketing: ${name} -> ${value.toLocaleString()}`);
                 } else {
                     newData.marketing.push({ name, value, yield: 'New Channel' });
                     result.changes?.push(`Added Marketing Channel: ${name}`);
                 }
                 processedLines++;
            }
        }
        
        if (mode === 'financial') {
            // Pattern: Year, Students, Revenue, Cost
            // "2028: 350 students, 3.5M rev, 2.8M cost"
            if (line.match(/20\d{2}/)) {
                const yearMatch = line.match(/(20\d{2}[^\d]*)/);
                const studentsMatch = line.match(/(\d+)\s*students?/i);
                const revMatch = line.match(/(\d+\.?\d*)[mM]?\s*(?:rev|revenue)/i);
                const costMatch = line.match(/(\d+\.?\d*)[mM]?\s*(?:cost|exp)/i);

                if (yearMatch) {
                    const year = yearMatch[1].trim().replace(/[:\-]$/, '');
                    const existingIndex = newData.financials.findIndex(f => f.year.includes(year.substring(0, 4)));
                    
                    if (existingIndex !== -1) {
                         const f = { ...newData.financials[existingIndex] };
                         if (studentsMatch) f.students = parseInt(studentsMatch[1]);
                         if (revMatch) f.revenue = parseFloat(revMatch[1]);
                         if (costMatch) f.cost = parseFloat(costMatch[1]);
                         // Recalculate profit
                         f.profit = parseFloat((f.revenue - f.cost).toFixed(3));
                         
                         newData.financials[existingIndex] = f;
                         result.changes?.push(`Updated Financials for ${year}`);
                         processedLines++;
                    } else {
                        // Add new year logic if needed
                    }
                }
            }
        }
      }

      if (processedLines > 0) {
        result.success = true;
        result.message = `Processed ${processedLines} data points from text.`;
      } else {
        result.success = false;
        result.message = "No recognizable data patterns found. Try using 'Section: Item - Value' format.";
      }

    } catch (e) {
      result.success = false;
      result.message = "Critical parsing error.";
    }

    return { newData, result };
  }
}
