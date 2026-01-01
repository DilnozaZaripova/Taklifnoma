import Card from '@/components/ui/Card';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="container-centered max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-6">Biz haqimizda</h1>
                    <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
                </div>

                <Card className="p-8 md:p-12 space-y-6 text-lg leading-relaxed font-light text-[var(--foreground)]">
                    <p>
                        <strong className="font-serif text-[var(--primary)]">Taklifnoma</strong> — bu shunchaki elektron taklifnoma emas.
                        Bu — muhim kunlarni zamonaviy, qulay va esda qolarli tarzda tashkil etish uchun yaratilgan raqamli platforma.
                    </p>

                    <p>
                        Men ushbu platformani real hayotdagi ehtiyojlardan kelib chiqib yaratdim.
                        Bugungi kunda to‘y va marosimlar juda ko‘p tashkiliy muammolarni talab qiladi: mehmonlarni chaqirish, joylashuvni tushuntirish, sovg‘alarni hisobga olish, esdaliklarni bir joyga jamlash.
                    </p>

                    <p className="font-medium italic text-[var(--muted-foreground)] border-l-4 border-[var(--primary)] pl-4 py-2 my-6">
                        Taklifnoma aynan shu muammolarni bitta platformada hal qilishni maqsad qilgan.
                    </p>

                    <div className="bg-[var(--secondary)]/20 p-6 rounded-xl space-y-3">
                        <h3 className="font-serif text-xl mb-4">Bu loyiha:</h3>
                        <ul className="space-y-2 list-disc list-inside opacity-90">
                            <li>an’anani saqlagan holda zamonaviy yechim beradi</li>
                            <li>qog‘oz taklifnomalar o‘rnini bosadi</li>
                            <li>mehmonlar bilan aloqani osonlashtiradi</li>
                            <li>to‘y egalariga qulaylik yaratadi</li>
                        </ul>
                    </div>

                    <p>
                        Platforma doimiy ravishda rivojlantiriladi va foydalanuvchilarning real ehtiyojlari asosida takomillashtirib boriladi.
                    </p>

                    <p className="text-xl font-serif text-[var(--primary)] text-center pt-8">
                        Bizning maqsadimiz — baxtli kunlaringizni yanada qulay va zamonaviy qilish.
                    </p>
                </Card>

                <p className="text-center mt-12 text-sm text-[var(--muted-foreground)] uppercase tracking-widest opacity-70">
                    Taklifnoma — muhabbat va texnologiya uyg‘unligi.
                </p>
            </div>
        </main>
    );
}
