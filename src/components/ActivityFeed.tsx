'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Gift, Image as ImageIcon, FileText } from 'lucide-react';

interface Activity {
    id: string;
    activityType: string;
    description: string;
    createdAt: string;
    metadata?: string;
}

export default function ActivityFeed({ limit = 10 }: { limit?: number }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5000/api/activity', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setActivities(data.data.slice(0, limit));
                }
            }
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'RSVP_SUBMITTED':
                return <Users size={18} className="text-blue-500" />;
            case 'GIFT_RECEIVED':
                return <Gift size={18} className="text-green-500" />;
            case 'MEDIA_UPLOADED':
                return <ImageIcon size={18} className="text-purple-500" />;
            case 'INVITATION_CREATED':
                return <FileText size={18} className="text-orange-500" />;
            default:
                return <Clock size={18} className="text-gray-500" />;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Hozirgina';
        if (diffMins < 60) return `${diffMins} daqiqa oldin`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} soat oldin`;
        return date.toLocaleDateString('uz-UZ', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-start gap-3 p-4 bg-[var(--muted)]/30 rounded-xl">
                        <div className="w-10 h-10 bg-[var(--muted)] rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-[var(--muted)] rounded w-3/4"></div>
                            <div className="h-3 bg-[var(--muted)] rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-[var(--muted-foreground)]">
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Hali hech qanday faoliyat yo'q</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {activities.map((activity, index) => (
                <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-4 bg-white border border-[var(--border)] rounded-xl hover:shadow-md transition-shadow"
                >
                    <div className="mt-1 w-10 h-10 flex items-center justify-center bg-[var(--muted)]/30 rounded-full">
                        {getIcon(activity.activityType)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--foreground)]">
                            {activity.description}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                            {formatTime(activity.createdAt)}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
