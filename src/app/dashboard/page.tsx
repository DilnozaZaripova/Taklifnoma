'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/DashboardHeader';
import WeddingWizard from '@/components/WeddingWizard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Calendar, Users, Gift, Sparkles } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        weddingCount: 0,
        acceptedRSVPs: 0,
        totalGiftAmount: 0,
        totalInvitations: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const response = await fetch('http://localhost:5000/api/user/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                const data = await response.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <main className="min-h-screen bg-[var(--background)] px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-7xl mx-auto space-y-12">

                <DashboardHeader />

                {/* Command Center - Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-3 gap-6"
                >
                    <StatCard
                        icon={<Calendar className="text-[var(--primary)]" size={28} />}
                        label="To'ylaringiz"
                        value={loading ? '...' : stats.weddingCount.toString()}
                        subValue="Yaratilgan"
                    />
                    <StatCard
                        icon={<Users className="text-[var(--primary)]" size={28} />}
                        label="Qabul qilingan"
                        value={loading ? '...' : stats.acceptedRSVPs.toString()}
                        subValue={`${stats.totalInvitations} taklif yuborilgan`}
                    />
                    <StatCard
                        icon={<Gift className="text-[var(--primary)]" size={28} />}
                        label="To'plangan Mablag'"
                        value={loading ? '...' : `${(stats.totalGiftAmount / 1000).toFixed(0)}K`}
                        subValue="UZS"
                    />
                </motion.div>

                {/* Main Action Area: Wedding Wizard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                >
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

                    {/* The Wizard Component */}
                    <WeddingWizard />
                </motion.div>

                {/* NEW WIDGETS SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 pb-12"
                >
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

                        {/* Summary */}
                        <div className="bg-green-50 rounded-2xl p-6 text-center mb-6 border border-green-100">
                            <p className="text-sm text-green-600 uppercase tracking-widest mb-1">Jami Yig'ildi</p>
                            <p className="text-4xl font-bold text-green-700">12,450,000</p>
                            <p className="text-xs text-green-600/70 mt-1">so'm</p>
                        </div>

                        {/* List */}
                        <div className="space-y-3">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex justify-between items-center p-3 hover:bg-white rounded-xl transition border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">M</div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Mehmon Ismi</p>
                                            <p className="text-[10px] text-gray-400">12 daqiqa oldin</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-green-600">+500,000</p>
                                </div>
                            ))}
                            <button className="w-full py-2 text-xs text-center text-gray-400 hover:text-[#D4AF37] transition mt-2">Barchasini ko'rish</button>
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

                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden group cursor-pointer">
                                    {/* Placeholder Image */}
                                    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <span className="text-white text-xs">Yuklash</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-6 bg-gray-900 text-white hover:bg-gray-800">Barchasini Yuklab Olish (Zip)</Button>
                    </div>

                </motion.div>
            </div>
        </main>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    subValue?: string;
}

function StatCard({ icon, label, value, subValue }: StatCardProps) {
    return (
        <Card glass hoverEffect className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-[var(--primary)]/10">
                    {icon}
                </div>
                {/* Optional: Trend indicator could go here */}
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
