'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function LoginPage() {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Auto-exchange session for custom token
    useEffect(() => {
        if (session?.user?.email) {
            const exchangeSession = async () => {
                try {
                    const res = await fetch('/api/auth/exchange');
                    const data = await res.json();
                    if (data.success) {
                        localStorage.setItem('accessToken', data.accessToken);
                        localStorage.setItem('refreshToken', data.refreshToken);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        router.push('/dashboard');
                    }
                } catch (e) {
                    console.error('Session exchange failed', e);
                }
            };
            exchangeSession();
        }
    }, [session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('user', JSON.stringify(data.user));

                router.push('/dashboard');
            } else {
                setError(data.message || 'Hisobga kirishda xatolik');
            }
        } catch (err) {
            setError('Server bilan bog\'lanishda xatolik');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-serif text-[var(--foreground)]">Platformaga Kirish</h1>
                        <p className="text-sm text-[var(--muted-foreground)]">
                            Xush kelibsiz! Ma'lumotlaringizni kiriting
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <Input
                            label="Email yoki Telefon"
                            type="text"
                            required
                            placeholder="Masalan: +998901234567"
                            value={formData.identifier}
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        />

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
                            {loading ? 'Kirilmoqda...' : 'Kirish'}
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
                        Google bilan kirish
                    </Button>

                    <p className="text-center text-sm text-[var(--muted-foreground)]">
                        Hisobingiz yo'qmi?{' '}
                        <Link href="/register" className="text-[var(--primary)] font-semibold hover:underline">
                            Ro'yxatdan o'ting
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </main>
    );
}
