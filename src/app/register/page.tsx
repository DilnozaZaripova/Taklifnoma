'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Mail } from 'lucide-react';

export default function RegisterPage() {
    const [step, setStep] = useState<'register' | 'verify'>('register');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: ''
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState('');
    const router = useRouter();

    // Resend Timer Logic
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                if (data.data.requireVerification) {
                    setRegisteredEmail(formData.email);
                    setStep('verify');
                } else {
                    // If auto-verified (no smtp), direct login or redirect
                    router.push('/login?verified=true');
                }
            } else {
                setError(data.message || 'Ro\'yxatdan o\'tishda xatolik');
            }
        } catch (err) {
            setError('Server bilan bog\'lanishda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: registeredEmail,
                    code: verificationCode
                })
            });

            const data = await response.json();

            if (data.success) {
                router.push('/login?verified=true');
            } else {
                setError(data.message || 'Tasdiqlash xatosi');
            }
        } catch (err) {
            setError('Server bilan bog\'lanishda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        try {
            const res = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: registeredEmail })
            });
            const data = await res.json();
            if (data.success) {
                setResendTimer(60); // 60s cooldown
            } else {
                setError(data.message);
            }
        } catch (e) {
            setError('Qayta yuborishda xatolik');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-12">
            <AnimatePresence mode="wait">
                {step === 'register' ? (
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <Card className="p-8 space-y-6">
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-serif text-[var(--foreground)]">Ro'yxatdan O'tish</h1>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                    Baxtli kuningizni biz bilan boshlang
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleRegister}>
                                <Input
                                    label="To'liq ism-sharifingiz"
                                    type="text"
                                    required
                                    placeholder="Azizbek To'rayev"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Email"
                                        type="email"
                                        required
                                        placeholder="example@mail.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <Input
                                        label="Telefon"
                                        type="tel"
                                        required
                                        placeholder="+998"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <Input
                                    label="Parol"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    size="lg"
                                    className="w-full mt-6"
                                >
                                    {loading ? 'Yuklanmoqda...' : 'Hisob Yaratish'}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-[var(--border)]" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-[var(--muted-foreground)]">
                                        Yoki
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => signIn('google')}
                                className="w-full"
                            >
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                                Google bilan ro'yxatdan o'tish
                            </Button>

                            <p className="text-center text-sm text-[var(--muted-foreground)]">
                                Hisobingiz bormi?{' '}
                                <Link href="/login" className="text-[var(--primary)] font-semibold hover:underline">
                                    Kirish
                                </Link>
                            </p>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="verify"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <Card className="p-8 space-y-6">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto">
                                    <Mail className="text-[var(--primary)]" size={32} />
                                </div>
                                <h1 className="text-3xl font-serif text-[var(--foreground)]">Email Tasdiqlash</h1>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                    <strong className="text-[var(--foreground)]">{registeredEmail}</strong> manziliga 6 raqamli kod yuborildi
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={handleVerify}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--foreground)]">
                                        Tasdiqlash Kodi
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        placeholder="123456"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-6 py-4 text-center text-2xl font-bold tracking-[1em] rounded-2xl border-2 border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading || verificationCode.length !== 6}
                                    size="lg"
                                    className="w-full"
                                >
                                    {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
                                </Button>
                            </form>

                            <div className="space-y-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={resendTimer > 0 || loading}
                                    onClick={handleResend}
                                    className="w-full"
                                >
                                    {resendTimer > 0 ? `Qayta yuborish (${resendTimer}s)` : 'Kod kelmadimi? Qayta yuborish'}
                                </Button>

                                <button
                                    onClick={() => setStep('register')}
                                    className="w-full text-center text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                                >
                                    ← Orqaga qaytish
                                </button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
