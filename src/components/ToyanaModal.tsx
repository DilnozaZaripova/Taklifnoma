'use client';

import { useState } from 'react';

export default function ToyanaModal({ groomName, isOpen, onClose }: { groomName: string, isOpen: boolean, onClose: () => void }) {
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState(1);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="glass w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl opacity-50 hover:opacity-100">✕</button>

                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-serif mb-2">To'yana Yuborish</h2>
                            <p className="text-sm text-foreground/60">{groomName} va oilasiga o'z tilaklaringizni bildiring.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium">Summani Tanlang (UZS)</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[100000, 200000, 500000, 1000000].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(val.toString())}
                                        className={`p-3 rounded-xl border transition-all ${amount === val.toString() ? 'border-primary bg-primary/10' : 'border-border hover:bg-black/5'}`}
                                    >
                                        {val.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-4 bg-white/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Boshqa summa..."
                            />
                        </div>

                        <button onClick={() => setStep(2)} className="btn-primary w-full py-4 text-lg">Keyingi Qadam</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <div className="text-center">
                            <h2 className="text-2xl font-serif mb-2">To'lov Usuli</h2>
                            <p className="text-sm text-foreground/60">Xavfsiz to'lov tizimi orqali yuboring.</p>
                        </div>

                        <div className="space-y-3">
                            <PaymentOption name="Payme" icon="💳" />
                            <PaymentOption name="Click" icon="📱" />
                            <PaymentOption name="Uzcard / Humo" icon="🏧" />
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 p-4 border border-border rounded-xl">Orqaga</button>
                            <button className="flex-[2] btn-primary py-4">To'lash</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function PaymentOption({ name, icon }: { name: string, icon: string }) {
    return (
        <button className="w-full p-4 flex items-center justify-between glass border border-border/50 hover:border-primary transition-all rounded-xl group">
            <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <span className="font-medium">{name}</span>
            </div>
            <span className="text-primary opacity-0 group-hover:opacity-100">→</span>
        </button>
    );
}
