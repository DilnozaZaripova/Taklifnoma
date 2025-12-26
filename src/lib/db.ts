// Mock Prisma client to bypass initialization errors for the demo
export default {
    user: {
        findUnique: async () => null,
        create: async (data: any) => ({ id: "mock-user-id", ...data }),
    },
    session: {
        findUnique: async () => null,
    },
    event: {
        findMany: async () => [],
        create: async (data: any) => ({ id: "mock-event-id", ...data }),
    },
    invitation: {
        findUnique: async () => null,
    },
    media: {
        findMany: async () => [],
    }
} as any;
