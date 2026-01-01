import Card from '@/components/ui/Card';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="container-centered max-w-3xl">
                <h1 className="text-3xl font-serif text-[var(--foreground)] mb-8">Maxfiylik Siyosati</h1>
                <Card className="p-8 prose prose-slate max-w-none">
                    <p className="text-sm text-gray-500 mb-6">Oxirgi yangilanish: {new Date().toLocaleDateString()}</p>

                    <h3>1. Umumiy qoidalar</h3>
                    <p>Ushbu Maxfiylik Siyosati sizning shaxsiy ma'lumotlaringiz qanday to'planishi, ishlatilishi va himoya qilinishini tushuntiradi. Taklifnoma.uz xizmatidan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz.</p>

                    <h3>2. Ma'lumotlarni to'plash</h3>
                    <p>Biz quyidagi ma'lumotlarni to'plashimiz mumkin:</p>
                    <ul>
                        <li>Ism, familiya va bog'lanish ma'lumotlari (email, telefon).</li>
                        <li>To'y haqidagi ma'lumotlar (sanasi, manzili, kuyov va kelin ismlari).</li>
                        <li>Yuklangan media fayllar (rasm va videolar).</li>
                    </ul>

                    <h3>3. Ma'lumotlardan foydalanish</h3>
                    <p>Sizning ma'lumotlaringiz faqat xizmat ko'rsatish sifatini oshirish, taklifnomalarni shakllantirish va siz bilan bog'lanish uchun ishlatiladi. Biz ma'lumotlaringizni uchinchi shaxslarga sotmaymiz.</p>

                    <h3>4. Xavfsizlik</h3>
                    <p>Biz ma'lumotlaringizni himoya qilish uchun zamonaviy shifrlash va xavfsizlik choralarini ko'ramiz. Biroq, internet orqali ma'lumot uzatish 100% xavfsiz ekanligiga kafolat bera olmaymiz.</p>

                    <h3>5. O'zgartirishlar</h3>
                    <p>Ushbu siyosat vaqti-vaqti bilan yangilanishi mumkin. O'zgarishlar haqida saytda e'lon qilinadi.</p>
                </Card>
            </div>
        </main>
    );
}
