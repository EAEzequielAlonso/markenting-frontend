
'use client';

import Link from 'next/link';
import { User, Building2, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
                <p className="text-gray-500 mt-2">Administra tu perfil y tu iglesia.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Link href="/profile" className="block p-6 bg-white rounded-2xl border border-gray-200 hover:border-black transition-all group shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Mi Perfil</h3>
                                <p className="text-sm text-gray-500">Datos personales y seguridad</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                    </div>
                </Link>

                <Link href="/settings/church" className="block p-6 bg-white rounded-2xl border border-gray-200 hover:border-black transition-all group shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Mi Iglesia</h3>
                                <p className="text-sm text-gray-500">Información general y ubicación</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
