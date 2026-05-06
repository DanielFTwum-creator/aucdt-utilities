import { EmailPayload, BookingType } from '../types';

const API_ENDPOINT = '/api/send-email';
const HELPDESK_EMAIL = "helpdesk@techbridge.edu.gh";
const SENDER_EMAIL = "info@techbridge.edu.gh";

const generateEmailTemplate = (
  userEmail: string, 
  registrationId: string, 
  bookingDate: string, 
  type: BookingType,
  name?: string,
  notes?: string
): string => {
  const displayName = name || userEmail.split('@')[0];

  const isPrivate = type === 'PRIVATE';
  const eventTitle = isPrivate 
    ? 'Private 1-on-1 AI Strategy Session'
    : 'Unlock Your Potential: The 15-Minute AI Agent Masterclass';

  const subHeader = isPrivate
    ? 'Request Received'
    : 'Booking Confirmation';

  const statusBadge = isPrivate ? 'Pending Scheduling' : 'Confirmed';
  const accentColor = '#C8A84B';
  const headerBg = isPrivate ? '#1a1508' : '#0F0C07';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subHeader}</title>
</head>
<body style="margin:0;padding:0;background:#f0ece4;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0ece4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:${headerBg};border-radius:12px 12px 0 0;padding:40px 40px 32px;text-align:center;">
            <p style="margin:0 0 16px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${accentColor};font-weight:600;">Techbridge University College</p>
            <div style="width:48px;height:2px;background:${accentColor};margin:0 auto 20px;"></div>
            <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#F2EBD9;letter-spacing:-0.5px;">${subHeader}</h1>
            <p style="margin:0;font-size:14px;color:#9a8f7e;">${isPrivate ? 'Private 1-on-1 AI Strategy Session' : 'AI Agent Masterclass'}</p>
          </td>
        </tr>

        <!-- Gold rule -->
        <tr><td style="background:${accentColor};height:3px;"></td></tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;">

            <!-- Greeting -->
            <p style="margin:0 0 28px;font-size:16px;color:#2d2d2d;line-height:1.6;">Dear <strong>${displayName}</strong>,</p>
            <p style="margin:0 0 32px;font-size:15px;color:#4a4a4a;line-height:1.7;">${isPrivate
              ? 'Thank you for reaching out. We have received your request for a private session and our team will contact you shortly to confirm a time.'
              : 'Your registration is confirmed. We look forward to seeing you at the session — details are below.'
            }</p>

            <!-- Status pill -->
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">
              <tr>
                <td style="background:${isPrivate ? '#fff8e6' : '#f0faf0'};border:1px solid ${isPrivate ? '#C8A84B' : '#4caf80'};border-radius:20px;padding:6px 18px;">
                  <span style="font-size:12px;font-weight:600;color:${isPrivate ? '#8a6c1a' : '#2d7a4f'};letter-spacing:0.5px;text-transform:uppercase;">&#9679;&nbsp; ${statusBadge}</span>
                </td>
              </tr>
            </table>

            <!-- Session details card -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf9f7;border:1px solid #e8e2d9;border-radius:10px;margin-bottom:28px;">
              <tr><td style="padding:20px 24px 12px;border-bottom:1px solid #e8e2d9;">
                <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${accentColor};font-weight:600;">Session Details</p>
              </td></tr>
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="130" style="padding:6px 0;font-size:13px;color:#888;font-weight:500;vertical-align:top;">Event</td>
                    <td style="padding:6px 0;font-size:13px;color:#1a1a1a;font-weight:600;vertical-align:top;">${eventTitle}</td>
                  </tr>
                  <tr>
                    <td width="130" style="padding:6px 0;font-size:13px;color:#888;font-weight:500;vertical-align:top;">Date</td>
                    <td style="padding:6px 0;font-size:14px;color:${accentColor};font-weight:700;vertical-align:top;">${bookingDate}</td>
                  </tr>
                  <tr>
                    <td width="130" style="padding:6px 0;font-size:13px;color:#888;font-weight:500;vertical-align:top;">${isPrivate ? 'Notes' : 'Format'}</td>
                    <td style="padding:6px 0;font-size:13px;color:#1a1a1a;vertical-align:top;">${isPrivate
                      ? `<em style="color:#555;">"${notes || 'No specific notes provided'}"</em>`
                      : 'Online &mdash; Google Meet'
                    }</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Registrant card -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf9f7;border:1px solid #e8e2d9;border-radius:10px;margin-bottom:32px;">
              <tr><td style="padding:20px 24px 12px;border-bottom:1px solid #e8e2d9;">
                <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${accentColor};font-weight:600;">Your Registration</p>
              </td></tr>
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="130" style="padding:6px 0;font-size:13px;color:#888;font-weight:500;">Name</td>
                    <td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${displayName}</td>
                  </tr>
                  <tr>
                    <td width="130" style="padding:6px 0;font-size:13px;color:#888;font-weight:500;">Email</td>
                    <td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${userEmail}</td>
                  </tr>
                  <tr>
                    <td width="130" style="padding:6px 0;font-size:13px;color:#888;font-weight:500;">Reference ID</td>
                    <td style="padding:6px 0;font-size:12px;color:#888;font-family:monospace;">${registrationId}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Sign-off -->
            <p style="margin:0 0 4px;font-size:14px;color:#4a4a4a;">Warm regards,</p>
            <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a1a;">The Techbridge Team</p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0F0C07;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#C8A84B;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Techbridge University College</p>
            <p style="margin:0;font-size:11px;color:#5a5040;">techbridge.edu.gh &nbsp;&bull;&nbsp; helpdesk@techbridge.edu.gh</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

export const registerUser = async (
  email: string, 
  bookingDate: string, 
  type: BookingType = 'MASTERCLASS',
  name?: string,
  notes?: string
): Promise<void> => {
  const registrationId = Date.now().toString();
  const displayName = name || email.split('@')[0];
  
  const subject = type === 'PRIVATE' 
    ? `[PRIVATE SESSION] Request from ${displayName}` 
    : `[MASTERCLASS] Booking Confirmed - ${bookingDate}`;

  const payload: EmailPayload = {
    applicantId: registrationId,
    fullName: displayName,
    message: generateEmailTemplate(email, registrationId, bookingDate, type, name, notes),
    receiverEmailId: email,
    senderEmailId: SENDER_EMAIL,
    ccEmailId: HELPDESK_EMAIL,
    subject: subject
  };

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'accept': '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Registration failed: ${response.status} - ${errorText}`);
  }
};