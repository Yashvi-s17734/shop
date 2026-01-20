const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendOtpEmail = async (email, otp) => {
  await sgMail.send({
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Your login code",
    html: `
      <h2>Your OTP is: ${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
      <p>Do not share this OTP.</p>
    `,
  });
};
module.exports = sendOtpEmail;
