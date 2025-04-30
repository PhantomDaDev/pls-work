const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY); // Set your Resend API Key in .env

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

  const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Date: ${date}
Person to Meet: ${personToMeet}
Reason:
${message}
  `;

  try {
    const data = await resend.emails.send({
      from: 'appointments@your-domain.com', // Must be a verified domain in Resend
      to: 'school-admin@example.com',
      subject: `New Appointment Request - ${name}`,
      text: emailBody
    });

    res.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

module.exports = router;
