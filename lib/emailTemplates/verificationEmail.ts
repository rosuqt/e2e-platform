export function getVerificationEmailHtml(link: string = "http://localhost:3000/sign-in", firstName: string = "") {
  return `
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { background: #fff; margin: 0; padding: 0; font-family: sans-serif; color: #444; }
    .wrapper { max-width: 600px; margin: 32px auto; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; }
    .blue-header { background: #2563eb; padding-top: 10px; padding-bottom: 10px; text-align: center; border-radius: 12px 12px 0 0; }
    .blue-header-title { font-size: 32px; font-weight: 700; color: #fff; letter-spacing: 1px; }
    .blue-header-title .highlight { color: #ff9900; }
    .blue-header svg { vertical-align: middle; margin-left: 8px; }
    .blue-header .subtitle { color: #fff; font-size: 12px; letter-spacing: 2px; padding-top: 24px; }
    .blue-header .headline { color: #fff; font-size: 22px; font-weight: 700; padding-top: 4px; }
    .content { padding: 32px 24px 24px 24px; }
    .content .greeting { font-size: 16px; color: #222; font-weight: 600; padding-bottom: 8px; }
    .content .message { margin-bottom: 24px; }
    .verify-btn {
      display: inline-block;
      background: #ff9900;
      color: #fff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 700;
      font-size: 16px;
      padding: 14px 36px;
      margin-bottom: 24px;
      margin-top: 8px;
    }
    .content .thanks { padding-top: 32px; }
    .contact-section { background: #f3f4f6; padding: 24px; }
    .contact-title { font-size: 15px; color: #222; font-weight: 600; padding-bottom: 4px; }
    .contact-info { font-size: 14px; padding-bottom: 8px; }
    .social-icons { padding: 12px 0; }
    .social-icons img { width: 24px; height: 24px; margin-right: 8px; vertical-align: middle; }
    .footer { background: #2563eb; padding: 12px 0; border-radius: 0 0 12px 12px; }
    .footer-text { color: #fff; font-size: 13px; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="blue-header" style="position:relative;">
      <img src="https://raw.githubusercontent.com/rosuqt/image-assets/main/logo.white.png" alt="Logo" style="position:absolute;top:16px;left:24px;width:120px;height:auto;">
    </div>
    <div style="text-align:center; margin-top:24px;">
      <div style="display:flex; align-items:center; justify-content:center; gap:16px;">
        <div style="flex:1; height:1px; background:#2563eb; max-width:80px;"></div>
        <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2563eb" viewBox="0 0 24 24" style="vertical-align:middle; margin-bottom:8px;">
          <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z"/>
          <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z"/>
        </svg>
        <div style="flex:1; height:1px; background:#2563eb; max-width:80px;"></div>
      </div>
      <div style="color:#2563eb; font-size:12px; letter-spacing:2px; font-weight:700; margin-top:8px;">THANKS FOR SIGNING UP!</div>
      <div style="color:#2563eb; font-size:22px; font-weight:700; margin-top:4px;">Verify Your E-mail Address</div>
    </div>

    <!-- Email Body -->
    <div class="content">
      <div class="greeting">Hi${firstName ? `, ${firstName}` : ","}</div>
      <div class="message">
        You're almost ready to get started. Please click on the button below to verify your email address and start posting jobs, managing applications, and discovering candidate matches on Seekr!
      </div>
      <a href="${link}" style="
        display: block;
        margin: 32px auto 24px auto;
        background: #2563eb;
        color: #fff !important;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        padding: 12px 0;
        text-align: center;
        width: 290px;
        max-width: 340px;
        box-shadow: 0 2px 8px rgba(37,99,235,0.08);
        letter-spacing: 1px;
      ">
        VERIFY YOUR EMAIL
      </a>
      <div class="thanks" style="font-size:13px">Bridging Education to Employment</div>
    </div>

    <!-- Contact Info -->
    <div class="contact-section">
      <div class="contact-title">Get in touch</div>
      <div class="contact-info">+63 928 391 9443<br>seekr.assist@gmail.com</div>
      <div class="social-icons">
        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook"></a>
        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram"></a>
        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter"></a>
        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn"></a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">
        Copyrights © Seekr All Rights Reserved
      </div>
    </div>
  </div>
</body>
</html>
  `
}
