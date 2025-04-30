// Vercel serverless function (Node.js)
// Place this file in the /api directory for Vercel

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method not allowed'});
    return;
  }

  const { name, phone, email, person, teacherName } = req.body || {};
  if (!name || !phone || !email || !person || (person === "Teacher" && !teacherName)) {
    res.status(400).json({error: 'Missing required fields'});
    return;
  }

  // Compose the email content
  let whom = person;
  if (person === "Teacher" && teacherName) {
    whom += ` (${teacherName})`;
  }

  const html = `
    <h3>New Appointment Request</h3>
    <ul>
      <li><b>Name:</b> ${escapeHtml(name)}</li>
      <li><b>Phone:</b> ${escapeHtml(phone)}</li>
      <li><b>Email:</b> ${escapeHtml(email)}</li>
      <li><b>Whom to Meet:</b> ${escapeHtml(whom)}</li>
    </ul>
  `;

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Resend API key not configured." });
    }

    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'no-reply@yourdomain.com', // Replace with a verified sender on Resend if needed
        to: 'shahaanikhlas06@gmail.com',
        subject: 'New School Appointment Request',
        html
      })
    });

    if (!sendRes.ok) {
      const err = await sendRes.json();
      throw new Error(err.error || 'Error sending email');
    }

    res.status(200).json({success: true});
  } catch (e) {
    res.status(500).json({error: e.message || 'Failed to send email'});
  }
}

// Simple HTML escape to prevent HTML injection in emails
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}