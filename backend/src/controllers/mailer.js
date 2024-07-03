const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.MAIL_CLIENTID,
  process.env.MAIL_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.MAIL_REFRESH,
});

const sendMail = async (to, subject, html, res) => {
  try {
    // AccessToken 얻기
    const accessToken = await oauth2Client.getAccessToken();

    // Gmail SMTP 전송 설정
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "1801406@donga.ac.kr",
        clientId: process.env.MAIL_CLIENTID,
        clientSecret: process.env.MAIL_SECRET,
        refreshToken: process.env.MAIL_REFRESH,
        accessToken: accessToken,
      },
    });

    // 메일 옵션 설정
    const mailOptions = {
      from: "1801406@donga.ac.kr",
      to: to,
      subject: subject,
      html: html,
    };

    // 메일 전송
    await transporter.sendMail(mailOptions);

    console.log(`Mail sent to ${to}`);
    res.status(200).send({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).send({ success: false, message: "Failed to send email" });
  }
};

module.exports = {
  sendMail,
};