'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Gift, Image as ImageIcon, Info, Copy, Upload, CheckCircle, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';

// Mock data for prototype (until we have real data fetching tied up)
// In real app, we fetch from /api/weddings/:id
const MOCK_WEDDING = {
    groom: "Sardor",
    bride: "Malika",
    date: "2025-10-25",
    time: "18:00",
    location: "Versal To'yxonasi",
    uzcard: "8600 1234 5678 9012",
    humo: "9860 0101 2020 3030",
    owner: "Sardor A.",
    message: "Sizni kutamiz!"
};

export default function GuestPortal() {
    const params = useParams();
    const id = params?.id as string;

    // Tab State: 'details' | 'gift' | 'media'
    const [activeTab, setActiveTab] = useState('details');

    // Gift State
    const [giftAmount, setGiftAmount] = useState('');
    const [guestName, setGuestName] = useState('');
    const [giftSent, setGiftSent] = useState(false);

    // Media State
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Countdown Logic
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

    useEffect(() => {
        // Simple countdown
        const targetDate = new Date(MOCK_WEDDING.date + 'T' + MOCK_WEDDING.time).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Nusxalandi!");
    };

    const handleGiftSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would call API /api/gifts
        // await fetch('/api/gifts', ...)
        setTimeout(() => {
            setGiftSent(true);
        }, 1000);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            formData.append('weddingId', id);

            // Mock upload delay
            setTimeout(() => {
                setUploading(false);
                setUploadSuccess(true);
            }, 2000);

            // Real implementation:
            // await fetch('http://localhost:5000/api/media/upload', { method: 'POST', body: formData });
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF8] font-sans pb-24 relative overflow-hidden">
            {/* Background Noise */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#D4AF37]/20 p-4 text-center">
                <h1 className="font-serif text-2xl text-[#2D2D2D]">{MOCK_WEDDING.groom} & {MOCK_WEDDING.bride}</h1>
                <p className="text-xs uppercase tracking-widest text-[#D4AF37]">Mehmon Portali</p>
            </div>

            <div className="p-4 max-w-md mx-auto space-y-6 relative z-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'details' && (
                        <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

                            {/* Hero Card */}
                            <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#D4AF37]/20 text-center space-y-4">
                                <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                                    <Heart size={32} fill="currentColor" />
                                </div>
                                <h2 className="font-serif text-3xl text-[#2D2D2D]">Visol Oqshomi</h2>
                                <p className="text-gray-600 italic">"Ikki qalb birlashgan kun..."</p>

                                {/* Countdown */}
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    <div className="bg-[#FAFAFA] p-2 rounded-xl border border-gray-100">
                                        <span className="block text-xl font-bold text-[#D4AF37]">{timeLeft.days}</span>
                                        <span className="text-[10px] uppercase text-gray-400">Kun</span>
                                    </div>
                                    <div className="bg-[#FAFAFA] p-2 rounded-xl border border-gray-100">
                                        <span className="block text-xl font-bold text-[#D4AF37]">{timeLeft.hours}</span>
                                        <span className="text-[10px] uppercase text-gray-400">Soat</span>
                                    </div>
                                    <div className="bg-[#FAFAFA] p-2 rounded-xl border border-gray-100">
                                        <span className="block text-xl font-bold text-[#D4AF37]">{timeLeft.minutes}</span>
                                        <span className="text-[10px] uppercase text-gray-400">Daqiqa</span>
                                    </div>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 space-y-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-[#D4AF37]" />
                                    <div>
                                        <p className="font-bold text-[#2D2D2D]">{MOCK_WEDDING.location}</p>
                                        <p className="text-xs text-gray-500">{MOCK_WEDDING.date} | {MOCK_WEDDING.time}</p>
                                    </div>
                                </div>
                                {/* Mock Map */}
                                <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                                    Google Map Embed
                                </div>
                                <Button variant="outline" className="w-full text-xs h-10 border-[#D4AF37] text-[#DAA520]">Xaritani Ochish</Button>
                            </div>

                        </motion.div>
                    )}

                    {activeTab === 'gift' && (
                        <motion.div key="gift" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

                            <div className="text-center space-y-2">
                                <h2 className="font-serif text-2xl text-[#2D2D2D]">To'yana Yuborish</h2>
                                <p className="text-sm text-gray-500">Yoshlarni qo'llab-quvvatlang</p>
                            </div>

                            {/* Credit Card UI */}
                            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#333] text-white p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="flex justify-between items-start mb-8">
                                    <span className="font-bold tracking-widest text-sm text-gray-400">UZCARD</span>
                                    <CreditCardIcon />
                                </div>
                                <div className="space-y-1 mb-6">
                                    <p className="text-2xl font-mono tracking-widest">{MOCK_WEDDING.uzcard}</p>
                                    <p className="text-xs text-gray-400 uppercase">{MOCK_WEDDING.owner}</p>
                                </div>
                                <button onClick={() => handleCopy(MOCK_WEDDING.uzcard)} className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition">
                                    <Copy size={12} /> Nusxalash
                                </button>
                            </div>

                            <div className="bg-gradient-to-br from-[#2D3A8C] to-[#1E2761] text-white p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="flex justify-between items-start mb-8">
                                    <span className="font-bold tracking-widest text-sm text-gray-300">HUMO</span>
                                    <CreditCardIcon />
                                </div>
                                <div className="space-y-1 mb-6">
                                    <p className="text-2xl font-mono tracking-widest">{MOCK_WEDDING.humo}</p>
                                    <p className="text-xs text-gray-300 uppercase">{MOCK_WEDDING.owner}</p>
                                </div>
                                <button onClick={() => handleCopy(MOCK_WEDDING.humo)} className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition">
                                    <Copy size={12} /> Nusxalash
                                </button>
                            </div>

                            {/* Log Form */}
                            {!giftSent ? (
                                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                                    <h3 className="font-medium mb-4 flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> O'tkazmani tasdiqlash</h3>
                                    <form onSubmit={handleGiftSubmit} className="space-y-4">
                                        <Input placeholder="Ismingiz (Kimdan)" value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
                                        <Input placeholder="Summa (so'm)" type='number' value={giftAmount} onChange={(e) => setGiftAmount(e.target.value)} required />
                                        <Button className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-white">Yubordim</Button>
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center text-green-700">
                                    <CheckCircle size={48} className="mx-auto mb-2 opacity-50" />
                                    <p className="font-medium">Rahmat! To'yana qabul qilindi.</p>
                                    <Button variant="ghost" className="mt-2 text-sm" onClick={() => setGiftSent(false)}>Yana qo'shish</Button>
                                </div>
                            )}

                        </motion.div>
                    )}

                    {activeTab === 'media' && (
                        <motion.div key="media" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center space-y-4">
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ImageIcon size={32} />
                                </div>
                                <h2 className="font-serif text-xl text-[#2D2D2D]">Xotiralarni Ulashing</h2>
                                <p className="text-sm text-gray-500">To'yda olgan rasm va videolaringizni shu yerga yuklang. Kelin-kuyovlar uchun ajoyib sovg'a!</p>

                                {!uploadSuccess ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:bg-gray-50 transition cursor-pointer relative">
                                        <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        {uploading ? (
                                            <p className="text-gray-500 animate-pulse">Yuklanmoqda...</p>
                                        ) : (
                                            <div className="space-y-2">
                                                <Upload className="mx-auto text-gray-400" />
                                                <p className="text-xs text-gray-400">Rasmlarni tanlash uchun bosing</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-green-50 p-4 rounded-xl text-green-700 flex flex-col items-center">
                                        <CheckCircle size={32} className="mb-2" />
                                        <p>Fayllar yuklandi!</p>
                                        <button onClick={() => setUploadSuccess(false)} className="text-xs underline mt-2">Yana yuklash</button>
                                    </div>
                                )}
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Tab Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50 safe-area-bottom">
                <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')} icon={<Info size={20} />} label="Info" />
                <TabButton active={activeTab === 'gift'} onClick={() => setActiveTab('gift')} icon={<Gift size={20} />} label="To'yana" />
                <TabButton active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={<ImageIcon size={20} />} label="Xotira" />
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button onClick={onClick} className={cn("flex flex-col items-center gap-1 transition-colors", active ? "text-[#D4AF37]" : "text-gray-400 hover:text-gray-600")}>
            <div className={cn("p-1.5 rounded-xl transition-all", active ? "bg-[#D4AF37]/10" : "bg-transparent")}>
                {icon}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
}

function CreditCardIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
    )
}
