'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { Loader2, User, Key, Save, Phone, Calendar, MapPin, Heart, Briefcase, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { logout, refreshSession } = useAuth();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                const user = res.data;
                setValue('fullName', user.person?.fullName || user.fullName);
                setValue('avatarUrl', user.person?.avatarUrl || user.person?.avatar || '');
                setValue('phoneNumber', user.person?.phoneNumber);
                if (user.person?.birthDate) {
                    setValue('birthDate', new Date(user.person.birthDate).toISOString().split('T')[0]);
                }
                setValue('sex', user.person?.sex);
                setValue('maritalStatus', user.person?.maritalStatus);
                setValue('documentNumber', user.person?.documentNumber);
                setValue('nationality', user.person?.nationality);
                setValue('occupation', user.person?.occupation);

                setValue('addressLine1', user.person?.addressLine1);
                setValue('addressLine2', user.person?.addressLine2);
                setValue('city', user.person?.city);
                setValue('state', user.person?.state);
                setValue('postalCode', user.person?.postalCode);
                setValue('country', user.person?.country);

                setValue('emergencyContactName', user.person?.emergencyContactName);
                setValue('emergencyContactPhone', user.person?.emergencyContactPhone);
            } catch (error) {
                console.error(error);
                toast.error('Error al cargar perfil');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [setValue]);

    const onSubmit = async (data: any) => {
        setSaving(true);
        try {
            const payload: any = {
                fullName: data.fullName,
                phoneNumber: data.phoneNumber || null,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
                sex: data.sex || null, // Backend accepts null or valid enum, not empty string
                maritalStatus: data.maritalStatus || null,
                documentNumber: data.documentNumber || null,
                nationality: data.nationality || null,
                occupation: data.occupation || null,
                addressLine1: data.addressLine1 || null,
                addressLine2: data.addressLine2 || null,
                city: data.city || null,
                state: data.state || null,
                postalCode: data.postalCode || null,
                country: data.country || null,
                emergencyContactName: data.emergencyContactName || null,
                emergencyContactPhone: data.emergencyContactPhone || null
            };
            if (data.fullName) payload.fullName = data.fullName;
            if (data.password) {
                payload.password = data.password;
            }
            if (data.avatarUrl) {
                payload.avatarUrl = data.avatarUrl;
            }

            await api.patch('/users/profile', payload);
            toast.success('Perfil actualizado correctamente');

            // Update context in background without reloading page
            await refreshSession();

        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Error al actualizar perfil');
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
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-gray-500 mt-2">Gestiona tu información personal y preferencias.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">

                    {/* Sección 1: Básico */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-medium text-gray-900 pb-2 border-b border-gray-100">
                            <User className="w-4 h-4" />
                            Información Básica
                        </h4>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">URL del Avatar</label>
                                <input {...register('avatarUrl')} placeholder="https://..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                                <input {...register('fullName', { required: 'Requerido' })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                {errors.fullName && <span className="text-xs text-red-500">{errors.fullName.message as string}</span>}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Phone className="w-3 h-3" /> Teléfono</label>
                                <input {...register('phoneNumber')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Calendar className="w-3 h-3" /> Fecha de Nacimiento</label>
                                <input type="date" {...register('birthDate')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Personal */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-medium text-gray-900 pb-2 border-b border-gray-100">
                            <Heart className="w-4 h-4" />
                            Datos Personales
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Sexo</label>
                                <select {...register('sex')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                    <option value="">Seleccionar</option>
                                    <option value="MALE">Masculino</option>
                                    <option value="FEMALE">Femenino</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Estado Civil</label>
                                <select {...register('maritalStatus')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                    <option value="">Seleccionar</option>
                                    <option value="SINGLE">Soltero/a</option>
                                    <option value="MARRIED">Casado/a</option>
                                    <option value="DIVORCED">Divorciado/a</option>
                                    <option value="WIDOWED">Viudo/a</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Nacionalidad</label>
                                <input {...register('nationality')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">DNI / Documento</label>
                                <input {...register('documentNumber')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700"><Briefcase className="w-3 h-3 inline mr-1" /> Ocupación</label>
                                <input {...register('occupation')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Sección 3: Dirección */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-medium text-gray-900 pb-2 border-b border-gray-100">
                            <MapPin className="w-4 h-4" />
                            Dirección
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Calle y Número</label>
                                <input {...register('addressLine1')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Colonia / Interior</label>
                                <input {...register('addressLine2')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Ciudad</label>
                                <input {...register('city')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Estado / Provincia</label>
                                <input {...register('state')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Código Postal</label>
                                <input {...register('postalCode')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">País</label>
                                <input {...register('country')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Sección 4: Emergencia */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-medium text-gray-900 pb-2 border-b border-gray-100">
                            <Phone className="w-4 h-4 text-red-500" />
                            Contacto de Emergencia
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Nombre Contacto</label>
                                <input {...register('emergencyContactName')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Teléfono Contacto</label>
                                <input {...register('emergencyContactPhone')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Sección 5: Seguridad */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-medium text-gray-900 pb-2 border-b border-gray-100">
                            <Key className="w-4 h-4" />
                            Seguridad
                        </h4>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                            <input
                                type="password"
                                {...register('password', { minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                                placeholder="Dejar en blanco para mantener actual"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                            {errors.password && <span className="text-xs text-red-500">{errors.password.message as string}</span>}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
