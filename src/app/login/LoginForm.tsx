"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const [step, setStep] = useState<"email" | "code">("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            // ✅ Use the new "send-code" endpoint
            const response = await fetch("/api/auth/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Tasdiqlash kodi emailingizga yuborildi");
                setStep("code");
            } else {
                setError(data.message || "Xatolik yuz berdi");
            }
        } catch (err) {
            setError("Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // ✅ Use signIn("credentials") directly instead of verify-code API
            const result = await signIn("credentials", {
                email,
                code,
                redirect: false,
            });

            if (result?.error) {
                setError("Kod noto'g'ri yoki eskirgan");
            } else if (result?.ok) {
                // ✅ Success -> Refresh router and push to dashboard
                router.refresh();
                router.push(callbackUrl);
            }
        } catch (err) {
            setError("Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setStep("email");
        setCode("");
        setError("");
        setMessage("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
                    Inviter.uz
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Raqamli taklifnomalar platformasi
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                        {message}
                    </div>
                )}

                {step === "email" ? (
                    <form onSubmit={handleRequestCode} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email manzilingiz
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                placeholder="email@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Yuklanmoqda..." : "Kod yuborish"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tasdiqlash kodi
                            </label>
                            <p className="text-xs text-gray-500 mb-2">
                                {email} ga yuborilgan 6 raqamli kodni kiriting
                            </p>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-center text-2xl font-mono tracking-widest"
                                placeholder="000000"
                                required
                                disabled={loading}
                                maxLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || code.length !== 6}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Tekshirilmoqda..." : "Tasdiqlash"}
                        </button>

                        <button
                            type="button"
                            onClick={handleBackToEmail}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                        >
                            Orqaga
                        </button>
                    </form>
                )}

                <p className="text-center text-sm text-gray-600 mt-6">
                    Akkauntingiz yo'qmi?{" "}
                    <a href="/register" className="text-purple-600 font-semibold hover:underline">
                        Ro'yxatdan o'ting
                    </a>
                </p>
            </div>
        </div>
    );
}
