'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const plans = [
    {
        tier: 'FREE',
        name: 'Bepul',
        price: '0',
        period: '',
        features: [
            'Bitta to\'y uchun',
            '50 tagacha mehmon',
            '3 ta taklifnoma',
            'AI generatsiya (10/oy)',
            'Asosiy RSVP'
        ],
        cta: 'Hozirgi tarifingiz',
        highlighted: false
    },
    {
        tier: 'PREMIUM',
        name: 'Premium',
        price: '99,000',
        period: '/oy',
        features: [
            '5 ta to\'y',
            '200 tagacha mehmon',
            'Cheksiz taklifnoma',
            'AI generatsiya (50/oy)',
            'Premium shablon',
            'To\'yana tracking',
            'Stol rejasi'
        ],
        cta: 'Premium\'ga o\'tish',
        highlighted: true
    },
    {
        tier: 'ENTERPRISE',
        name: 'Enterprise',
        price: '299,000',
        period: '/oy',
        features: [
            'Cheksiz to\'ylar',
            'Cheksiz mehmonlar',
            'Cheksiz taklifnoma',
            'Cheksiz AI',
            'Premium shablon',
            '24/7 qo\'llab-quvvatlash',
            'Maxsus dizayn',
            'API access'
        ],
        cta: 'Enterprise\'ga o\'tish',
        highlighted: false
    }
];

export default function PricingPage() {
    const handleUpgrade = (tier: string) => {
        // TODO: Implement payment flow
        alert(`${tier} tarifiga o'tish tez orada qo'shiladi!`);
    };

    return (
        <main className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="container-centered max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
                        O'zingizga Mos Tarifni Tanlang
                    </h1>
                    <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
                        Professional to'y taklifnomalari yarating va mehmonlaringizni ajoyib tarzda taklif qiling
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.tier}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={`p-8 h-full flex flex-col ${plan.highlighted
                                        ? 'border-2 border-[var(--primary)] shadow-2xl scale-105'
                                        : ''
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="bg-[var(--primary)] text-white text-xs font-bold py-1 px-3 rounded-full w-fit mb-4">
                                        ENG MASHHUR
                                    </div>
                                )}

                                <h3 className="text-2xl font-serif text-[var(--foreground)] mb-2">
                                    {plan.name}
                                </h3>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-[var(--foreground)]">
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className="text-[var(--muted-foreground)] ml-1">
                                            UZS{plan.period}
                                        </span>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-[var(--foreground)]">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => handleUpgrade(plan.tier)}
                                    className={`w-full ${plan.highlighted
                                            ? 'bg-[var(--primary)] hover:opacity-90'
                                            : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80'
                                        }`}
                                    disabled={plan.tier === 'FREE'}
                                >
                                    {plan.cta}
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12 text-sm text-[var(--muted-foreground)]"
                >
                    <p>Barcha tariflar 14 kunlik bepul sinov davri bilan birga keladi</p>
                    <p className="mt-2">Savollar bormi? <a href="mailto:support@taklifnoma.uz" className="text-[var(--primary)] hover:underline">Biz bilan bog'laning</a></p>
                </motion.div>
            </div>
        </main>
    );
}
