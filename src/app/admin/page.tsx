import { auth } from "@/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
    const session = await auth();

    if (!session || (session.user as any).role !== 'ADMIN') {
        redirect('/unauthorized');
    }

    const userCount = await prisma.user.count();
    const weddingCount = await prisma.wedding.count();
    const paidUsers = await prisma.user.count({ where: { subscriptionTier: 'PAID' } });

    return (
        <main className="container-centered py-12">
            <h1 className="text-4xl font-serif mb-8 text-gray-900 font-bold">Admin Panel</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Jami Foydalanuvchilar</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{userCount}</p>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Jami Taklifnomalar</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{weddingCount}</p>
                </div>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm">
                    <p className="text-sm text-blue-600 uppercase font-semibold">Premium Foydalanuvchilar</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">{paidUsers}</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Yaqinda qo'shilganlar</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Foydalanuvchi</th>
                                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sana</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Example dynamic data would go here */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-4 text-sm text-gray-900">Admin User</td>
                                <td className="px-8 py-4 text-sm text-gray-500">admin@taklifnoma.uz</td>
                                <td className="px-8 py-4">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">ADMIN</span>
                                </td>
                                <td className="px-8 py-4 text-sm text-gray-500">Hozir</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
