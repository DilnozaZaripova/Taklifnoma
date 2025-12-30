import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASS
            }
        });
    }

    async sendVerificationCode(email: string, code: string, fullName: string) {
        try {
            const mailOptions = {
                from: `"Taklifnoma.uz" <${config.EMAIL_USER}>`,
                to: email,
                subject: 'Email Tasdiqlash Kodi - Taklifnoma.uz',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background: linear-gradient(135deg, #D4AF37 0%, #AA8B29 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">Taklifnoma.uz</h1>
                        </div>
                        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #333; margin-top: 0;">Assalomu alaykum, ${fullName}!</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Taklifnoma.uz platformasiga xush kelibsiz! Emailingizni tasdiqlash uchun quyidagi kodni kiriting:
                            </p>
                            <div style="background: #f5f5f5; padding: 20px; margin: 30px 0; text-align: center; border-radius: 8px; border: 2px dashed #D4AF37;">
                                <h1 style="color: #D4AF37; font-size: 48px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                    ${code}
                                </h1>
                            </div>
                            <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
                                Agar siz bu so'rovni yuborgan bo'lmasangiz, bu xabarni e'tiborsiz qoldiring.
                            </p>
                        </div>
                        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                            <p>© 2024 Taklifnoma.uz - AI yordamida to'y taklifnomalari yaratish platformasi</p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            return { success: true };
        } catch (error: any) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendPasswordResetCode(email: string, code: string, fullName: string) {
        try {
            const mailOptions = {
                from: `"Taklifnoma.uz" <${config.EMAIL_USER}>`,
                to: email,
                subject: 'Parolni Tiklash Kodi - Taklifnoma.uz',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background: linear-gradient(135deg, #D4AF37 0%, #AA8B29 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">Taklifnoma.uz</h1>
                        </div>
                        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #333; margin-top: 0;">Assalomu alaykum, ${fullName}!</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Parolingizni tiklash so'rovini oldik. Quyidagi kodni kiriting:
                            </p>
                            <div style="background: #f5f5f5; padding: 20px; margin: 30px 0; text-align: center; border-radius: 8px; border: 2px dashed #D4AF37;">
                                <h1 style="color: #D4AF37; font-size: 48px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                    ${code}
                                </h1>
                            </div>
                            <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
                                Bu kod 15 daqiqa amal qiladi. Agar siz bu so'rovni yuborgan bo'lmasangiz, xavfsizligingiz uchun parolingizni o'zgartiring.
                            </p>
                        </div>
                        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                            <p>© 2024 Taklifnoma.uz - AI yordamida to'y taklifnomalari yaratish platformasi</p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            return { success: true };
        } catch (error: any) {
            console.error('Password reset email error:', error);
            return { success: false, error: error.message };
        }
    }
}

export const emailService = new EmailService();
