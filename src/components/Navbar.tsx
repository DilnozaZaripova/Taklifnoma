"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-purple-600">
                            Inviter.uz
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/#features"
                            className="text-gray-700 hover:text-purple-600 transition font-medium"
                        >
                            Imkoniyatlar
                        </Link>
                        <Link
                            href="/#pricing"
                            className="text-gray-700 hover:text-purple-600 transition font-medium"
                        >
                            Narxlar
                        </Link>

                        {status === "loading" ? (
                            <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                        ) : session ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition"
                                >
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt="Avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                            {session.user?.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                    <span className="font-medium text-gray-800 max-w-[120px] truncate">
                                        {session.user?.name || "Foydalanuvchi"}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-gray-600 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                {session.user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-3 text-gray-700 hover:bg-purple-50 transition"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            📊 Dashboard
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-3 text-gray-700 hover:bg-purple-50 transition"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            👤 Profil
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition border-t border-gray-100"
                                        >
                                            🚪 Chiqish
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-purple-600 font-medium transition"
                                >
                                    Kirish
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition shadow-md hover:shadow-lg"
                                >
                                    Ro'yxatdan o'tish
                                </Link>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-gray-700 p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 space-y-2">
                        {session ? (
                            <>
                                <div className="pb-3 mb-3 border-b border-gray-200">
                                    <p className="font-medium text-gray-800">{session.user?.name}</p>
                                    <p className="text-sm text-gray-500">{session.user?.email}</p>
                                </div>
                                <Link href="/dashboard" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                                    Dashboard
                                </Link>
                                <Link href="/profile" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                                    Profil
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left py-2 text-red-600 border-t border-gray-200 mt-2 pt-3"
                                >
                                    Chiqish
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                                    Kirish
                                </Link>
                                <Link href="/register" className="block py-2 text-purple-600 font-semibold" onClick={() => setMenuOpen(false)}>
                                    Ro'yxatdan o'tish
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
