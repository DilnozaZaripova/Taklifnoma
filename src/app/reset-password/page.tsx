'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Lock, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        code: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    useEffect(() => {
        if (!email) {
            router.push('/forgot-password');
        }
    }, [email, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Parollar mos kelmayapti');
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    code: formData.code,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to login with success message
                router.push('/login?reset=success');
            } else {
                setError(data.message || 'Xatolik yuz berdi');
            }
        } catch (err) {
            setError('Server bilan bog\'lanishda xatolik');
        } finally {
            setLoading(false);
        }
    };

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
                            <Lock className="text-[var(--primary)]" size={32} />
                        </div>
                        <h1 className="text-3xl font-serif text-[var(--foreground)]">Parolni Tiklash</h1>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            <strong className="text-[var(--foreground)]">{email}</strong> manziliga yuborilgan kodni kiriting
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--foreground)]">
                                Tasdiqlash Kodi
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                placeholder="123456"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '') })}
                                className="w-full px-6 py-4 text-center text-2xl font-bold tracking-[1em] rounded-2xl border-2 border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                            />
                        </div>

                        <Input
                            label="Yangi Parol"
                            type="password"
                            required
                            placeholder="Kamida 6 ta belgi"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        />

                        <Input
                            label="Parolni Tasdiqlang"
                            type="password"
                            required
                            placeholder="Yangi parolni qayta kiriting"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />

                        <Button
                            type="submit"
                            disabled={loading || formData.code.length !== 6}
                            size="lg"
                            className="w-full mt-6"
                        >
                            {loading ? 'Tiklanmoqda...' : 'Parolni Tiklash'}
                        </Button>
                    </form>

                    <button
                        onClick={() => router.push('/forgot-password')}
                        className="w-full text-center text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                    >
                        Kodni qayta yuborish
                    </button>
                </Card>
            </motion.div>
        </main>
    );
}
