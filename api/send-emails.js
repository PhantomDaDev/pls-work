// api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { name, phone, email, meet, teacher } = req.body;

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'you@onboarding.resend.dev',
      to: 'shahaanikhlas06@gmail.com',
      subject: 'New Appointment Request',
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Meeting:</strong> ${meet}${meet === 'Teacher' ? ` (${teacher})` : ''}</p>`,
    }),
  });

  const data = await response.json();
  res.status(200).json({ success: true, data });
}

