'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setSent(true);
            } else {
                setError(data.message || 'Xatolik yuz berdi');
            }
        } catch (err) {
            setError('Server bilan bog\'lanishda xatolik');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
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
                            <h1 className="text-2xl font-serif text-[var(--foreground)]">Kod Yuborildi!</h1>
                            <p className="text-[var(--muted-foreground)]">
                                <strong className="text-[var(--foreground)]">{email}</strong> manziliga parolni tiklash kodi yuborildi.
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
                            className="w-full"
                        >
                            Kodni Kiriting
                        </Button>
                        <Link href="/login" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                            Kirish sahifasiga qaytish
                        </Link>
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
                            <Mail className="text-[var(--primary)]" size={32} />
                        </div>
                        <h1 className="text-3xl font-serif text-[var(--foreground)]">Parolni Unutdingizmi?</h1>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            Emailingizni kiriting, parolni tiklash kodi yuboramiz
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Input
                            label="Email"
                            type="email"
                            required
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            size="lg"
                            className="w-full mt-6"
                        >
                            {loading ? 'Yuborilmoqda...' : 'Kod Yuborish'}
                        </Button>
                    </form>

                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Kirish sahifasiga qaytish
                    </Link>
                </Card>
            </motion.div>
        </main>
    );
}
