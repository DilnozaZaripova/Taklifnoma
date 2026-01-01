"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <button
                onClick={() => signIn("google")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Google bilan kirish
            </button>
        </div>
    );
}
