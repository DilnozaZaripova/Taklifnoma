'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Gift, Image as ImageIcon, MapPin, Heart, Clock, DollarSign, Camera } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Theme styles map - duplicated from WeddingWizard for now (should share code later)
const THEME_STYLES = {
    'royal-gold': "bg-[#0a1f2e] text-[#D4AF37] border-[#D4AF37]",
    'modern-minimalist': "bg-[#F9F7F2] text-[#333] font-sans",
    'national-heritage': "bg-white text-[#2D2D2D] border-blue-600"
};

export default function PublicWeddingPage({ params }: { params: Promise<{ slug: string }> }) {
    const [slug, setSlug] = useState<string>('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'invite' | 'gift' | 'media'>('invite');

    // Gift State
    const [giftForm, setGiftForm] = useState({ guestName: '', amount: '', message: '' });
    const [giftStatus, setGiftStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    // Media State
    const [mediaForm, setMediaForm] = useState({ guestName: '', caption: '', fileUrl: '' });
    const [mediaStatus, setMediaStatus] = useState<'idle' | 'uploading' | 'sent' | 'error'>('idle');

    useEffect(() => {
        params.then(p => {
            setSlug(p.slug);
            fetchWeddingDetails(p.slug);
        });
    }, [params]);

    const fetchWeddingDetails = async (s: string) => {
        try {
            const res = await fetch(`/api/public/wedding/${s}`);
            const json = await res.json();
            if (json.success) {
                setData(json.data);
            } else {
                notFound();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSendGift = async (e: React.FormEvent) => {
        e.preventDefault();
        setGiftStatus('sending');
        try {
            await fetch('/api/public/gift', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...giftForm, weddingId: data.id })
            });
            setGiftStatus('sent');
        } catch (e) {
            setGiftStatus('error');
        }
    };

    const handleUploadMedia = async (e: React.FormEvent) => {
        e.preventDefault();
        setMediaStatus('uploading');
        // Simulate upload delay
        setTimeout(async () => {
            try {
                // In real app, we would upload file here. 
                // For this demo, we assume fileUrl is passed or we just send metadata.
                // We'll simulate a fileUrl for the MVP
                const mockUrl = `https://picsum.photos/seed/${Math.random()}/800/600`;

                await fetch('/api/public/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...mediaForm,
                        weddingId: data.id,
                        fileUrl: mockUrl
                    })
                });
                setMediaStatus('sent');
            } catch (e) {
                setMediaStatus('error');
            }
        }, 1500);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>;
    if (!data) return <div className="min-h-screen flex items-center justify-center">Topilmadi</div>;

    const theme = data.invitation?.template || 'royal-gold';

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Hero */}
            <header className="relative h-[60vh] overflow-hidden flex items-center justify-center text-center text-white">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=2000')] bg-cover bg-center" />

                <div className="relative z-20 space-y-4 px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <p className="font-serif italic text-xl md:text-2xl">Bismillahir Rohmanir Rohim</p>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold">
                        {data.couple.groom} & {data.couple.bride}
                    </h1>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30">
                        <Clock size={18} />
                        <span>{new Date(data.event.date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <MapPin size={18} />
                        <span>{data.event.location}</span>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b shadow-sm">
                <div className="max-w-md mx-auto flex justify-around p-2">
                    <button
                        onClick={() => setActiveTab('invite')}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${activeTab === 'invite' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Heart size={24} className={activeTab === 'invite' ? 'fill-blue-600' : ''} />
                        <span className="text-xs font-medium">Taklifnoma</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('gift')}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${activeTab === 'gift' ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Gift size={24} />
                        <span className="text-xs font-medium">To'yana</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('media')}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${activeTab === 'media' ? 'text-purple-600 bg-purple-50' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Camera size={24} />
                        <span className="text-xs font-medium">Media</span>
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">

                    {/* INVITATION VIEW */}
                    {activeTab === 'invite' && (
                        <motion.div
                            key="invite"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <Card className={`p-8 md:p-12 text-center shadow-2xl min-h-[500px] flex flex-col justify-center items-center ${THEME_STYLES[theme as keyof typeof THEME_STYLES]}`}>
                                <h2 className="text-3xl font-serif mb-6 border-b-2 inline-block pb-2 border-current opacity-80">
                                    {data.invitation?.meta?.headline || 'Taklifnoma'}
                                </h2>
                                <p className="whitespace-pre-wrap text-lg leading-relaxed opacity-90 mb-8">
                                    {data.invitation?.content}
                                </p>
                                <p className="font-cursive text-xl opacity-75">
                                    {data.invitation?.meta?.footer_quote}
                                </p>
                            </Card>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <MapPin className="text-red-500" /> Manzil
                                </h3>
                                <p className="text-gray-600">{data.event.location}</p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.event.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-gray-100 hover:bg-gray-200 text-center py-3 rounded-xl transition font-medium"
                                >
                                    Google Kartada Ochish
                                </a>
                            </div>
                        </motion.div>
                    )}

                    {/* GIFT VIEW */}
                    {activeTab === 'gift' && (
                        <motion.div
                            key="gift"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Card className="p-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Gift className="text-green-600" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold">Yoshlarga To'yana</h2>
                                    <p className="text-gray-500 text-sm">Tilaklaringiz va sovg'angizni yuboring</p>
                                </div>

                                {giftStatus === 'sent' ? (
                                    <div className="text-center py-10 bg-green-50 rounded-xl">
                                        <div className="inline-flex p-3 bg-green-100 rounded-full mb-3">
                                            <Check size={32} className="text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-green-800">Rahmat!</h3>
                                        <p className="text-green-700">Sovg'angiz yetkazildi.</p>
                                        <Button onClick={() => setGiftStatus('idle')} variant="outline" className="mt-4">
                                            Yana yuborish
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSendGift} className="space-y-4">
                                        <Input
                                            label="Ismingiz (Ixtiyoriy)"
                                            placeholder="Mehmon"
                                            value={giftForm.guestName}
                                            onChange={(e) => setGiftForm({ ...giftForm, guestName: e.target.value })}
                                        />
                                        <Input
                                            label="Summa (UZS)"
                                            type="number"
                                            required
                                            placeholder="100 000"
                                            value={giftForm.amount}
                                            onChange={(e) => setGiftForm({ ...giftForm, amount: e.target.value })}
                                        />
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium">Tilaklaringiz</label>
                                            <textarea
                                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                rows={3}
                                                placeholder="Baxtli bo'linglar!"
                                                value={giftForm.message}
                                                onChange={(e) => setGiftForm({ ...giftForm, message: e.target.value })}
                                            />
                                        </div>

                                        <Button type="submit" disabled={giftStatus === 'sending'} className="w-full bg-green-600 hover:bg-green-700">
                                            {giftStatus === 'sending' ? 'Yuborilmoqda...' : 'Yuborish'}
                                        </Button>
                                        <p className="text-xs text-center text-gray-400 mt-2">Hozircha faqat test rejimida (To'lov talab qilinmaydi)</p>
                                    </form>
                                )}
                            </Card>
                        </motion.div>
                    )}

                    {/* MEDIA VIEW */}
                    {activeTab === 'media' && (
                        <motion.div
                            key="media"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Card className="p-6">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Camera className="text-purple-600" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold">Fotogalereya</h2>
                                    <p className="text-gray-500 text-sm">To'ydan esdalik rasm va videolarni yuklang</p>
                                </div>

                                {mediaStatus === 'sent' ? (
                                    <div className="text-center py-10 bg-purple-50 rounded-xl">
                                        <h3 className="text-xl font-bold text-purple-800">Yuklandi!</h3>
                                        <p className="text-purple-700">Rasmingiz galereyaga qo'shildi.</p>
                                        <Button onClick={() => setMediaStatus('idle')} variant="outline" className="mt-4">
                                            Yana yuklash
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleUploadMedia} className="space-y-4">
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                                            <ImageIcon className="mx-auto text-gray-400 mb-2" size={40} />
                                            <p className="text-sm font-medium text-gray-600">Rasm tanlash uchun bosing</p>
                                            <p className="text-xs text-gray-400 mt-1">yoki kamerani oching</p>
                                            {/* Hidden file input would go here */}
                                        </div>

                                        <Input
                                            label="Kimdan (Ismingiz)"
                                            placeholder="Mehmon"
                                            value={mediaForm.guestName}
                                            onChange={(e) => setMediaForm({ ...mediaForm, guestName: e.target.value })}
                                        />
                                        <Input
                                            label="Izoh (Caption)"
                                            placeholder="Ajoyib lahza!"
                                            value={mediaForm.caption}
                                            onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                                        />

                                        <Button type="submit" disabled={mediaStatus === 'uploading'} className="w-full bg-purple-600 hover:bg-purple-700">
                                            {mediaStatus === 'uploading' ? 'Yuklanmoqda...' : 'Yuklash'}
                                        </Button>
                                    </form>
                                )}

                                {/* Recent Uploads Preview */}
                                {data.media && data.media.length > 0 && (
                                    <div className="mt-8 pt-8 border-t">
                                        <h4 className="font-semibold mb-4">Rasmiy Galereya</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {data.media.map((item: any) => (
                                                <div key={item.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={item.fileUrl} alt="Wedding" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </main>
    );
}

import { Check } from 'lucide-react'; // Ensure Check is imported
