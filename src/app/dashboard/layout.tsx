'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [userInitial, setUserInitial] = useState('K');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.name) {
                    setUserInitial(user.name.charAt(0).toUpperCase());
                }
            } catch (e) { }
        }
    }, []);
    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center mx-4 mt-4">
                <Link href="/dashboard" className="text-2xl font-serif font-bold premium-gradient">
                    Taklifnoma
                </Link>
                <div className="flex gap-4 items-center">
                    <Link href="/dashboard/settings" className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        ⚙️
                    </Link>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                        {userInitial}
                    </div>
                </div>
            </nav>
            <main className="p-6 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
