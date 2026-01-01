'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Header() {
    const { data: session, status } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Loading state - prevent layout shift
    if (status === 'loading') {
        return (
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)] h-[73px]">
                <nav className="container-centered py-4 flex items-center justify-between">
                    <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="hidden md:flex gap-4">
                        <div className="w-20 h-10 bg-gray-200 rounded-full animate-pulse" />
                        <div className="w-20 h-10 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </nav>
            </header>
        );
    }

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
                        {status === 'authenticated' ? (
                            <>
                                <NotificationBell />
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-[var(--muted)] transition-colors border border-transparent hover:border-[var(--border)]"
                                    >
                                        <div className="w-9 h-9 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                            {getInitials(session?.user?.name)}
                                        </div>
                                        <div className="text-left hidden lg:block pr-2">
                                            <p className="text-sm font-medium text-[var(--foreground)] truncate max-w-[120px]">
                                                {session?.user?.name || 'Foydalanuvchi'}
                                            </p>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {showDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden z-20"
                                            >
                                                <div className="px-5 py-4 bg-gray-50 border-b border-[var(--border)]">
                                                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                                                        {session?.user?.name}
                                                    </p>
                                                    <p className="text-xs text-[var(--muted-foreground)] truncate">
                                                        {session?.user?.email}
                                                    </p>
                                                </div>
                                                <div className="p-2">
                                                    <Link
                                                        href="/dashboard"
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors group"
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        <LayoutDashboard size={18} className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                                                        <span className="text-sm font-medium">Dashboard</span>
                                                    </Link>
                                                    {(session?.user as any)?.role === 'ADMIN' && (
                                                        <Link
                                                            href="/admin"
                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors group"
                                                            onClick={() => setShowDropdown(false)}
                                                        >
                                                            <Settings size={18} className="group-hover:text-blue-700 transition-colors" />
                                                            <span className="text-sm font-medium">Admin Panel</span>
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href="/settings"
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors group"
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        <Settings size={18} className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                                                        <span className="text-sm font-medium">Sozlamalar</span>
                                                    </Link>
                                                </div>
                                                <div className="border-t border-[var(--border)] p-2">
                                                    <button
                                                        onClick={() => signOut({ callbackUrl: '/' })}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                                                    >
                                                        <LogOut size={18} />
                                                        <span className="text-sm font-medium">Chiqish</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="px-6 py-2.5 rounded-full border border-[var(--border)] text-[var(--foreground)] font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all text-sm"
                                >
                                    Kirish
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2.5 rounded-full bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity shadow-[var(--shadow-luxury)] text-sm"
                                >
                                    Ro'yxatdan o'tish
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="md:hidden p-2 rounded-lg hover:bg-[var(--muted)] transition-colors text-[var(--foreground)]"
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
                            className="md:hidden mt-4 border-t border-[var(--border)]"
                        >
                            {status === 'authenticated' ? (
                                <div className="py-4 space-y-2">
                                    <div className="px-4 py-2 flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                                            {getInitials(session?.user?.name)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-medium text-[var(--foreground)] truncate">{session?.user?.name}</p>
                                            <p className="text-xs text-[var(--muted-foreground)] truncate">{session?.user?.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--muted)] transition-colors text-[var(--foreground)]"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <LayoutDashboard size={20} className="text-[var(--primary)]" />
                                        <span className="font-medium">Dashboard</span>
                                    </Link>
                                    {(session?.user as any)?.role === 'ADMIN' && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-blue-600"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <Settings size={20} className="text-blue-500" />
                                            <span className="font-medium">Admin Panel</span>
                                        </Link>
                                    )}
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--muted)] transition-colors text-[var(--foreground)]"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <Settings size={20} className="text-[var(--primary)]" />
                                        <span className="font-medium">Sozlamalar</span>
                                    </Link>
                                    <div className="border-t border-[var(--border)] my-2 pt-2">
                                        <button
                                            onClick={() => {
                                                signOut({ callbackUrl: '/' });
                                                setShowMobileMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                                        >
                                            <LogOut size={20} />
                                            <span className="font-medium">Chiqish</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-6 space-y-3 px-2">
                                    <Link
                                        href="/login"
                                        className="block w-full px-6 py-3 rounded-full border border-[var(--border)] text-center font-medium hover:border-[var(--primary)] bg-white"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        Kirish
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block w-full px-6 py-3 rounded-full bg-[var(--primary)] text-white text-center font-medium hover:opacity-90 shadow-[var(--shadow-luxury)]"
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
