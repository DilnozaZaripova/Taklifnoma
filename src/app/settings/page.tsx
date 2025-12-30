'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, Lock, Bell, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('/api/user/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setProfileData({
                        fullName: data.data.fullName || '',
                        email: data.data.email || '',
                        phone: data.data.phone || ''
                    });
                }
            } else if (response.status === 401) {
                router.push('/login');
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Profil muvaffaqiyatli yangilandi!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Xatolik yuz berdi' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server bilan bog\'lanishda xatolik' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Yangi parollar mos kelmayapti' });
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' });
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Parol muvaffaqiyatli o\'zgartirildi!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Xatolik yuz berdi' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server bilan bog\'lanishda xatolik' });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'password', label: 'Parol', icon: Lock },
        { id: 'notifications', label: 'Bildirishnomalar', icon: Bell }
    ];

    return (
        <main className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="container-centered max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-4xl font-serif text-[var(--foreground)]">Sozlamalar</h1>
                        <p className="text-[var(--muted-foreground)]">Hisobingizni boshqaring va sozlashlarni o'zgartiring</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 border-b border-[var(--border)] overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id as any);
                                    setMessage(null);
                                }}
                                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-[var(--primary)] text-[var(--primary)]'
                                        : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                                    }`}
                            >
                                <tab.icon size={18} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Message */}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                                    ? 'bg-green-50 border border-green-200 text-green-700'
                                    : 'bg-red-50 border border-red-200 text-red-700'
                                }`}
                        >
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </motion.div>
                    )}

                    {/* Tab Content */}
                    <Card className="p-8">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-serif text-[var(--foreground)]">Shaxsiy Ma'lumotlar</h2>
                                    <p className="text-sm text-[var(--muted-foreground)]">
                                        Profilingizdagi asosiy ma'lumotlarni yangilang
                                    </p>
                                </div>

                                <Input
                                    label="To'liq ism"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                    placeholder="Ismingiz va familiyangiz"
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    placeholder="email@example.com"
                                />

                                <Input
                                    label="Telefon"
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    placeholder="+998 XX XXX XX XX"
                                />

                                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                                    {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                                </Button>
                            </form>
                        )}

                        {activeTab === 'password' && (
                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-serif text-[var(--foreground)]">Parolni O'zgartirish</h2>
                                    <p className="text-sm text-[var(--muted-foreground)]">
                                        Xavfsizligingiz uchun kuchli parol kiriting
                                    </p>
                                </div>

                                <Input
                                    label="Joriy parol"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    placeholder="Joriy parolingiz"
                                    required
                                />

                                <Input
                                    label="Yangi parol"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="Kamida 6 ta belgi"
                                    required
                                />

                                <Input
                                    label="Yangi parolni tasdiqlang"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="Yangi parolni qayta kiriting"
                                    required
                                />

                                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                                    {loading ? 'O\'zgartirmoqda...' : 'Parolni O\'zgartirish'}
                                </Button>
                            </form>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-serif text-[var(--foreground)]">Bildirishnomalar</h2>
                                    <p className="text-sm text-[var(--muted-foreground)]">
                                        Qaysi bildirishnomalarni olishni tanlang
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-xl">
                                        <div>
                                            <h3 className="font-medium text-[var(--foreground)]">Email bildirishnomalar</h3>
                                            <p className="text-sm text-[var(--muted-foreground)]">Yangi to'yana va RSVP haqida xabar olish</p>
                                        </div>
                                        <label className="relative inline-block w-12 h-6">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-full h-full bg-gray-200 peer-checked:bg-[var(--primary)] rounded-full peer-focus:ring-2 peer-focus:ring-[var(--primary)]/20 transition-colors"></div>
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                                        </label>
                                    </div>

                                    <div className="text-sm text-[var(--muted-foreground)] p-4 bg-[var(--muted)]/30 rounded-xl">
                                        <Shield size={16} className="inline mr-2" />
                                        Keyingi versiyalarda SMS va Telegram notification qo'shiladi
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>
        </main>
    );
}
