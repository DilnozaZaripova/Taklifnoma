'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FileText, Clock, Trash2 } from 'lucide-react';

interface DraftInvitation {
    id: string;
    content: string;
    language: string;
    createdAt: string;
    updatedAt: string;
}

export default function DraftsPage() {
    const [drafts, setDrafts] = useState<DraftInvitation[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/invitations/drafts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setDrafts(data.data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch drafts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu draft\'ni o\'chirishni xohlaysizmi?')) return;

        const token = localStorage.getItem('accessToken');
        try {
            await fetch(`http://localhost:5000/api/invitations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDrafts(drafts.filter(d => d.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <main className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="container-centered max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="space-y-2">
                        <h1 className="text-4xl font-serif text-[var(--foreground)]">Saqlangan Draft'lar</h1>
                        <p className="text-[var(--muted-foreground)]">Yarim tayyor taklifnomalaringiz</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : drafts.length === 0 ? (
                        <Card className="p-12 text-center">
                            <FileText className="mx-auto text-[var(--muted-foreground)] mb-4" size={48} />
                            <h2 className="text-xl font-serif text-[var(--foreground)] mb-2">Hech qanday draft yo'q</h2>
                            <p className="text-[var(--muted-foreground)] mb-6">Yangi taklifnoma yarating va avtomatik saqlanadi</p>
                            <Button onClick={() => router.push('/dashboard')}>Dashboard'ga qaytish</Button>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {drafts.map((draft) => (
                                <Card key={draft.id} className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText size={20} className="text-[var(--primary)]" />
                                                <h3 className="font-semibold text-[var(--foreground)]">
                                                    {draft.language === 'UZ' ? 'O\'zbek' : 'Rus'} tilida draft
                                                </h3>
                                            </div>
                                            <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
                                                {draft.content.substring(0, 150)}...
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    <span>Yangilandi: {formatDate(draft.updatedAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                onClick={() => router.push(`/dashboard?draftId=${draft.id}`)}
                                                size="sm"
                                            >
                                                Davom ettirish
                                            </Button>
                                            <button
                                                onClick={() => handleDelete(draft.id)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
