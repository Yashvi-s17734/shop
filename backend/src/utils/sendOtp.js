const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOtpEmail = async (email, otp) => {
  await sgMail.send({
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Email Verification Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5efe6; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#1e1a16; border-radius:14px;">
            <tr>
              <td style="padding:28px; text-align:center; background:#17130f;">
                <h1 style="margin:0; font-size:26px; color:#c49a5a;">
                  Verify Your Email
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:28px; color:#e6dfd6; font-size:15px;">
                <p>Hi there,</p>
                <p>Please use the OTP below:</p>

                <div style="margin:26px 0; text-align:center;">
                  <span style="
                    display:inline-block;
                    padding:16px 28px;
                    font-size:30px;
                    letter-spacing:6px;
                    font-weight:bold;
                    color:#c49a5a;
                    background:#12100d;
                    border-radius:10px;
                    border:1px solid #3b2e1c;
                  ">
                    ${otp}
                  </span>
                </div>

                <p>This OTP is valid for 5 minutes.</p>
                <p style="font-size:13px; color:#b9b0a4;">
                  If you did not request this, please ignore this email.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px; text-align:center; background:#17130f; font-size:13px; color:#9a8f82;">
                <p>
                  Regards,<br />
                  <b style="color:#c49a5a;">Your Brand Team</b>
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
