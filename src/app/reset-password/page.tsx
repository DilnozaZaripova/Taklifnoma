import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-[var(--muted-foreground)]">Yuklanmoqda...</p>
                </div>
            </div>
        }>
            <ResetPasswordClient />
        </Suspense>
    );
}
