import Card from '@/components/ui/Card';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="container-centered max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">Biz Haqimizda</h1>
                    <div className="w-24 h-1 bg-[var(--primary)] mx-auto" />
                </div>

                <Card className="p-8 md:p-12 space-y-8 text-lg font-light leading-relaxed">
                    <p>
                        <strong className="text-[var(--primary)] font-serif text-xl">Taklifnoma.uz</strong> — bu O'zbekistondagi eng zamonaviy va qulay to'y taklifnomalarini yaratish platformasi. Bizning maqsadimiz — an'anaviy qadriyatlarni zamonaviy texnologiyalar bilan birlashtirish.
                    </p>
                    <p>
                        To'y — bu inson hayotidagi eng muhim va unutilmas kunlardan biri. Biz sizga ushbu kunni yaqinlaringiz bilan baham ko'rish uchun eng chiroyli va ta'sirli yo'lni taklif etamiz. Qog'oz taklifnomalarga vaqt va mablag' sarflamasdan, bir zumda minglab mehmonlarga yetib boradigan raqamli taklifnomalarni yarating.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <div className="p-6 bg-[var(--secondary)]/20 rounded-xl text-center">
                            <h3 className="font-serif text-xl mb-2">Tezkorlik</h3>
                            <p className="text-sm opacity-80">5 daqiqa ichida mukammal taklifnoma yarating</p>
                        </div>
                        <div className="p-6 bg-[var(--secondary)]/20 rounded-xl text-center">
                            <h3 className="font-serif text-xl mb-2">Tejamkorlik</h3>
                            <p className="text-sm opacity-80">Ortiqcha xarajatlarsiz cheksiz mehmonlarga yuboring</p>
                        </div>
                        <div className="p-6 bg-[var(--secondary)]/20 rounded-xl text-center">
                            <h3 className="font-serif text-xl mb-2">Interaktivlik</h3>
                            <p className="text-sm opacity-80">Mehmonlar lokatsiyani ko'rib, to'yana yubora oladilar</p>
                        </div>
                    </div>

                    <p className="text-center mt-12 opacity-60 text-sm">
                        Bizni tanlaganingiz uchun rahmat!<br />
                        — Taklifnoma.uz Jamoasi
                    </p>
                </Card>
            </div>
        </main>
    );
}
