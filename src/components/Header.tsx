'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Menu, X } from 'lucide-react';
import NotificationBell from './NotificationBell';

interface UserData {
    id: string;
    fullName: string | null;
    email: string | null;
}

export default function Header() {
    const [user, setUser] = useState<UserData | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5000/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setUser(data.data);
                }
            } else if (response.status === 401) {
                // Token expired, clear storage
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setShowDropdown(false);
        router.push('/');
    };

    const getInitials = (name: string | null) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
            <nav className="container-centered py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <span className="text-xl font-serif font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                            Taklifnoma
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <NotificationBell />
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-[var(--muted)] transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                                            {getInitials(user.fullName)}
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <p className="text-sm font-medium text-[var(--foreground)]">
                                                {user.fullName || 'User'}
                                            </p>
                                            <p className="text-xs text-[var(--muted-foreground)]">
                                                {user.email}
                                            </p>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {showDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden"
                                            >
                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--muted)] transition-colors"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <User size={18} className="text-[var(--primary)]" />
                                                    <span className="text-sm font-medium">Dashboard</span>
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--muted)] transition-colors"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <Settings size={18} className="text-[var(--primary)]" />
                                                    <span className="text-sm font-medium">Sozlamalar</span>
                                                </Link>
                                                <div className="border-t border-[var(--border)]"></div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                                                >
                                                    <LogOut size={18} />
                                                    <span className="text-sm font-medium">Chiqish</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="px-6 py-2.5 rounded-full border border-[var(--border)] text-[var(--foreground)] font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                                >
                                    Kirish
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2.5 rounded-full bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity shadow-[var(--shadow-luxury)]"
                                >
                                    Ro'yxatdan o'tish
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="md:hidden p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
                    >
                        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pb-4 border-t border-[var(--border)] pt-4"
                        >
                            {user ? (
                                <div className="space-y-2">
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--muted)] transition-colors"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <User size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--muted)] transition-colors"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <Settings size={18} />
                                        <span>Sozlamalar</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setShowMobileMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span>Chiqish</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        href="/login"
                                        className="block w-full px-6 py-3 rounded-full border border-[var(--border)] text-center font-medium hover:border-[var(--primary)] transition-all"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        Kirish
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block w-full px-6 py-3 rounded-full bg-[var(--primary)] text-white text-center font-medium hover:opacity-90 transition-opacity"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        Ro'yxatdan o'tish
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
