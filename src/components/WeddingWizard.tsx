'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ChevronLeft, ChevronRight, Sparkles, AlertCircle, Wand2, Quote, Palette, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';

type Theme = 'royal-gold' | 'modern-minimalist' | 'national-heritage';

export default function WeddingWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('royal-gold');

    const [formData, setFormData] = useState({
        groom_name: '',
        bride_name: '',
        wedding_date: '',
        wedding_location: '',
        language: 'uz',
        tone: 'samimiy',
        style: 'milliy'
    });

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await fetch('http://localhost:5000/api/ai/generate-invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return;
            }

            const data = await response.json();

            if (data.success) {
                setResult(data.data);
                setStep(4);
            } else {
                throw new Error(data.message || 'Xatolik yuz berdi.');
            }
        } catch (err: any) {
            console.error(err);
            setError("Texnik xatolik: " + (err.message || "Server xatosi"));
        } finally {
            setLoading(false);
        }
    };

    // --- QR RENDERER ---
    const renderQRCode = (color: string) => {
        if (!formData.wedding_location) return null;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.wedding_location)}`;

        return (
            <div className="flex flex-col items-center gap-2 mt-8">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-[var(--border)]">
                    <QRCodeSVG
                        value={mapsUrl}
                        size={100}
                        fgColor={color}
                        bgColor="#FFFFFF"
                        level="M"
                    />
                </div>
                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] uppercase tracking-widest hover:underline opacity-70"
                    style={{ color: color }}
                >
                    <MapPin size={12} /> Manzilni Ko'rish
                </a>
            </div>
        );
    };


    // --- THEME RENDERER ---
    const renderInvitationCard = () => {
        if (!result) return null;

        const commonMotion = {
            initial: { rotateY: 90, opacity: 0 },
            animate: { rotateY: 0, opacity: 1 },
            transition: { duration: 0.8, type: "spring" }
        };

        // Use either new keys or legacy mapping
        const bodyText = result.invitation_body || result.main_body;
        const footerText = result.footer_quote || result.footer_note;
        const bismillahText = result.bismillah || "Bismillahir Rohmanir Rohim";

        // 1. ROYAL GOLD THEME
        if (theme === 'royal-gold') {
            return (
                <motion.div {...commonMotion} className="bg-[#0a1f2e] text-[#D4AF37] p-12 rounded-xl shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col justify-center border-double border-4 border-[#D4AF37]">
                    {/* Vintage Corner Decors */}
                    <div className="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-[#D4AF37]" />
                    <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-[#D4AF37]" />
                    <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-[#D4AF37]" />
                    <div className="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-[#D4AF37]" />

                    <div className="text-center space-y-6 z-10 font-[family-name:var(--font-royal)]">
                        <p className="font-[family-name:var(--font-cursive)] text-3xl opacity-80">{bismillahText}</p>

                        <div className="py-4">
                            <h1 className="text-6xl font-[family-name:var(--font-cursive)] mb-2">{formData.groom_name} & {formData.bride_name}</h1>
                            <p className="text-sm tracking-[0.3em] uppercase opacity-70">Wedding Invitation</p>
                        </div>

                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50 my-4" />

                        <h2 className="text-4xl font-[family-name:var(--font-royal)]">{result.headline}</h2>

                        <div className="text-lg leading-relaxed px-4 opacity-95 whitespace-pre-wrap font-[family-name:var(--font-serif)]">
                            {bodyText}
                        </div>

                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50 my-4" />

                        <p className="font-[family-name:var(--font-cursive)] text-2xl mt-4">{footerText}</p>

                        {renderQRCode('#D4AF37')}
                    </div>
                </motion.div>
            );
        }

        // 2. MODERN MINIMALIST THEME
        if (theme === 'modern-minimalist') {
            return (
                <motion.div {...commonMotion} className="bg-[#F9F7F2] text-[#333] p-12 md:p-16 rounded-[0px] shadow-2xl relative min-h-[600px] flex flex-col justify-center">
                    <div className="text-center space-y-8 z-10 font-[family-name:var(--font-modern)]">
                        <p className="text-xs tracking-[0.4em] uppercase text-[#666]">{bismillahText}</p>

                        <h1 className="text-7xl font-[family-name:var(--font-modern)] font-bold tracking-tighter leading-none mb-4">
                            {formData.groom_name}<br />{formData.bride_name}
                        </h1>

                        <div className="w-12 h-1 bg-[#333] mx-auto" />

                        <h2 className="text-3xl italic font-[family-name:var(--font-neutral)] font-light">{result.headline}</h2>

                        <div className="text-lg leading-loose px-4 whitespace-pre-wrap font-[family-name:var(--font-neutral)] font-light text-[#222]">
                            {bodyText}
                        </div>

                        <p className="text-xs tracking-widest uppercase mt-8 border-t border-gray-300 pt-8 inline-block px-8">{footerText}</p>

                        {renderQRCode('#333333')}
                    </div>
                </motion.div>
            );
        }

        // 3. NATIONAL HERITAGE THEME
        if (theme === 'national-heritage') {
            const ikatPattern = `radial-gradient(circle at 50% 50%, #D4AF37 1px, transparent 1px), radial-gradient(circle at 0% 0%, #D4AF37 1px, transparent 1px)`;

            return (
                <motion.div {...commonMotion} className="bg-white text-[#2D2D2D] p-12 rounded-3xl shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col justify-center border-[12px] border-[#D4AF37]/10">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: ikatPattern, backgroundSize: '20px 20px' }} />

                    <div className="text-center space-y-6 z-10 relative">
                        <div className="flex justify-center mb-4">
                            <Sparkles className="text-[#D4AF37]" />
                        </div>

                        <p className="font-[family-name:var(--font-serif)] italic text-[#D4AF37]">{bismillahText}</p>

                        <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-serif)] text-[#2D2D2D] mb-4">
                            {formData.groom_name} <span className="text-[#D4AF37]">&</span> {formData.bride_name}
                        </h1>

                        <h2 className="text-2xl font-[family-name:var(--font-serif)] uppercase tracking-wide border-y border-[#D4AF37]/30 py-2 inline-block px-12">
                            {result.headline}
                        </h2>

                        <div className="text-xl leading-relaxed whitespace-pre-wrap font-[family-name:var(--font-serif)]">
                            {bodyText}
                        </div>

                        <div className="flex justify-center mt-6">
                            <div className="w-full max-w-[200px] h-[1px] bg-[#D4AF37]" />
                        </div>
                        <p className="font-[family-name:var(--font-serif)] text-[#D4AF37] font-bold">{footerText}</p>

                        {renderQRCode('#D4AF37')}
                    </div>
                </motion.div>
            );
        }
    };


    return (
        <Card glass className="max-w-5xl mx-auto p-4 md:p-12 relative overflow-hidden min-h-[500px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {step <= totalSteps && (
                <div className="mb-12 relative z-10">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium tracking-widest uppercase text-[var(--muted-foreground)]">Qadam {step} / {totalSteps}</span>
                        <span className="text-sm font-serif text-[var(--primary)]">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-[var(--muted)]/50 h-1.5 rounded-full overflow-hidden">
                        <motion.div className="bg-[var(--primary)] h-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-8 p-4 bg-red-50/50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="relative z-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <div className="space-y-2 text-center md:text-left">
                                <h2 className="text-3xl font-serif text-[var(--foreground)]">Baxtli Juftlik</h2>
                                <p className="text-[var(--muted-foreground)] font-light">Taklifnoma kimning nomidan yozilishini kiriting.</p>
                            </div>
                            <div className="space-y-6">
                                <Input label="Kuyovning Ismi" required placeholder="Masalan: Sardor" value={formData.groom_name} onChange={(e) => setFormData({ ...formData, groom_name: e.target.value })} />
                                <Input label="Kelinning Ismi" required placeholder="Masalan: Malika" value={formData.bride_name} onChange={(e) => setFormData({ ...formData, bride_name: e.target.value })} />
                            </div>
                            <div className="pt-4"><Button type="button" onClick={() => setStep(2)} size="lg" className="w-full">Davom Etish <ChevronRight className="ml-2" size={20} /></Button></div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <div className="space-y-2 text-center md:text-left">
                                <h2 className="text-3xl font-serif text-[var(--foreground)]">Vaqt va Joy</h2>
                                <p className="text-[var(--muted-foreground)] font-light">Mehmonlar qayerga va qachon kelishi kerak?</p>
                            </div>
                            <div className="space-y-6">
                                <Input label="To'y Sanasi" type="date" required value={formData.wedding_date} onChange={(e) => setFormData({ ...formData, wedding_date: e.target.value })} />
                                <Input label="Tantanalar Saroyi Nomi" required placeholder="Masalan: 'Versal' to'yxonasi" value={formData.wedding_location} onChange={(e) => setFormData({ ...formData, wedding_location: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <Button type="button" onClick={() => setStep(1)} variant="outline" size="lg"><ChevronLeft className="mr-2" size={20} /> Orqaga</Button>
                                <Button type="button" onClick={() => setStep(3)} size="lg">Davom Etish <ChevronRight className="ml-2" size={20} /></Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <div className="space-y-2 text-center md:text-left">
                                <h2 className="text-3xl font-serif text-[var(--foreground)]">Uslub va Ohang</h2>
                                <p className="text-[var(--muted-foreground)] font-light">AI siz uchun qanday tilda va uslubda yozishini tanlang.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--foreground)] ml-1">Murojaat Ohangi</label>
                                    <select className="w-full px-5 py-4 rounded-2xl border border-[var(--border)] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all cursor-pointer" value={formData.tone} onChange={(e) => setFormData({ ...formData, tone: e.target.value })}>
                                        <option value="samimiy">Samimiy (Yaqinlar uchun)</option>
                                        <option value="rasmiy">Rasmiy (Hurmat)</option>
                                        <option value="iliq">Iliq (Romantik)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--foreground)] ml-1">Taklifnoma Tili</label>
                                    <select className="w-full px-5 py-4 rounded-2xl border border-[var(--border)] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all cursor-pointer" value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })}>
                                        <option value="uz">O'zbekcha (Lotin)</option>
                                        <option value="ru">Ruscha</option>
                                        <option value="en">Inglizcha</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <label className="text-sm font-medium text-[var(--foreground)] ml-1 flex items-center gap-2"><Palette size={16} /> Dizayn Uslubi</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button type="button" onClick={() => setTheme('royal-gold')} className={cn("p-4 rounded-xl border-2 transition-all text-sm font-serif", theme === 'royal-gold' ? "border-[#D4AF37] bg-[#D4AF37]/5 ring-2 ring-[#D4AF37]/20" : "border-[var(--border)] hover:border-[#D4AF37]/50")}>
                                        👑 Royal Gold
                                    </button>
                                    <button type="button" onClick={() => setTheme('modern-minimalist')} className={cn("p-4 rounded-xl border-2 transition-all text-sm font-sans tracking-widest uppercase", theme === 'modern-minimalist' ? "border-gray-800 bg-gray-50 ring-2 ring-gray-200" : "border-[var(--border)] hover:border-gray-400")}>
                                        ✨ Minimalist
                                    </button>
                                    <button type="button" onClick={() => setTheme('national-heritage')} className={cn("p-4 rounded-xl border-2 transition-all text-sm font-serif italic", theme === 'national-heritage' ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200" : "border-[var(--border)] hover:border-blue-400")}>
                                        🇺🇿 Milliy
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[var(--border)]/50 mt-8">
                                <Button type="button" onClick={() => setStep(2)} variant="outline" size="lg"><ChevronLeft className="mr-2" size={20} /> Orqaga</Button>
                                <Button type="submit" disabled={loading} size="lg" className="bg-[var(--primary)] text-white shadow-[var(--shadow-luxury)]">{loading ? 'Yaratilmoqda...' : <><Wand2 className="mr-2" size={20} /> Yaratish</>}</Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && result && (
                        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 space-y-8">
                            <div className="flex justify-center gap-4 mb-4">
                                <button type="button" onClick={() => setTheme('royal-gold')} className={cn("w-8 h-8 rounded-full border-2", theme === 'royal-gold' ? "border-[#D4AF37] bg-[#D4AF37]" : "border-gray-200 bg-[#D4AF37]/20")} title="Royal" />
                                <button type="button" onClick={() => setTheme('modern-minimalist')} className={cn("w-8 h-8 rounded-full border-2", theme === 'modern-minimalist' ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-gray-200")} title="Minimalist" />
                                <button type="button" onClick={() => setTheme('national-heritage')} className={cn("w-8 h-8 rounded-full border-2", theme === 'national-heritage' ? "border-blue-600 bg-blue-600" : "border-gray-200 bg-blue-200")} title="Milliy" />
                            </div>

                            {renderInvitationCard()}

                            <div className="flex justify-center gap-4 mt-8">
                                <Button type="button" onClick={() => window.print()} variant="outline">PDF Saqlash</Button>
                                <Button type="button" variant="ghost" onClick={() => setStep(1)}>Yangi Taklifnoma</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </Card>
    );
}
