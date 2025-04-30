const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
    try {
        const { name, email, phone, appointmentWith, teacherName, date } = req.body;
        
        const { data, error } = await resend.emails.send({
            from: 'School Appointments <onboarding@your-domain.com>',
            to: 'shahaanikhlas06@gmail.com',
            subject: 'New Appointment Request',
            html: `<h3>Appointment Details...</h3>`
        });

        return res.status(error ? 400 : 200).json(error || { success: true });
        
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
