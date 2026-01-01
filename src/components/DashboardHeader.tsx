'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button'; // Premium Button
import { LogOut, Settings } from 'lucide-react';

export default function DashboardHeader() {
    const [userName, setUserName] = useState('Azizbek');
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.fullName) {
                    setUserName(user.fullName);
                }
            } catch (e) {
                console.error("Error parsing user from localStorage:", e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <header className="flex justify-between items-start md:items-end flex-col md:flex-row gap-6 pb-6 border-b border-[var(--border)]/50">
            <div className="space-y-2">
                <span className="text-sm font-medium tracking-widest text-[var(--primary)] uppercase">
                    Boshqaruv Paneli
                </span>
                <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)]">
                    Xush Kelibsiz, <span className="text-[var(--primary)] italic">{userName}</span>
                </h1>
                <p className="text-[var(--muted-foreground)] max-w-md font-light">
                    To'yga tayyorgarlik jarayonini nazorat qiling va unutilmas xotiralarni yarating.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    onClick={() => router.push('/settings')}
                    variant="outline"
                    size="sm"
                    className="text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--secondary)]/20"
                >
                    <Settings className="mr-2" size={18} /> Sozlamalar
                </Button>
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                    <LogOut className="mr-2" size={18} /> Chiqish
                </Button>
            </div>
        </header>
    );
}
