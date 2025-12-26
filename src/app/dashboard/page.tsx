'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/DashboardHeader';
import WeddingWizard from '@/components/WeddingWizard';
import Card from '@/components/ui/Card';
import { Calendar, Users, Gift, Sparkles } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        daysLeft: 0,
        rsvpCount: 0,
        totalGifts: 0
    });

    useEffect(() => {
        // Calculate days left (mock data for now)
        const weddingDate = new Date('2025-05-20');
        const today = new Date();
        const diffTime = weddingDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setStats({
            daysLeft: diffDays > 0 ? diffDays : 0,
            rsvpCount: 0,
            totalGifts: 0
        });
    }, []);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <DashboardHeader />

            {/* Command Center - Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid md:grid-cols-3 gap-6"
            >
                <StatCard
                    icon={<Calendar className="text-[var(--primary)]" size={32} />}
                    label="Kunlar Qoldi"
                    value={stats.daysLeft}
                />
                <StatCard
                    icon={<Users className="text-[var(--primary)]" size={32} />}
                    label="RSVP Soni"
                    value={stats.rsvpCount}
                />
                <StatCard
                    icon={<Gift className="text-[var(--primary)]" size={32} />}
                    label="To'yana"
                    value={`${stats.totalGifts} UZS`}
                />
            </motion.div>

            {/* Wedding Wizard */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="mb-6">
                    <h2 className="text-2xl font-serif text-[var(--foreground)] flex items-center gap-2">
                        <Sparkles className="text-[var(--primary)]" size={24} />
                        Taklifnoma Yaratish
                    </h2>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                        AI quvvati bilan mukammal taklifnomangizni yarating
                    </p>
                </div>
                <WeddingWizard />
            </motion.div>
        </div>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
}

function StatCard({ icon, label, value }: StatCardProps) {
    return (
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-2">{label}</p>
                    <p className="text-3xl font-serif text-[var(--foreground)]">{value}</p>
                </div>
                <div>{icon}</div>
            </div>
        </Card>
    );
}
