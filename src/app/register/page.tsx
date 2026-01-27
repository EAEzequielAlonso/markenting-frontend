'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Mail, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';

export default function RegisterPage() {
    const { login } = useAuth();
    const { loginWithRedirect } = useAuth0();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const onSubmit = async (data: any) => {
        setError('');
        setLoading(true);
        try {
            const payload = {
                email: data.email,
                password: data.password,
            }

            const response = await api.post('/auth/register', payload);
            const { accessToken, user, churchId } = response.data;
            login(accessToken, user, churchId);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient background light */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[140px] animate-pulse delay-700"></div>
                <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[140px] animate-pulse"></div>
            </div>

            <div className="max-w-4xl w-full grid lg:grid-cols-2 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative z-10">
                {/* Left Side - Form */}
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <div className="w-full space-y-8">
                        <div className="space-y-2 text-center lg:text-left">
                            <div className="inline-flex h-12 w-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl items-center justify-center mb-4 shadow-xl">
                                <span className="text-white font-black text-xl">E</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter text-white">Únete a Ecclesia</h1>
                            <p className="text-slate-400 font-medium">
                                Gestiona tu ministerio con excelencia.
                            </p>
                        </div>

                        <button
                            onClick={() => loginWithRedirect({
                                appState: { returnTo: '/dashboard' },
                                authorizationParams: { connection: 'google-oauth2', prompt: 'select_account' }
                            })}
                            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all transform active:scale-[0.98]">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Registro con Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                                <span className="bg-transparent px-4 text-slate-500">O con tu email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                    <p className="text-xs text-red-400 font-bold">{error}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <div>
                                    <input
                                        {...register('email', {
                                            required: 'Email requerido',
                                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Email inválido" }
                                        })}
                                        type="email"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-primary/50 transition-all outline-none"
                                        placeholder="tu@email.com"
                                    />
                                    {errors.email && <span className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.email.message as string}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            {...register('password', { required: 'Requerido', minLength: { value: 6, message: 'Min 6' } })}
                                            type="password"
                                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-primary/50 transition-all outline-none"
                                            placeholder="Clave"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            {...register('confirmPassword', {
                                                required: 'Requerido',
                                                validate: (val: string) => watch('password') === val || "No coinciden"
                                            })}
                                            type="password"
                                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-primary/50 transition-all outline-none"
                                            placeholder="Repetir"
                                        />
                                    </div>
                                </div>
                                {(errors.password || errors.confirmPassword) && (
                                    <span className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                                        {(errors.password?.message || errors.confirmPassword?.message) as string}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#fbbf24] text-[#0f172a] py-4 rounded-2xl font-black shadow-xl shadow-[#fbbf24]/20 hover:bg-white transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                Crear cuenta gratuita
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-400 font-medium">
                            ¿Ya tienes cuenta?{' '}
                            <Link href="/login" className="font-black text-white hover:text-[#fbbf24] underline decoration-[#fbbf24] underline-offset-4">
                                Acceder
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Side - Decor */}
                <div className="hidden lg:block relative bg-slate-900 border-l border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-slate-950 z-10" />
                    <div className="absolute inset-0 flex flex-col justify-end p-12 z-20">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Tu ministerio,<br />elevado.</h2>
                            <p className="text-sm text-slate-400 leading-relaxed font-bold italic">
                                "Administrando con excelencia para que el Reino se expanda en cada nación."
                            </p>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-screen" />
                </div>
            </div>
        </div>
    );
}
