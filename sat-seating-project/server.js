// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Ethereal transporter (testing email)
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "davon.zieme@ethereal.email", // tumhara Ethereal email
    pass: "akADvBhR8hB8r7RMyR"           // Ethereal password
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: `"${name}" <${email}>`,       // user ka email
    to: "davon.zieme@ethereal.email",   // Ethereal inbox
    subject: `New Contact Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).send({
      message: "Message sent successfully!",
      preview: nodemailer.getTestMessageUrl(info) // browser me dikhega
    });
  } catch (err) {
    console.error("Mail send error:", err);
    res.status(500).send("Failed to send message");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
