const nodemailer = require("nodemailer");

module.exports = async function (req, res) {
  try {
    // Read the raw request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    // Wait until the full request body is received
    await new Promise((resolve) => req.on("end", resolve));

    // Parse the JSON body properly
    const { email, subject, message } = JSON.parse(body); // ✅ Corrected

    // Configure SMTP transporter with Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // TLS port
      secure: false, // Must be false for TLS (587)
      auth: {
        user: process.env.SMTP_USER, // Your Gmail address
        pass: process.env.SMTP_PASS, // Your Gmail App Password (not normal password)
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });

    // Send Email
    await transporter.sendMail({
      from: `"${process.env.SENDER_NAME}" <${process.env.SMTP_USER}>`, // Sender Name & Email
      to: email,
      subject: subject,
      text: message,
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, message: "✅ Email sent successfully!" }));
  } catch (error) {
    console.error("Email sending failed:", error.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
};
