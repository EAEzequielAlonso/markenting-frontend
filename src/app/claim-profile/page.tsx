'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ClaimProfilePage() {
    const [person, setPerson] = useState<any>(null);
    const [tempToken, setTempToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    useEffect(() => {
        const storedToken = localStorage.getItem('tempToken');
        const storedPerson = localStorage.getItem('claimPerson');

        if (!storedToken || !storedPerson) {
            router.push('/login');
            return;
        }

        setTempToken(storedToken);
        setPerson(JSON.parse(storedPerson));
    }, [router]);

    const handleClaim = async (claim: boolean) => {
        setLoading(true);
        try {
            // We need to attach the temp token manually because api interceptor might pick up 'accessToken' which is null
            // So we pass header explicitly or assume interceptor logic is robust.
            // Actually API interceptor uses 'accessToken' from localStorage.
            // BUT here we haven't set 'accessToken' yet (it's tempToken).
            // So we MUST pass the header explicitly.

            const payload = {
                personId: claim ? person.id : undefined,
                createNew: !claim
            };

            const response = await api.post('/auth/claim-profile', payload, {
                headers: {
                    Authorization: `Bearer ${tempToken}`
                }
            });

            const { accessToken, user, churchId } = response.data;

            // Cleanup temp
            localStorage.removeItem('tempToken');
            localStorage.removeItem('claimPerson');

            login(accessToken, user, churchId);

        } catch (error: any) {
            console.error('Error claiming profile', error);
            alert('Error al procesar solicitud');
            setLoading(false);
        }
    };

    if (!person) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">¡Te encontramos!</h2>
                    <p className="text-gray-500 mt-2">
                        Hemos encontrado un perfil existente con tu correo electrónico.
                    </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                            {person.fullName?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{person.fullName}</h3>
                            <p className="text-sm text-gray-600">{person.email}</p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-600 mb-8">
                    ¿Eres tú esta persona? Si confirmas, vincularemos tu cuenta de Google a este perfil.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => handleClaim(true)}
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : 'Sí, soy yo (Vincular Perfil)'}
                    </button>

                    <button
                        onClick={() => handleClaim(false)}
                        disabled={loading}
                        className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        No soy yo, crear nueva cuenta
                    </button>
                </div>
            </div>
        </div>
    );
}
