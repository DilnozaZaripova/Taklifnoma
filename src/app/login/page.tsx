'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

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
