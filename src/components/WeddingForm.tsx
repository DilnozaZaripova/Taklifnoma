'use client';

import { useState } from 'react';

export default function WeddingForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [formData, setFormData] = useState({
        groom_name: '',
        bride_name: '',
        wedding_date: '',
        wedding_location: '',
        language: 'uz',
        tone: 'samimiy',
        style: 'milliy'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:5000/api/ai/generate-invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setResult(data.data);
                setStep(4); // Show results step
            } else {
                alert(data.message || 'Xatolik yuz berdi');
            }
        } catch (err) {
            alert('Server bilan bog\'lanishda xatolik');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto glass p-8 mt-10">
            {step < 4 && (
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Qadam {step}</span>
                        <span className="text-sm text-foreground/50">{step}/3</span>
                    </div>
                    <div className="w-full bg-muted h-1 rounded-full">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-serif">Keling, tanishib olaylik</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">Kuyov Ismi</label>
                            <input
                                type="text"
                                required
                                value={formData.groom_name}
                                onChange={(e) => setFormData({ ...formData, groom_name: e.target.value })}
                                className="w-full p-3 bg-white/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Masalan: Azizbek"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Kelin Ismi</label>
                            <input
                                type="text"
                                required
                                value={formData.bride_name}
                                onChange={(e) => setFormData({ ...formData, bride_name: e.target.value })}
                                className="w-full p-3 bg-white/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Masalan: Madinabonu"
                            />
                        </div>
                        <button type="button" onClick={() => setStep(2)} className="btn-primary w-full">Davom Etish</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-serif">Sana va Manzil</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">To'y Sanasi</label>
                            <input
                                type="date"
                                required
                                value={formData.wedding_date}
                                onChange={(e) => setFormData({ ...formData, wedding_date: e.target.value })}
                                className="w-full p-3 bg-white/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">To'yxonaning Nomi</label>
                            <input
                                type="text"
                                required
                                value={formData.wedding_location}
                                onChange={(e) => setFormData({ ...formData, wedding_location: e.target.value })}
                                className="w-full p-3 bg-white/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Masalan: Versal"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" onClick={() => setStep(1)} className="p-3 border border-border rounded-xl hover:bg-black/5">Orqaga</button>
                            <button type="button" onClick={() => setStep(3)} className="btn-primary">Davom Etish</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-serif">Uslub va Ohang</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Murojaat Ohangi</label>
                                <select
                                    className="w-full p-3 bg-white/50 border border-border rounded-xl"
                                    value={formData.tone}
                                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                >
                                    <option value="samimiy">Samimiy</option>
                                    <option value="rasmiy">Rasmiy</option>
                                    <option value="iliq">Iliq</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Uslub</label>
                                <select
                                    className="w-full p-3 bg-white/50 border border-border rounded-xl"
                                    value={formData.style}
                                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                                >
                                    <option value="milliy">Milliy</option>
                                    <option value="klassik">Klassik</option>
                                    <option value="zamonaviy">Zamonaviy</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Taklifnoma Tili</label>
                            <select
                                className="w-full p-3 bg-white/50 border border-border rounded-xl"
                                value={formData.language}
                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            >
                                <option value="uz">O'zbekcha</option>
                                <option value="ru">Ruscha</option>
                                <option value="en">Inglizcha</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button type="button" onClick={() => setStep(2)} className="p-3 border border-border rounded-xl hover:bg-black/5">Orqaga</button>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Yaratilmoqda...' : 'Tayyor!'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && result && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-500 text-center">
                        <div className="text-4xl">✨</div>
                        <h2 className="text-2xl font-serif premium-gradient">Sizning Taklifnomangiz Tayyor!</h2>
                        <div className="p-6 bg-white/60 border border-primary/20 rounded-2xl text-left whitespace-pre-wrap font-light leading-relaxed">
                            {result.generated_text}
                        </div>
                        <div className="flex flex-col gap-3">
                            <button type="button" onClick={() => window.print()} className="btn-primary">Chop etish / Saqlash</button>
                            <button type="button" onClick={() => setStep(1)} className="text-sm text-foreground/50 hover:text-primary">Qaytadan yaratish</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
