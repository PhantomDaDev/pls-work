import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, appointmentWith, teacherName, date } = req.body;

    const { data, error } = await resend.emails.send({
      from: 'School Appointments <onboarding@yourdomain.com>',
      to: 'shahaanikhlas06@gmail.com',
      subject: 'New Appointment Request',
      html: `
        <h3>New Appointment Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Requested Meeting With:</strong> ${appointmentWith}</p>
        ${teacherName ? `<p><strong>Teacher Name:</strong> ${teacherName}</p>` : ''}
        <p><strong>Preferred Date:</strong> ${date}</p>
      `
    });

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}