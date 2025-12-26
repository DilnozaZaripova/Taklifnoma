'use client';

import { useState, use } from 'react';
import ToyanaModal from '@/components/ToyanaModal';
import GuestMediaGallery from '@/components/GuestMediaGallery';

export default function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [isToyanaOpen, setIsToyanaOpen] = useState(false);
    const [showMedia, setShowMedia] = useState(false);

    return (
        <div className="min-h-screen bg-[#fffcf5] text-[#2c3e50] font-serif overflow-hidden">
            {/* Elegant Border */}
            <div className="fixed inset-4 border border-[#d4af37]/30 pointer-events-none z-50 rounded-[40px]" />
            <div className="fixed inset-6 border border-[#d4af37]/10 pointer-events-none z-50 rounded-[30px]" />

            <main className="relative z-10 max-w-lg mx-auto px-6 py-20 text-center space-y-16">
                {/* Header Decoration */}
                <div className="space-y-4 animate-in fade-in zoom-in duration-1000">
                    <div className="w-16 h-16 mx-auto mb-8 border-2 border-[#d4af37] rotate-45 flex items-center justify-center">
                        <span className="-rotate-45 text-2xl">B&M</span>
                    </div>
                    <p className="tracking-[0.3em] text-[#d4af37] uppercase text-sm font-sans">Nikoh To'yi</p>
                </div>

                {/* Names */}
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <h1 className="text-6xl md:text-7xl font-bold">Azizbek</h1>
                    <span className="text-4xl italic text-[#d4af37]">&</span>
                    <h1 className="text-6xl md:text-7xl font-bold">Madina</h1>
                </div>

                {/* AI Text Content */}
                <div className="max-w-xs mx-auto text-lg leading-relaxed italic opacity-80 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                    "Muhabbat qasridagi ilk qadam... Keling, bu quvonchli kunimizda farzandlarimiz Azizbek va Madinaning visol oqshomida birga bo'laylik."
                </div>

                {/* Date & Time */}
                <div className="glass p-8 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                    <div className="text-2xl font-sans font-light tracking-widest">24.12.2025</div>
                    <div className="w-10 h-px bg-[#d4af37]/30 mx-auto" />
                    <div className="text-xl">SOAT 18:00 DA</div>
                </div>

                {/* Venue */}
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000">
                    <h3 className="text-xl uppercase tracking-widest text-[#d4af37]">Manzil</h3>
                    <p className="text-2xl">Versal To'yxonasi</p>
                    <p className="text-sm font-sans opacity-60">Toshkent sh., Yunusobod tumani</p>
                </div>

                {/* Actions */}
                <div className="pt-10 space-y-4 font-sans animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-[1200ms]">
                    <button className="w-full btn-primary py-4 rounded-full text-lg shadow-xl shadow-[#d4af37]/20">
                        📍 Manzilni Ko'rish
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setIsToyanaOpen(true)}
                            className="glass py-4 rounded-full text-sm font-medium hover:bg-white/40 transition-all"
                        >
                            💰 To'yana
                        </button>
                        <button
                            onClick={() => setShowMedia(!showMedia)}
                            className="glass py-4 rounded-full text-sm font-medium hover:bg-white/40 transition-all"
                        >
                            📸 Media
                        </button>
                    </div>
                </div>

                {/* Dynamic Content */}
                {showMedia && (
                    <div className="pt-10 animate-in fade-in slide-in-from-top-4 duration-500">
                        <h3 className="text-2xl font-serif mb-6">To'y Galereyasi</h3>
                        <GuestMediaGallery />
                    </div>
                )}
            </main>

            <ToyanaModal
                groomName="Azizbek"
                isOpen={isToyanaOpen}
                onClose={() => setIsToyanaOpen(false)}
            />

            {/* Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-5 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#d4af37] rounded-full blur-[100px]" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#d4af37] rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
