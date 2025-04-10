import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const port = process.env.PORT || 3001;

const resend = new Resend('re_gp2bHjEN_Akzb95qSbrQyaaAJF6oiJR2p');


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok mij' });
});

app.post('/api/send-email', async (req, res) => {
    try {
        const { to, subject, html, text } = req.body;
        const emailData = {
            from: 'Soporte Gestoru <gestoru@no-reply.com>',
            to: to || ['info@gestoru.com'],
            subject: subject || 'New Comment on ClickUp Task',
            html: html || '<p>A new comment has been added to your task.</p>'
        };
        if (text) {
            emailData.text = text;
        }

        const { data, error } = await resend.emails.send(emailData);
        if (error) {
            console.error('Error sending email:', error);
            return res.status(400).json({ error });
        }

        return res.status(200).json({ data });
    } catch (error) {
        console.error('Server error when sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
