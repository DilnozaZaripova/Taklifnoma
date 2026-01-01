import Card from '@/components/ui/Card';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="container-centered max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6">Maxfiylik siyosati</h1>
                    <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
                </div>

                <Card className="p-8 md:p-12 space-y-8">
                    <p className="text-lg leading-relaxed">
                        Biz foydalanuvchilarimizning shaxsiy ma’lumotlarini hurmat qilamiz va ularning xavfsizligini birinchi o‘ringa qo‘yamiz.
                    </p>

                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl">
                        <h3 className="font-serif text-xl mb-4 text-[var(--foreground)]">Platformada kiritilgan barcha ma’lumotlar:</h3>
                        <ul className="space-y-3 list-disc list-inside text-[var(--muted-foreground)]">
                            <li>uchinchi shaxslarga berilmaydi</li>
                            <li>faqat xizmat ko‘rsatish maqsadida ishlatiladi</li>
                            <li>xavfsiz serverlarda saqlanadi</li>
                        </ul>
                    </div>

                    <p className="font-medium">
                        Email, telefon raqam va boshqa shaxsiy ma’lumotlar maxfiy hisoblanadi.
                    </p>

                    <div className="p-4 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-lg text-center text-[var(--foreground)]">
                        Foydalanuvchi roziligisiz hech qanday ma’lumot tarqatilmaydi.
                    </div>

                    <p className="text-center mt-12 text-sm text-[var(--muted-foreground)] pt-6 border-t border-[var(--border)]">
                        Taklifnoma platformasidan foydalanish orqali siz ushbu maxfiylik siyosatiga rozilik bildirasiz.
                    </p>
                </Card>
            </div>
        </main>
    );
}
