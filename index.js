import nodemailer from "nodemailer";

export default async function (req, res) {
  try {
    const { email, subject, message } = JSON.parse(req.body);

    // SMTP Configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // Example: smtp.gmail.com
      port: process.env.SMTP_PORT, // Example: 587
      secure: false, // Use `true` for port 465, `false` for 587
      auth: {
        user: process.env.SMTP_USER, // SMTP Username
        pass: process.env.SMTP_PASS, // SMTP Password
      },
    });

    // Send Email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      text: message,
    });

    return res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    return res.json({ success: false, error: error.message }, 500);
  }
}
