'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
        } else {
            // If no user in localstorage, maybe session expired?
            // For now, let's not force logout here to keep it simple, 
            // but in a real app we'd redirect to /login.
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <header className="flex justify-between items-start md:items-end flex-col md:flex-row gap-4">
            <div>
                <h1 className="text-4xl font-serif">Xush Kelibsiz, <span className="premium-gradient font-bold">{userName}!</span></h1>
                <p className="text-muted-foreground mt-2">To'y tayyorgarligini platformamiz bilan osonlashtiring.</p>
            </div>
            <button
                onClick={handleLogout}
                className="px-6 py-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
            >
                Tizimdan Chiqish
            </button>
        </header>
    );
}
