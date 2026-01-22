const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOtpEmail = async (email, otp) => {
  await sgMail.send({
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Verify Your Email | Jayendra Vasan Bhandar",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background:#f4efe9; font-family: 'Segoe UI', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:520px; background:#1b1612; border-radius:16px; box-shadow:0 14px 45px rgba(0,0,0,0.35); overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:30px; text-align:center; background:#14100d;">
              <h1 style="margin:0; font-size:24px; letter-spacing:0.6px; color:#c9a45c;">
                Jayendra Vasan Bhandar
              </h1>
              <p style="margin:6px 0 0; font-size:13px; color:#a89c8c;">
                Premium Kitchen Essentials
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px; color:#e6dfd6; font-size:15px; line-height:1.7;">
              <p style="margin:0 0 14px;">Namaste 🙏</p>

              <p style="margin:0 0 20px;">
                To continue securely, please verify your email using the One-Time Password below:
              </p>

              <!-- OTP -->
              <div style="margin:28px 0; text-align:center;">
                <span style="
                  display:inline-block;
                  padding:18px 34px;
                  font-size:32px;
                  letter-spacing:6px;
                  font-weight:600;
                  color:#c9a45c;
                  background:#120f0c;
                  border-radius:12px;
                  border:1px solid #3f2f1c;
                ">
                  ${otp}
                </span>
              </div>

              <p style="margin:0 0 10px; font-size:14px;">
                This OTP is valid for <b>5 minutes</b>.
              </p>

              <p style="margin:0; font-size:13px; color:#b6ab9d;">
                Please do not share this code with anyone for your safety.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px; text-align:center; background:#14100d; font-size:13px; color:#9f9385;">
              <p style="margin:0;">
                Warm regards,<br />
                <b style="color:#c9a45c;">Jayendra Vasan Bhandar</b>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
};

module.exports = sendOtpEmail;
