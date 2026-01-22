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
<body style="margin:0; padding:0; background:#f7efe6; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:520px; background:#fffaf3; border-radius:16px; box-shadow:0 18px 45px rgba(0,0,0,0.12); overflow:hidden;">

          <tr>
            <td style="padding:30px; text-align:center; background:#fff3e2;">
              <h1 style="margin:0; font-size:24px; color:#b3874f;">
                Jayendra Vasan Bhandar
              </h1>
              <p style="margin:6px 0 0; font-size:13px; color:#8b7355;">
                Premium Kitchen Essentials
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px; color:#5c4a36; font-size:15px; line-height:1.7;">
              <p style="margin:0 0 14px;">Hello,</p>

              <p style="margin:0 0 22px;">
                Use the One-Time Password below to verify your email address.
              </p>

              <div style="margin:28px 0; text-align:center;">
                <span style="
                  display:inline-block;
                  padding:18px 34px;
                  font-size:30px;
                  letter-spacing:6px;
                  font-weight:600;
                  color:#b3874f;
                  background:#fff7ed;
                  border-radius:12px;
                  border:1px solid #e3c9a5;
                ">
                  ${otp}
                </span>
              </div>

              <p style="margin:0 0 10px; font-size:14px;">
                This OTP is valid for <b>5 minutes</b>.
              </p>

              <p style="margin:0; font-size:13px; color:#8a7760;">
                Please do not share this code with anyone.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:22px; text-align:center; background:#fff3e2; font-size:13px; color:#8b7355;">
              <p style="margin:0;">
                Regards,<br />
                <b style="color:#b3874f;">Jayendra Vasan Bhandar</b>
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
