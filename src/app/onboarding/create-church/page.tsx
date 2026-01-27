'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Building2, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CreateChurchPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const payload = {
                name: data.name,
                slug: data.slug || undefined,
                address: data.address,
                city: data.city,
                country: data.country
            };
            console.log('Sending Church Payload:', payload);

            // 1. Create Church
            const churchRes = await api.post('/churches', payload);

            const newChurch = churchRes.data;

            // 2. Switch Context to new Church
            const switchRes = await api.post(`/auth/switch-church/${newChurch.id}`);

            // 3. Update Auth Context
            login(switchRes.data.accessToken, switchRes.data.user, switchRes.data.churchId);

            // 4. Redirect
            router.push('/dashboard');

        } catch (err: any) {
            console.error('Full Error Object:', err);
            console.error('Error Response Data:', err.response?.data);
            const message = err.response?.data?.message;
            if (Array.isArray(message)) {
                toast.error(message.join(', '));
            } else {
                toast.error(message || 'Error al crear la iglesia');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <Link href="/onboarding" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Volver
                </Link>

                <div className="mb-8">
                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-4">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Registrar mi Iglesia</h2>
                    <p className="text-gray-500 mt-2">
                        Configura el espacio para tu comunidad. Serás el administrador principal.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Iglesia</label>
                        <input
                            {...register('name', { required: 'El nombre es requerido' })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-black outline-none"
                            placeholder="Ej. Iglesia Vida Nueva"
                        />
                        {errors.name && <span className="text-xs text-red-500">{errors.name.message as string}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Identificador (Slug)</label>
                        <input
                            {...register('slug')}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-black outline-none"
                            placeholder="ej. iglesia-vida-nueva (Opcional)"
                        />
                        <p className="text-xs text-gray-400 mt-1">Se usará para el enlace de tu iglesia.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                            <input
                                {...register('country')}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-black outline-none"
                                placeholder="Ej. México"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                            <input
                                {...register('city')}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-black outline-none"
                                placeholder="Ej. CDMX"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input
                            {...register('address')}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-black outline-none"
                            placeholder="Calle, Número, Colonia"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear Iglesia'}
                    </button>
                </form>
            </div>
        </div>
    );
}
