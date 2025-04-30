import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { name, phone, email, meet, teacher } = req.body;

  try {
    await resend.emails.send({
      from: 'you@onboarding.resend.dev',
      to: 'shahaanikhlas06@gmail.com',
      subject: 'New Appointment Request',
      html: `
        <h3>New Appointment</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Meeting:</strong> ${meet}</p>
        ${meet === 'Teacher' ? `<p><strong>Teacher:</strong> ${teacher}</p>` : ''}
      `
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
}
