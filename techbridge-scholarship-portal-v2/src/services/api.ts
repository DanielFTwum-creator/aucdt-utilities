import { FormData } from '../types';

/**
 * Service to handle the final submission of the scholarship application.
 * Constructs a structured JSON payload for the email dispatch API.
 */
export const submitApplication = async (data: FormData, recordPngBase64?: string): Promise<{ success: boolean; message: string }> => {
  // Production Endpoint (Simulated for this environment)
  const API_ENDPOINT = "https://portal.aucdt.edu.gh/aucdt-dev/sendMail";

  console.group("🚀 Scholarship Portal: Submission Logic");
  console.log("Compiling digital agreement payload...");
  if (recordPngBase64) console.log("📎 Attaching official agreement PNG...");

  const signedByText = data.signatures.signatureType === 'draw' 
    ? '[Electronically Drawn Signature]' 
    : data.signatures.scholarSign;

  // Professional HTML Email Template with Techbridge Branding
  const emailBodyText = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 650px; margin: 20px auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #0F0C07; color: #C8A84B; padding: 40px 30px; text-align: center; border-bottom: 4px solid #C8A84B; }
        .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; }
        .header p { margin: 10px 0 0; font-style: italic; opacity: 0.8; font-size: 14px; }
        .content { padding: 40px 30px; }
        .section-title { font-size: 14px; font-weight: bold; color: #C8A84B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
        .data-item { margin-bottom: 15px; }
        .label { font-size: 11px; text-transform: uppercase; color: #999; display: block; margin-bottom: 3px; }
        .value { font-size: 15px; color: #222; font-weight: 500; }
        .highlight-box { background-color: #fdfaf2; border: 1px solid #f1e6c5; padding: 20px; border-radius: 2px; margin: 20px 0; }
        .footer { background: #f4f4f4; padding: 20px 30px; font-size: 12px; color: #777; text-align: center; border-top: 1px solid #eee; }
        .status-badge { display: inline-block; padding: 4px 12px; background: #004d00; color: #ffffff; border-radius: 20px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .ref-id { font-family: monospace; background: #eee; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Scholarship Bond Executed</h1>
          <p>Official Digital Record • Techbridge University College</p>
        </div>
        <div class="content">
          <div style="text-align: right; margin-bottom: 20px;">
            <span class="status-badge">Legal Attestation Verified</span>
          </div>
          
          <div class="section-title">Scholar Identity</div>
          <table style="width: 100%; margin-bottom: 25px;">
            <tr>
              <td style="width: 50%; padding-bottom: 15px;">
                <span class="label">Full Legal Name</span>
                <span class="value">${data.scholar.title} ${data.scholar.fullName}</span>
              </td>
              <td style="width: 50%; padding-bottom: 15px;">
                <span class="label">Identity Reference</span>
                <span class="value">${data.scholar.idNumber}</span>
              </td>
            </tr>
            <tr>
              <td style="width: 50%; padding-bottom: 15px;">
                <span class="label">Email Address</span>
                <span class="value">${data.scholar.email}</span>
              </td>
              <td style="width: 50%; padding-bottom: 15px;">
                <span class="label">Contact Number</span>
                <span class="value">${data.scholar.phone}</span>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <span class="label">Residential Address</span>
                <span class="value">${data.scholar.address}</span>
              </td>
            </tr>
          </table>

          <div class="section-title">Academic & Bond Obligations</div>
          <div class="highlight-box">
            <table style="width: 100%;">
              <tr>
                <td style="width: 50%; padding-bottom: 15px;">
                  <span class="label">Research Topic</span>
                  <span class="value">${data.program.phdSubject}</span>
                </td>
                <td style="width: 50%; padding-bottom: 15px;">
                  <span class="label">MANDATORY SERVICE</span>
                  <span class="value" style="color: #004d00; font-weight: bold;">${data.program.serviceYears} Years Post-Completion</span>
                </td>
              </tr>
              <tr>
                <td style="width: 50%;">
                  <span class="label">Funding Source</span>
                  <span class="value">${data.program.fundingSource}</span>
                </td>
                <td style="width: 50%;">
                  <span class="label">Department</span>
                  <span class="value">${data.program.department}</span>
                </td>
              </tr>
            </table>
          </div>

          <div class="section-title">Digital Bond Agreement Terms</div>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 4px; font-size: 13px; color: #555; margin-bottom: 30px;">
            <p style="margin-top: 0;"><strong>Execution of Undertaking:</strong> The Scholar, in consideration of the scholarship granted by Techbridge University College, hereby agrees to the following binding terms:</p>
            <ul style="padding-left: 20px; margin-bottom: 0;">
              <li>Completion of the ${data.program.department} program within the stipulated timeframe.</li>
              <li>Provision of mandatory service for a period of ${data.program.serviceYears} years immediately following successful completion.</li>
              <li>Adherence to all academic and professional codes of conduct mandated by the institution.</li>
              <li>Acknowledgement of legal liability for breach of bond, including reimbursement of grant value if service is not fulfilled.</li>
            </ul>
          </div>

          <div class="section-title">Execution Witnesses</div>
          <table style="width: 100%; margin-bottom: 25px;">
            <tr>
              <td style="width: 50%; padding-bottom: 15px;">
                <span class="label">Techbridge Representative</span>
                <span class="value">${data.witnesses.techbridgeWitness.name}</span>
                <span style="font-size: 10px; color: #999; display: block;">ID: ${data.witnesses.techbridgeWitness.idNumber}</span>
              </td>
              <td style="width: 50%; padding-bottom: 15px;">
                <span class="label">Scholar's Witness</span>
                <span class="value">${data.witnesses.scholarWitness.name}</span>
                <span style="font-size: 10px; color: #999; display: block;">ID: ${data.witnesses.scholarWitness.idNumber}</span>
              </td>
            </tr>
          </table>

          <div class="section-title">Digital Attestation</div>
          <table style="width: 100%;">
            <tr>
              <td style="width: 50%; padding-bottom: 15px;">
                <span class="label">Agreement Type</span>
                <span class="value">${data.signatures.signatureType.toUpperCase()}</span>
              </td>
              <td style="width: 50%; padding-bottom: 15px;">
                <span class="label">Execution Location</span>
                <span class="value">${data.meta.madeAt}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="label">Guarantor</span>
                <span class="value">${data.guarantor.name}</span>
              </td>
              <td>
                <span class="label">Execution Date</span>
                <span class="value">${data.meta.date}</span>
              </td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; padding: 15px; border: 1px dashed #C8A84B; text-align: center;">
            <span class="label">Digital Signature Hash</span>
            <span class="value" style="font-family: monospace; font-size: 12px;">${btoa(data.scholar.idNumber + data.meta.date).substring(0, 32)}</span>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 Techbridge University College • Registrar's Office</p>
          <p>Verification Ref: <span class="ref-id">${crypto.randomUUID().substring(0, 8).toUpperCase()}</span></p>
          <p style="font-size: 10px; margin-top: 15px;">This is an automated legal record. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Confirmation Loop (FR-20): Dispatch to both Registrar and Scholar
  const recipients = [
    { email: "registrar@techbridge.edu.gh", role: "Registrar" },
    { email: data.scholar.email, role: "Scholar" }
  ];

  try {
    const results = await Promise.all(recipients.map(async (recipient) => {
        const payload = {
            applicantId: data.scholar.idNumber,
            fullName: data.scholar.fullName,
            receiverEmailId: recipient.email, 
            senderEmailId: "helpdesk@techbridge.edu.gh",
            subject: `Bond Executed: ${data.scholar.fullName} - ${data.scholar.idNumber}`,
            message: emailBodyText,
            attachments: [
              ...(recordPngBase64 ? [{
                filename: `TUC-BOND-${data.scholar.idNumber}.png`,
                content: recordPngBase64.split(',')[1],
                contentType: 'image/png'
              }] : []),
              ...(data.signatures.signatureImage && data.signatures.signatureImage.includes('base64') ? [{
                filename: `SIGNATURE-${data.scholar.idNumber}.png`,
                content: data.signatures.signatureImage.split(',')[1],
                contentType: 'image/png'
              }] : [])
            ]
          };

          console.log(`📡 Dispatching to ${recipient.role}: ${recipient.email}`);

          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
              'accept': '*/*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to reach ${recipient.role}: ${response.status}`);
          }
          return response.json();
    }));

    console.log("✅ Confirmation loop complete.");
    console.groupEnd();
    return {
      success: true,
      message: "Execution successful. Records dispatched to all parties."
    };

  } catch (error) {
    console.error("❌ Submission Error:", error);
    console.groupEnd();
    
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Bond execution failed due to a network error." 
    };
  }
};