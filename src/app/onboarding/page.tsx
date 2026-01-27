'use client';

import { Building2, Users } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Bienvenido!</h1>
                    <p className="text-gray-600 text-lg">Para comenzar, cuéntanos qué deseas hacer</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Crear Iglesia */}
                    <Link href="/onboarding/create-church" className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-black transition-all duration-300 p-8 text-left">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Building2 className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Crear una nueva iglesia</h3>
                            <p className="text-gray-500">
                                Soy pastor o líder y quiero registrar mi iglesia para gestionarla con la plataforma.
                            </p>
                        </div>
                    </Link>

                    {/* Unirme a Iglesia */}
                    <Link href="/onboarding/join-church" className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-600 transition-all duration-300 p-8 text-left">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-600">
                            <Users className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Unirme a una iglesia</h3>
                            <p className="text-gray-500">
                                Soy miembro o líder y quiero unirme a una iglesia que ya utiliza la plataforma.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
