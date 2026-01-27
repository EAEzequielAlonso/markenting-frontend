
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { Loader2, Building2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ChurchSettingsPage() {
    const [loading, setLoading] = useState(true); // Initial load
    const [saving, setSaving] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchChurch = async () => {
            try {
                const res = await api.get('/churches/current');
                const church = res.data;
                setValue('name', church.name);
                setValue('slug', church.slug);
                setValue('logoUrl', church.logoUrl);
                setValue('coverUrl', church.coverUrl);
                setValue('address', church.address);
                setValue('city', church.city);
                setValue('country', church.country);
            } catch (error) {
                console.error(error);
                toast.error('Error al cargar datos de la iglesia');
            } finally {
                setLoading(false);
            }
        };
        fetchChurch();
    }, [setValue]);

    const onSubmit = async (data: any) => {
        setSaving(true);
        try {
            await api.patch('/churches/current', data);
            toast.success('Iglesia actualizada correctamente');
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Error al actualizar');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Configuración de Iglesia</h1>
                <p className="text-gray-500 mt-2">Administra los detalles de tu congregación.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">Información General</h3>
                        <p className="text-sm text-gray-500">Estos datos son visibles para los miembros.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">URL del Logo (Icono)</label>
                            <input
                                {...register('logoUrl')}
                                placeholder="https://example.com/logo.png"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">URL de Imagen de Portada</label>
                            <input
                                {...register('coverUrl')}
                                placeholder="https://example.com/cover.jpg"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">Nombre de la Iglesia</label>
                            <input
                                {...register('name', { required: 'El nombre es obligatorio' })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message as string}</span>}
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">Identificador (Slug)</label>
                            <input
                                {...register('slug')}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all bg-gray-50 text-gray-500 cursor-not-allowed"
                                readOnly
                                title="El slug no se puede cambiar por ahora"
                            />
                            <p className="text-xs text-gray-400">Identificador único del sistema (Solo lectura).</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">País</label>
                            <input
                                {...register('country')}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">Ciudad</label>
                            <input
                                {...register('city')}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                            />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <label className="text-sm font-medium text-gray-700">Dirección</label>
                            <input
                                {...register('address')}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
