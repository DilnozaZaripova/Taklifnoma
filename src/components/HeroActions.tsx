'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HeroActions() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
    }, []);

    return (
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link
                href={isLoggedIn ? "/dashboard" : "/register"}
                className="btn-luxe text-xl"
            >
                {isLoggedIn ? "Dashboardga O'tish" : "Taklifnoma Yaratish"}
            </Link>
            <Link
                href="/demo"
                className="btn-outline-luxe border-white text-white hover:bg-white/10 text-xl"
            >
                Namunalarni Ko'rish
            </Link>
        </div>
    );
}
