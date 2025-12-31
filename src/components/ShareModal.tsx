'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Send, Download, ImageIcon, FileText } from 'lucide-react';
import Button from './ui/Button';
import { QRCodeSVG } from 'qrcode.react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    slug: string;
    coupleName: string;
}

export default function ShareModal({ isOpen, onClose, slug, coupleName }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    // Use window.location.origin if available, else placeholder
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://taklifnoma.uz';
    const shareUrl = `${origin}/invite/${slug}`;
    const shareText = `🎉 ${coupleName}ning nikoh to'yiga taklifnoma!\n\nBatafsil ma'lumot va lokatsiya ushbu havolada:\n${shareUrl}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Social Share Links
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                >
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-lg">Taklifnomani Ulashish</h3>
                        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* QR Code Section */}
                        <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl">
                            <QRCodeSVG value={shareUrl} size={150} level="M" />
                            <p className="text-xs text-gray-500 mt-2">Mehmonlar skaner qilishi uchun</p>
                        </div>

                        {/* Copy Link Section */}
                        <div className="flex gap-2">
                            <input
                                readOnly
                                value={shareUrl}
                                className="flex-1 px-4 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none text-gray-600"
                            />
                            <Button onClick={handleCopy} variant="outline" size="sm" className="shrink-0">
                                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                            </Button>
                        </div>

                        {/* Social Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-medium">
                                <Send size={18} /> Telegram
                            </a>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-medium">
                                <span className="font-bold">WA</span> WhatsApp
                            </a>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="flex items-center justify-center gap-2 w-full text-xs">
                                <FileText size={16} /> PDF Yuklash
                            </Button>
                            <Button variant="outline" className="flex items-center justify-center gap-2 w-full text-xs">
                                <ImageIcon size={16} /> Rasm Yuklash
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
