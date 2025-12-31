import nodemailer from 'nodemailer';

interface SendEmailOptions {
    to: string;
    subject: string;
    text?: string;
    html: string;
}

export const sendEmail = async ({ to, subject, text, html }: SendEmailOptions) => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
        console.warn('⚠️ SMTP configurations missing. Email not sent.');
        return false;
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Taklifnoma" <no-reply@taklifnoma.uz>',
            to,
            subject,
            text,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
