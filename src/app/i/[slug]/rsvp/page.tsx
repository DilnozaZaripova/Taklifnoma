'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Users, CheckCircle2, XCircle, HelpCircle, MessageSquare } from 'lucide-react';

export default function RSVPPage() {
    const params = useParams();
    const router = useRouter();
    const weddingSlug = params.slug as string;

    const [formData, setFormData] = useState({
        guestName: '',
        guestPhone: '',
        guestEmail: '',
        status: '',
        attendeeCount: 1,
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // First get wedding ID from slug
            const weddingResponse = await fetch(`/api/weddings/${weddingSlug}`);
            const weddingData = await weddingResponse.json();

            if (!weddingData.success) {
                setError('To\'y topilmadi');
                setLoading(false);
                return;
            }

            const weddingId = weddingData.data.id;

            // Submit RSVP
            const response = await fetch('/api/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    weddingId
                })
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
            } else {
                setError(data.message || 'Xatolik yuz berdi');
            }
        } catch (err) {
            setError('Server bilan bog\'lanishda xatolik');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <Card className="p-8 space-y-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="text-green-600" size={32} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-serif text-[var(--foreground)]">Rahmat!</h1>
                            <p className="text-[var(--muted-foreground)]">
                                Sizning javobingiz qabul qilindi. Tashrifingizdan xursandmiz!
                            </p>
                        </div>
                        <Button onClick={() => router.push(`/i/${weddingSlug}`)} className="w-full">
                            Taklifnomaga Qaytish
                        </Button>
                    </Card>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="text-[var(--primary)]" size={32} />
                        </div>
                        <h1 className="text-3xl font-serif text-[var(--foreground)]">Ishtirok Etasizmi?</h1>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            Iltimos, tashrifingiz haqida xabar bering
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Input
                            label="Sizning ismingiz"
                            required
                            placeholder="To'liq ism-sharifingiz"
                            value={formData.guestName}
                            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Telefon"
                                type="tel"
                                placeholder="+998"
                                value={formData.guestPhone}
                                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                            />
                            <Input
                                label="Email (ixtiyoriy)"
                                type="email"
                                placeholder="email@example.com"
                                value={formData.guestEmail}
                                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-[var(--foreground)]">
                                Ishtirok Etasizmi?
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: 'ATTENDING' })}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.status === 'ATTENDING'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-[var(--border)] hover:border-green-300'
                                        }`}
                                >
                                    <CheckCircle2 className={formData.status === 'ATTENDING' ? 'text-green-600' : 'text-gray-400'} size={24} />
                                    <span className="text-xs font-medium">Kelaman</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: 'NOT_ATTENDING' })}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.status === 'NOT_ATTENDING'
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-[var(--border)] hover:border-red-300'
                                        }`}
                                >
                                    <XCircle className={formData.status === 'NOT_ATTENDING' ? 'text-red-600' : 'text-gray-400'} size={24} />
                                    <span className="text-xs font-medium">Kela olmayman</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: 'MAYBE' })}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.status === 'MAYBE'
                                        ? 'border-yellow-500 bg-yellow-50'
                                        : 'border-[var(--border)] hover:border-yellow-300'
                                        }`}
                                >
                                    <HelpCircle className={formData.status === 'MAYBE' ? 'text-yellow-600' : 'text-gray-400'} size={24} />
                                    <span className="text-xs font-medium">Bilmayman</span>
                                </button>
                            </div>
                        </div>

                        {formData.status === 'ATTENDING' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--foreground)]">
                                    Necha kishi kelasiz?
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={formData.attendeeCount}
                                    onChange={(e) => setFormData({ ...formData, attendeeCount: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
                                <MessageSquare size={16} />
                                Xabar (ixtiyoriy)
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Kuyov va kelinlarga tilaklar..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-[var(--primary)] focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !formData.status}
                            size="lg"
                            className="w-full mt-6"
                        >
                            {loading ? 'Yuborilmoqda...' : 'Javobni Yuborish'}
                        </Button>
                    </form>
                </Card>
            </motion.div>
        </main>
    );
}
