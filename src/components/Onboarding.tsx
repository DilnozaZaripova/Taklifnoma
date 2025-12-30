'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Share2, Gift, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from './ui/Button';

interface OnboardingProps {
    onComplete: () => void;
    onSkip: () => void;
}

const steps = [
    {
        title: "Xush Kelibsiz!",
        description: "Taklifnoma.uz bilan ajoyib to'yingizni yanada yodda qolarli qiling",
        icon: Heart,
        content: "AI yordamida shaxsiy taklifnomalar yarating, mehmonlar bilan oson bog'laning va barcha jarayonni bir joydan boshqaring."
    },
    {
        title: "To'y Yarating",
        description: "Birinchi qadam - to'y ma'lumotlarini kiriting",
        icon: Sparkles,
        content: "Kuyov va kelin ismlari, to'y sanasi va joyi. AI sizga professional taklifnoma matni tayyorlab beradi."
    },
    {
        title: "Ulashing",
        description: "QR kod orqali mehmonlarni taklif qiling",
        icon: Share2,
        content: "Har bir mehmon uchun shaxsiy link. Mehmonlar RSVP qilishlari, to'yana yuborishlari va rasm/video yuklay olishadi."
    },
    {
        title: "Kuzatib Boring",
        description: "Dashboard'dan hamma narsani nazorat qiling",
        icon: Gift,
        content: "Keladigan mehmonlar soni, to'plangan to'yana, mehmonlar soni va jonli galereya - barchasi bir joyda."
    }
];

export default function Onboarding({ onComplete, onSkip }: OnboardingProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const step = steps[currentStep];
    const Icon = step.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all ${index === currentStep
                                        ? 'w-8 bg-[var(--primary)]'
                                        : index < currentStep
                                            ? 'w-2 bg-[var(--primary)]/50'
                                            : 'w-2 bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={onSkip}
                        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-12 text-center"
                    >
                        <div className="w-24 h-24 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon className="text-[var(--primary)]" size={48} />
                        </div>

                        <h2 className="text-3xl font-serif text-[var(--foreground)] mb-3">
                            {step.title}
                        </h2>
                        <p className="text-lg text-[var(--primary)] mb-6">
                            {step.description}
                        </p>
                        <p className="text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed">
                            {step.content}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border)] flex items-center justify-between">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${currentStep === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                            }`}
                    >
                        <ChevronLeft size={20} />
                        <span>Orqaga</span>
                    </button>

                    <Button onClick={handleNext} className="flex items-center gap-2">
                        <span>{currentStep === steps.length - 1 ? 'Boshlash' : 'Keyingisi'}</span>
                        <ChevronRight size={20} />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
