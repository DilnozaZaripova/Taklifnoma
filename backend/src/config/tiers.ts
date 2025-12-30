export const SUBSCRIPTION_TIERS = {
    FREE: {
        name: 'FREE',
        displayName: 'Bepul',
        price: 0,
        limits: {
            maxWeddings: 1,
            maxGuestsPerWedding: 50,
            maxInvitations: 3,
            maxTablesPerWedding: 5,
            aiGenerationsPerMonth: 10
        },
        features: [
            'Bitta to\'y uchun',
            '50 tagacha mehmon',
            '3 ta taklifnoma',
            'AI generatsiya (10/oy)',
            'Asosiy RSVP'
        ]
    },
    PREMIUM: {
        name: 'PREMIUM',
        displayName: 'Premium',
        price: 99000,
        limits: {
            maxWeddings: 5,
            maxGuestsPerWedding: 200,
            maxInvitations: 20,
            maxTablesPerWedding: 30,
            aiGenerationsPerMonth: 50
        },
        features: [
            '5 ta to\'y',
            '200 tagacha mehmon',
            'Cheksiz taklifnoma',
            'AI generatsiya (50/oy)',
            'Premium shablon',
            'To\'yana tracking',
            'Stol rejasi'
        ]
    },
    ENTERPRISE: {
        name: 'ENTERPRISE',
        displayName: 'Enterprise',
        price: 299000,
        limits: {
            maxWeddings: Infinity,
            maxGuestsPerWedding: Infinity,
            maxInvitations: Infinity,
            maxTablesPerWedding: Infinity,
            aiGenerationsPerMonth: Infinity
        },
        features: [
            'Cheksiz to\'ylar',
            'Cheksiz mehmonlar',
            'Cheksiz taklifnoma',
            'Cheksiz AI',
            'Premium shablon',
            '24/7 qo\'llab-quvvatlash',
            'Maxsus dizayn',
            'API access'
        ]
    }
};

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

export function getTierLimits(tier: SubscriptionTier) {
    return SUBSCRIPTION_TIERS[tier]?.limits || SUBSCRIPTION_TIERS.FREE.limits;
}

export function getTierInfo(tier: SubscriptionTier) {
    return SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.FREE;
}
