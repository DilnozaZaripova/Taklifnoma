"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <div className="space-y-3 mt-8">
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
