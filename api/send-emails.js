const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send-emails', async (req, res) => {
  const {
    name,
    email,
    phone,
    date,
    message,
    who_to_meet,
    teacher_name
  } = req.body;

  // Determine who the recipient is
  let personToMeet = who_to_meet;
  if (who_to_meet === 'Teacher' && teacher_name) {
    personToMeet = `Teacher: ${teacher_name}`;
  }

  // Configure your transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email service you're using
    auth: {
      user: 'your-email@example.com',
      pass: 'your-app-password'
    }
  });

  const mailOptions = {
    from: email,
    to: 'school-admin@example.com', // school email address
    subject: `New Appointment Request - ${name}`,
    text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Date: ${date}
Person to Meet: ${personToMeet}
Reason:
${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
