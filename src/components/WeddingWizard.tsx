'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ChevronLeft, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

export default function WeddingWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null); // Inline error state

    const [formData, setFormData] = useState({
        groom_name: '',
        bride_name: '',
        wedding_date: '',
        wedding_location: '',
        language: 'uz',
        tone: 'samimiy',
        style: 'milliy'
    });

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:5000/api/ai/generate-invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            // Check for success or explicit error flag
            if (data.success || (data.generated_text && !data.error)) {
                // Determine the correct result data structure
                const resultData = data.data || data;
                setResult(resultData);
                setStep(4);
            } else {
                throw new Error(data.message || 'Apini qayta ishlashda xatolik yuz berdi.');
            }
        } catch (err: any) {
            console.error(err);
            // Set error state instead of alert
            setError("Texnik xatolik: " + (err.message || "Server bilan bog'lanib bo'lmadi."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto p-8"> {/* Added p-8 for breathing room */}
            {/* Progress Bar */}
            {step <= totalSteps && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">Qadam {step}/{totalSteps}</span>
                        <span className="text-sm text-[var(--muted-foreground)]">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-[var(--muted)] h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="bg-[var(--primary)] h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            {/* Error Message Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6"> {/* Added space-y-6 */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-serif text-[var(--foreground)] mb-2">
                                Keling, tanishib olaylik
                            </h2>
                            <Input
                                label="Kuyov Ismi"
                                type="text"
                                required
                                placeholder="Masalan: Azizbek"
                                value={formData.groom_name}
                                onChange={(e) => setFormData({ ...formData, groom_name: e.target.value })}
                            />
                            <Input
                                label="Kelin Ismi"
                                type="text"
                                required
                                placeholder="Masalan: Madinabonu"
                                value={formData.bride_name}
                                onChange={(e) => setFormData({ ...formData, bride_name: e.target.value })}
                            />
                            <Button
                                type="button"
                                onClick={() => setStep(2)}
                                size="lg"
                                className="w-full mt-4"
                            >
                                Davom Etish <ChevronRight className="ml-2" size={20} />
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-serif text-[var(--foreground)] mb-2">
                                Sana va Manzil
                            </h2>
                            <Input
                                label="To'y Sanasi"
                                type="date"
                                required
                                value={formData.wedding_date}
                                onChange={(e) => setFormData({ ...formData, wedding_date: e.target.value })}
                            />
                            <Input
                                label="To'yxonaning Nomi"
                                type="text"
                                required
                                placeholder="Masalan: Versal"
                                value={formData.wedding_location}
                                onChange={(e) => setFormData({ ...formData, wedding_location: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <Button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    variant="outline"
                                    size="lg"
                                >
                                    <ChevronLeft className="mr-2" size={20} /> Orqaga
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    size="lg"
                                >
                                    Davom Etish <ChevronRight className="ml-2" size={20} />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-serif text-[var(--foreground)] mb-2">
                                Uslub va Ohang
                            </h2>

                            {/* Grid Layout for Dropdowns */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2 ml-1">
                                        Murojaat Ohangi
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                                        value={formData.tone}
                                        onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                    >
                                        <option value="samimiy">Samimiy</option>
                                        <option value="rasmiy">Rasmiy</option>
                                        <option value="iliq">Iliq</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2 ml-1">
                                        Uslub
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                                        value={formData.style}
                                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                                    >
                                        <option value="milliy">Milliy</option>
                                        <option value="klassik">Klassik</option>
                                        <option value="zamonaviy">Zamonaviy</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2 ml-1">
                                    Taklifnoma Tili
                                </label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                >
                                    <option value="uz">O'zbekcha</option>
                                    <option value="ru">Ruscha</option>
                                    <option value="en">Inglizcha</option>
                                </select>
                            </div>

                            <div className="mt-8 pt-4 border-t border-[var(--border)]">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    size="lg"
                                    className="w-full" // Full width button
                                >
                                    {loading ? 'Yaratilmoqda...' : (
                                        <><Sparkles className="mr-2" size={20} /> Taklifnoma Yaratish</>
                                    )}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full mt-4 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                                >
                                    Orqaga qaytish
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6 text-center"
                        >
                            <div className="text-5xl">✨</div>
                            <h2 className="text-3xl font-serif text-[var(--primary)]">
                                Sizning Taklifnomangiz Tayyor!
                            </h2>
                            <div className="p-6 bg-white border border-[var(--primary)]/20 rounded-2xl text-left whitespace-pre-wrap font-light leading-relaxed text-[var(--foreground)]">
                                {result.generated_text}
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="button"
                                    onClick={() => window.print()}
                                    size="lg"
                                >
                                    Chop etish / Saqlash
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                                >
                                    Qaytadan yaratish
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </Card>
    );
}
