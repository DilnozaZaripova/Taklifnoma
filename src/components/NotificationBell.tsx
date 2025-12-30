'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Gift, Users, Image, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'RSVP' | 'GIFT' | 'MEDIA' | 'SYSTEM';
    isRead: boolean;
    createdAt: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
        return () => clearInterval(interval);
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

    const fetchUnreadCount = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5000/api/notifications/unread-count', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setUnreadCount(data.data.count);
                }
            }
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    const fetchNotifications = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setNotifications(data.data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBellClick = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            fetchNotifications();
        }
    };

    const markAsRead = async (id: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'RSVP': return <Users size={18} className="text-blue-500" />;
            case 'GIFT': return <Gift size={18} className="text-green-500" />;
            case 'MEDIA': return <Image size={18} className="text-purple-500" />;
            default: return <AlertCircle size={18} className="text-gray-500" />;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Hozirgina';
        if (diffMins < 60) return `${diffMins} daqiqa oldin`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} soat oldin`;
        return `${Math.floor(diffMins / 1440)} kun oldin`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleBellClick}
                className="relative p-2 rounded-full hover:bg-[var(--muted)] transition-colors"
            >
                <Bell size={22} className="text-[var(--foreground)]" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                            <h3 className="font-semibold text-[var(--foreground)]">Bildirishnomalar</h3>
                            <Link
                                href="/notifications"
                                className="text-sm text-[var(--primary)] hover:underline"
                                onClick={() => setShowDropdown(false)}
                            >
                                Barchasini ko'rish
                            </Link>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="inline-block w-6 h-6 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-[var(--muted-foreground)]">
                                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Bildirishnomalar yo'q</p>
                                </div>
                            ) : (
                                notifications.slice(0, 5).map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                                        className={`p-4 border-b border-[var(--border)] hover:bg-[var(--muted)]/30 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50/50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">{getIcon(notification.type)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="font-medium text-sm text-[var(--foreground)]">
                                                        {notification.title}
                                                    </p>
                                                    {!notification.isRead && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                                    {formatTime(notification.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
