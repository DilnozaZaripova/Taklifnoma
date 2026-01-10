import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardHeader from '@/components/DashboardHeader';
import WeddingWizard from '@/components/WeddingWizard';
import Onboarding from '@/components/Onboarding';
import Card from '@/components/ui/Card';
import { Calendar, Users, Gift, Sparkles } from 'lucide-react';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = session.user.id;

    // Fetch stats directly from DB
    const [
        weddingCount,
        invitationCount,
        acceptedRSVPs,
        totalGifts
    ] = await Promise.all([
        prisma.wedding.count({
            where: { userId }
        }),
        prisma.invitation.count({
            where: { userId }
        }),
        prisma.rSVP.aggregate({
            _sum: { attendeeCount: true },
            where: {
                wedding: { userId },
                status: "ACCEPTED"
            }
        }),
        prisma.gift.aggregate({
            _sum: { amount: true },
            where: {
                wedding: { userId }
            }
        })
    ]);

    const stats = {
        weddingCount,
        totalInvitations: invitationCount,
        acceptedRSVPs: acceptedRSVPs._sum.attendeeCount || 0,
        totalGiftAmount: totalGifts._sum.amount || 0 // Assuming 'amount' is float/int
    };

    return (
        <main className="min-h-screen bg-[var(--background)] px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-7xl mx-auto space-y-12">
                <DashboardHeader />

                {/* Command Center - Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <StatCard
                        icon={<Calendar className="text-[var(--primary)]" size={28} />}
                        label="To'ylaringiz"
                        value={stats.weddingCount.toString()}
                        subValue="Yaratilgan"
                    />
                    <StatCard
                        icon={<Users className="text-[var(--primary)]" size={28} />}
                        label="Qabul qilingan"
                        value={stats.acceptedRSVPs.toString()}
                        subValue={`${stats.totalInvitations} taklif yuborilgan`}
                    />
                    <StatCard
                        icon={<Gift className="text-[var(--primary)]" size={28} />}
                        label="To'plangan Mablag'"
                        value={`${(Number(stats.totalGiftAmount) / 1000).toFixed(0)}K`}
                        subValue="UZS"
                    />
                </div>

                {/* Main Action Area: Wedding Wizard */}
                <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-serif text-[var(--foreground)] flex items-center gap-3">
                                <Sparkles className="text-[var(--primary)]" size={28} />
                                Taklifnoma Yaratish
                            </h2>
                            <p className="text-[var(--muted-foreground)] mt-2 font-light">
                                Sun'iy intellekt yordamida orzuingizdagi matnni yarating.
                            </p>
                        </div>
                    </div>

                    <WeddingWizard />
                </div>

                {/* WIDGETS SECTION - Static for now or fetch more data if needed */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    {/* WIDGET A: MOLIYA (FINANCE) */}
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <Gift size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-gray-800">To'yana Hisoboti</h3>
                                <p className="text-xs text-gray-500">Mehmonlar kiritgan sovq'alar</p>
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-2xl p-6 text-center mb-6 border border-green-100">
                            <p className="text-sm text-green-600 uppercase tracking-widest mb-1">Jami Yig'ildi</p>
                            <p className="text-4xl font-bold text-green-700">{stats.totalGiftAmount.toLocaleString()}</p>
                            <p className="text-xs text-green-600/70 mt-1">so'm</p>
                        </div>
                    </div>

                    {/* WIDGET B: GALEREYA (MEDIA) */}
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-gray-800">Jonli Galereya</h3>
                                <p className="text-xs text-gray-500">Mehmonlar yuklagan rasmlar</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-sm text-gray-400">Hozircha rasmlar yo'q</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subValue?: string;
}

function StatCard({ icon, label, value, subValue }: StatCardProps) {
    return (
        <Card glass hoverEffect className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-[var(--primary)]/10">
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                    {label}
                </p>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-serif text-[var(--foreground)]">
                        {value}
                    </p>
                    {subValue && (
                        <p className="text-sm text-[var(--muted-foreground)] font-light">
                            {subValue}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
