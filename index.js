const nodemailer = require("nodemailer");

module.exports = async function (context) {
  try {

    // Vérifier et afficher le JSON reçu
    context.log("🟡 JSON Reçu :", context.req.body);

    if (!context.req.body) {
      throw new Error("❌ context.req.body est undefined !");
    }
    
    // Parse the request body directly (Appwrite provides it as a string)
    const { email, subject, message } = JSON.parse(context.req.body);

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

    // Log success in Appwrite logs
    context.log("✅ Email sent successfully!");

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "✅ Email sent successfully!" }),
    };
  } catch (error) {
    // Log the error for debugging
    context.error("Email sending failed:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
