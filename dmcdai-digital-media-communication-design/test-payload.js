const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
        .container { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 6px; margin-bottom: 25px; text-align: center; }
        .otp-code { font-size: 48px; font-weight: bold; color: #667eea; letter-spacing: 8px; text-align: center; margin: 30px 0; font-family: monospace; }
        .message-box { background: #f7fafc; border-left: 4px solid #667eea; padding: 20px; border-radius: 4px; margin: 15px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Techbridge Access Verification</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">2FA Authentication Code</p>
        </div>
        <div class="message-box">
            <p>Your Techbridge verification code is:</p>
            <div class="otp-code">654321</div>
            <p style="color: #718096; font-size: 14px; text-align: center;">This code expires in 10 minutes.</p>
        </div>
        <div class="footer">
            <p>If you didn't request this code, please ignore this email.</p>
            <div style="margin-top: 20px; font-style: italic; color: #4a5568;">Best regards,<br>The Techbridge Team</div>
        </div>
    </div>
</body>
</html>`;

const payload = {
  applicantId: Date.now().toString(),
  fullName: 'Daniel Twum',
  message: htmlTemplate,
  receiverEmailId: 'daniel.twum@techbridge.edu.gh',
  senderEmailId: 'info@techbridge.edu.gh',
  subject: 'Techbridge Access Verification Code'
};

console.log('Testing full HTML template payload...');
console.log('Payload keys:', Object.keys(payload));
console.log('Message length:', payload.message.length);
console.log('Subject:', payload.subject);

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
    if (res.status === 200) {
      console.log('✅ EMAIL SENT SUCCESSFULLY');
    } else {
      console.log('❌ EMAIL FAILED');
    }
  })
  .catch(err => {
    console.error('❌ ERROR:', err);
  });
