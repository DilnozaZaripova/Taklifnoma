"use client";

import { useSession } from "next-auth/react";

export default function Header() {
    const { data: session, status } = useSession();

    return (
        <header className="p-4 border-b bg-white">
            <div className="container mx-auto">
                <p>Status: {status}</p>
                {session ? (
                    <p className="text-green-600 font-bold">LOGIN QILINGAN: {session.user?.email}</p>
                ) : (
                    <p className="text-red-600">LOGIN QILINMAGAN</p>
                )}
            </div>
        </header>
    );
}
