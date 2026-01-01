import Card from '@/components/ui/Card';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="container-centered max-w-3xl">
                <h1 className="text-3xl font-serif text-[var(--foreground)] mb-8">Foydalanish Shartlari</h1>
                <Card className="p-8 prose prose-slate max-w-none">
                    <p className="text-sm text-gray-500 mb-6">Kuchga kirish sanasi: {new Date().toLocaleDateString()}</p>

                    <h3>1. Xizmatdan foydalanish</h3>
                    <p>Taklifnoma.uz platformasi faqat qonuniy maqsadlarda foydalanish uchun mo'ljallangan. Siz boshqa foydalanuvchilarning huquqlarini buzmaslikka va tizimga zarar yetkazmaslikka majbursiz.</p>

                    <h3>2. Akkaunt xavfsizligi</h3>
                    <p>Siz o'z akkauntingiz va parolingiz xavfsizligi uchun javobgarsiz. Har qanday shubhali faoliyat haqida darhol bizga xabar berishingiz kerak.</p>

                    <h3>3. Kontentga egalik</h3>
                    <p>Siz yuklagan barcha kontent (matn, rasm) uchun o'zingiz javobgarsiz. Biz noqonuniy yoki haqoratli kontentni o'chirish huquqiga egamiz.</p>

                    <h3>4. To'lovlar va qaytarish</h3>
                    <p>Pullik xizmatlar uchun to'lovlar oldindan amalga oshiriladi. Texnik nosozliklar tufayli xizmat ko'rsatilmasa, mablag' qaytarilishi mumkin.</p>

                    <h3>5. Mas'uliyatni cheklash</h3>
                    <p>Biz tizimning uzluksiz ishlashiga harakat qilamiz, lekin fors-major holatlarda (internet uzilishi, server muammolari) yuzaga keladigan nosozliklar uchun javobgar emasmiz.</p>
                </Card>
            </div>
        </main>
    );
}
