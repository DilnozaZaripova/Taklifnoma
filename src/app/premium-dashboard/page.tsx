import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';

export default async function PremiumDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const isPremium = (session.user as any).subscriptionTier === 'PAID' || (session.user as any).role === 'ADMIN';

    if (!isPremium) {
        return (
            <main className="container-centered py-12 text-center">
                <Card className="p-12 max-w-2xl mx-auto space-y-6">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-3xl text-amber-600">👑</span>
                    </div>
                    <h1 className="text-3xl font-serif font-bold">Premium Imkoniyatlar</h1>
                    <p className="text-gray-600">
                        Ushbu sahifa va eksklyuziv dizaynlar faqat Premium foydalanuvchilar uchun ochiq.
                        Xizmatni faollashtiring va platformaning barcha imtiyozlaridan foydalaning.
                    </p>
                    <button className="px-8 py-4 bg-gradient-primary text-white rounded-full font-bold shadow-lg hover:opacity-90 transition-opacity">
                        Premiumga o'tish
                    </button>
                </Card>
            </main>
        );
    }

    return (
        <main className="container-centered py-12">
            <h1 className="text-4xl font-serif mb-4 font-bold text-gray-900">👑 Premium Dashboard</h1>
            <p className="text-gray-600 mb-8">Eksklyuziv xususiyatlar va tahlillar sahifasiga xush kelibsiz.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-amber-200 bg-amber-50/30">
                    <h2 className="text-xl font-bold mb-4">VIP Shablonlar</h2>
                    <p className="text-sm text-gray-500 mb-6">Siz uchun 10+ dan ortiq premium dizaynlar faollashtirildi.</p>
                    <button className="text-amber-700 font-semibold hover:underline">Ko'rish →</button>
                </Card>
                <Card className="p-8 border-blue-200 bg-blue-50/30">
                    <h2 className="text-xl font-bold mb-4">Chuqurlashtirilgan Statistika</h2>
                    <p className="text-sm text-gray-500 mb-6">Mehmonlaringizning qaysi viloyatlardan va qachon kirayotganini tahlil qiling.</p>
                    <button className="text-blue-700 font-semibold hover:underline">Tahlil qilish →</button>
                </Card>
            </div>
        </main>
    );
}
