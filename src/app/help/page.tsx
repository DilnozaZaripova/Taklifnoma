import Card from '@/components/ui/Card';
import { HelpCircle, Mail, Phone } from 'lucide-react';

export default function HelpPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="container-centered max-w-4xl">
                <div className="text-center mb-12">
                    <HelpCircle size={48} className="mx-auto text-[var(--primary)] mb-4" />
                    <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">Yordam Markazi</h1>
                    <p className="text-[var(--muted-foreground)]">Savollaringiz bormi? Biz sizga yordam berishga tayyormiz.</p>
                </div>

                <div className="grid gap-6">
                    <Card className="p-8">
                        <h2 className="text-2xl font-serif mb-4 flex items-center gap-2">
                            Tez-tez so'raladigan savollar
                        </h2>
                        <div className="space-y-4 divide-y divide-[var(--border)]">
                            <div className="pt-4 first:pt-0">
                                <h3 className="font-medium text-lg">Taklifnoma yaratish pullikmi?</h3>
                                <p className="text-[var(--muted-foreground)]">Platformamizda asosiy taklifnoma yaratish bepul. Premium funksiyalar (masalan, to'yana yig'ish, video yuklash) uchun qo'shimcha to'lov bo'lishi mumkin.</p>
                            </div>
                            <div className="pt-4">
                                <h3 className="font-medium text-lg">Taklifnomani tahrirlasa bo'ladimi?</h3>
                                <p className="text-[var(--muted-foreground)]">Ha, yaratilgan taklifnomani istalgan vaqtda "Boshqaruv Paneli" orqali tahrirlashingiz mumkin.</p>
                            </div>
                            <div className="pt-4">
                                <h3 className="font-medium text-lg">Mehmonlar qanday kirishadi?</h3>
                                <p className="text-[var(--muted-foreground)]">Mehmonlar siz yuborgan havola yoki QR kod orqali maxsus sahifaga kirishadi. Ularga hech qanday ilova yuklab olish shart emas.</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 bg-[var(--primary)] text-white border-none">
                        <h2 className="text-2xl font-serif mb-4">Biz bilan bog'lanish</h2>
                        <p className="mb-6 opacity-90">Agar savolingizga javob topa olmasangiz, bizning qo'llab-quvvatlash xizmatimizga murojaat qiling.</p>

                        <div className="flex flex-col md:flex-row gap-6">
                            <a href="mailto:support@taklifnoma.uz" className="flex items-center gap-3 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">
                                <Mail size={24} />
                                <div>
                                    <p className="text-xs opacity-70">Email</p>
                                    <p className="font-medium">support@taklifnoma.uz</p>
                                </div>
                            </a>
                            <a href="tel:+998901234567" className="flex items-center gap-3 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">
                                <Phone size={24} />
                                <div>
                                    <p className="text-xs opacity-70">Telefon</p>
                                    <p className="font-medium">+998 90 123-45-67</p>
                                </div>
                            </a>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
