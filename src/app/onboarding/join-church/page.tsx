
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Users, Loader2, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function JoinChurchPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [success, setSuccess] = useState(false);

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 2) {
                try {
                    const res = await api.get(`/churches/search?q=${searchTerm}`);
                    setResults(res.data);
                } catch (error) {
                    console.error(error);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleJoin = async (church: any) => {
        setLoading(true);
        try {
            await api.post('/members/request-access', {
                churchId: church.id
            });
            setSuccess(true);
            toast.success('Solicitud enviada con éxito');
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Error al unirse');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Solicitud Enviada</h2>
                    <p className="text-gray-500 mb-6">
                        Hemos notificado a los administradores. Recibirás un correo cuando tu solicitud sea aprobada.
                    </p>
                    <button onClick={() => window.location.href = '/dashboard'} className="block w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all">
                        Ir al Inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <Link href="/onboarding" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Volver
                </Link>

                <div className="mb-8">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4">
                        <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Unirme a una Iglesia</h2>
                    <p className="text-gray-500 mt-2">
                        Busca tu iglesia por nombre, ciudad o dirección.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Buscar iglesia..."
                            autoFocus
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {results.map((church) => (
                            <button
                                key={church.id}
                                onClick={() => handleJoin(church)}
                                disabled={loading}
                                className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group flex items-center gap-3"
                            >
                                {church.logoUrl ? (
                                    <img src={church.logoUrl} alt={church.name} className="w-10 h-10 rounded-full object-cover bg-white border border-gray-100" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                                        {church.name.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 leading-tight">{church.name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{church.city}, {church.country}</p>
                                </div>
                            </button>
                        ))}
                        {searchTerm.length > 2 && results.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">No encontramos iglesias con ese nombre.</p>
                            </div>
                        )}
                        {searchTerm.length <= 2 && (
                            <div className="text-center py-4">
                                <p className="text-xs text-gray-400">Escribe al menos 3 caracteres para buscar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
