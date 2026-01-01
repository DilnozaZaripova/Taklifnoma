import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="text-red-500 text-6xl font-bold">403</div>
                <h1 className="text-3xl font-serif text-gray-900">Ruxsat yo'q</h1>
                <p className="text-gray-600">
                    Sizda ushbu sahifani ko'rish uchun yetarli huquqlar mavjud emas.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                    Bosh sahifaga qaytish
                </Link>
            </div>
        </div>
    );
}
