import Card from '@/components/ui/Card';
import { HelpCircle, Mail, Phone } from 'lucide-react';

export default function HelpPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="container-centered max-w-3xl">
                <div className="text-center mb-12">
                    <HelpCircle size={48} className="mx-auto text-[var(--primary)] mb-4" />
                    <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">Yordam</h1>
                    <p className="text-[var(--muted-foreground)] font-light text-lg">
                        Savollaringiz bormi? Biz sizga yordam berishga tayyormiz.
                    </p>
                </div>

                <div className="grid gap-8">
                    <Card className="p-8 md:p-10">
                        <p className="text-lg mb-6 leading-relaxed">
                            Agar platformadan foydalanish jarayonida savollaringiz yoki qiyinchiliklar bo‘lsa, ushbu bo‘lim siz uchun.
                        </p>

                        <div className="bg-[var(--secondary)]/20 p-6 rounded-xl mb-8">
                            <h2 className="font-serif text-xl mb-4">Bu yerda siz:</h2>
                            <ul className="space-y-3 list-disc list-inside text-[var(--foreground)]/80">
                                <li>taklifnoma yaratish bo‘yicha ko‘rsatmalar</li>
                                <li>QR koddan foydalanish</li>
                                <li>taklifnomani ulashish</li>
                                <li>mehmonlar bilan ishlash</li>
                            </ul>
                            <p className="mt-4 pt-4 border-t border-[var(--border)] opacity-80">
                                haqida ma’lumot olishingiz mumkin.
                            </p>
                        </div>

                        <p className="text-center font-medium">
                            Agar savolingizga javob topa olmasangiz, biz bilan bog‘lanishingiz mumkin.
                        </p>
                    </Card>

                    <Card className="p-8 bg-[var(--primary)] text-white border-none relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-serif mb-6 text-center">Biz bilan bog'lanish</h2>

                            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                                <a href="mailto:support@inviter.uz" className="flex flex-1 w-full md:w-auto items-center gap-4 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition backdrop-blur-sm group">
                                    <div className="p-3 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs opacity-70 uppercase tracking-wider">Email</p>
                                        <p className="font-medium text-lg">support@inviter.uz</p>
                                    </div>
                                </a>

                                <div className="flex flex-1 w-full md:w-auto items-center gap-4 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition backdrop-blur-sm">
                                    <div className="p-3 bg-white/10 rounded-full">
                                        <HelpCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs opacity-70 uppercase tracking-wider">Javob vaqti</p>
                                        <p className="font-medium text-lg">24 soat ichida</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    </Card>
                </div>
            </div>
        </main>
    );
}
