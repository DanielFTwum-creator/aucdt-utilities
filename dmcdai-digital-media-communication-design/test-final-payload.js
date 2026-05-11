const generateOtpEmailTemplate = (otp, email) => {
  const displayName = email.split('@')[0];
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
        .container { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 6px; margin-bottom: 25px; text-align: center; }
        h1 { margin: 0; font-size: 24px; }
        .subtitle { margin: 5px 0 0 0; opacity: 0.9; }
        .section { margin-bottom: 25px; }
        .info-grid { display: grid; grid-template-columns: 120px 1fr; gap: 8px; margin-bottom: 15px; }
        .info-label { font-weight: 500; color: #718096; }
        .info-value { color: #2d3748; }
        .message-box { background: #f7fafc; border-left: 4px solid #667eea; padding: 20px; border-radius: 4px; margin: 15px 0; text-align: center; }
        .otp-code { font-size: 48px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 20px 0; font-family: monospace; }
        .expiry-notice { color: #718096; font-size: 14px; margin-top: 15px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096; }
        .signature { margin-top: 20px; font-style: italic; color: #4a5568; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Techbridge Access Verification</h1>
            <p class="subtitle">2FA Authentication Code</p>
        </div>

        <div class="section">
            <div class="info-grid">
                <div class="info-label">Recipient:</div>
                <div class="info-value">${displayName}</div>
                <div class="info-label">Type:</div>
                <div class="info-value">Authentication Code</div>
            </div>
        </div>

        <div class="section">
            <div class="message-box">
                <p style="margin-bottom: 10px;">Your Techbridge verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p class="expiry-notice">This code expires in 10 minutes.</p>
            </div>
        </div>

        <div class="footer">
            <p>If you didn't request this code, please ignore this email.</p>
            <div class="signature">
                Best regards,<br>
                The Techbridge Team
            </div>
        </div>
    </div>
</body>
</html>`;
};

const email = 'daniel.twum@techbridge.edu.gh';
const otp = '789456';
const payload = {
  applicantId: Date.now().toString(),
  fullName: email.split('@')[0],
  message: generateOtpEmailTemplate(otp, email),
  receiverEmailId: email,
  senderEmailId: 'info@techbridge.edu.gh',
  subject: 'Techbridge Access Verification Code'
};

console.log('Testing updated HTML template payload with proper styling...');
console.log('OTP:', otp);
console.log('Recipient:', email);

fetch('http://localhost:4000/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload)
})
  .then(async res => {
    console.log('Status:', res.status);
    const body = await res.text();
    console.log('Response:', body);
    if (res.status === 200 && body === '1') {
      console.log('✅ EMAIL SENT SUCCESSFULLY WITH UPDATED TEMPLATE');
    } else {
      console.log('❌ EMAIL FAILED');
    }
  })
  .catch(err => {
    console.error('❌ ERROR:', err);
  });
