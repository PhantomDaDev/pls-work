export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { name, phone, email, meet, teacher } = req.body;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'you@onboarding.resend.dev', // Or your verified domain
        to: 'shahaanikhlas06@gmail.com',
        subject: 'New School Appointment',
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Meeting:</strong> ${meet}${meet === 'Teacher' ? ` (Teacher: ${teacher})` : ''}</p>
        `
      })
    });

    const data = await response.json();
    console.log('Email sent:', data);
    res.status(200).json({ success: true, data });

  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ success: false, error: 'Email failed to send.' });
  }
}
