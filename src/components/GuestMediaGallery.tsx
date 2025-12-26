'use client';

import { useState } from 'react';

export default function GuestMediaGallery() {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    return (
        <div className="space-y-8">
            <div className="glass p-8 text-center border-dashed border-2 border-primary/30 rounded-[32px] hover:bg-primary/5 transition-colors cursor-pointer relative">
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                />
                <div className="text-4xl mb-4">📸</div>
                <h3 className="text-xl font-serif mb-2">To'y lahzalarini ulashing</h3>
                <p className="text-sm text-foreground/50">Rasm yoki videolarni bu yerga yuklang</p>
                {files.length > 0 && (
                    <div className="mt-4 text-primary font-medium">
                        {files.length} ta fayl tanlandi
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Mock existing media */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square glass rounded-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        <img
                            src={`https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop&sig=${i}`}
                            alt="Wedding"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {files.length > 0 && (
                <button
                    disabled={isUploading}
                    className="btn-primary w-full py-4 text-lg"
                >
                    {isUploading ? 'Yuklanmoqda...' : 'Yuklashni Boshlash'}
                </button>
            )}
        </div>
    );
}
