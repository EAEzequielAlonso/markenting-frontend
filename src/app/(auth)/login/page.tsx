'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import api from '@/lib/api';

export default function LoginPage() {
    const { login } = useAuth();
    const { loginWithRedirect } = useAuth0();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password
            });

            const { accessToken, user, churchId } = response.data;
            login(accessToken, user, churchId);

        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Error al iniciar sesión');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
            {/* Ambient background light */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 transition-all duration-300 hover:border-primary/30">
                <div className="text-center">
                    <div className="mx-auto h-14 w-14 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/25">
                        <span className="text-white font-black text-2xl tracking-tighter">E</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">
                        Bienvenido
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 font-medium italic">
                        Inicia sesión para gestionar tu ministerio
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <Input
                                {...register('email')}
                                type="email"
                                placeholder="Correo electrónico"
                                required
                                className="h-13 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div>
                            <Input
                                {...register('password')}
                                type="password"
                                placeholder="Contraseña"
                                required
                                className="h-13 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-white/10 bg-white/5 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-slate-400">
                                Recordarme
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href="#" className="font-bold text-primary hover:text-[#fbbf24] transition-colors">
                                Recuperar clave
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <Button
                            type="submit"
                            className="w-full h-14 text-lg font-black bg-[#fbbf24] hover:bg-white text-[#0f172a] rounded-2xl transition-all shadow-xl shadow-[#fbbf24]/20 transform active:scale-[0.98] active:shadow-inner"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Iniciando...' : 'Entrar ahora'}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                <span className="bg-slate-950 px-4 text-slate-500">O ingresa con</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-14 text-sm font-bold flex items-center justify-center gap-3 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl transition-all"
                            onClick={() => loginWithRedirect({
                                appState: { returnTo: '/dashboard' },
                                authorizationParams: {
                                    connection: 'google-oauth2',
                                    prompt: 'select_account'
                                }
                            })}
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Continuar con Google
                        </Button>

                        <div className="text-center mt-6">
                            <span className="text-sm text-slate-400 font-medium">¿Nuevo en Ecclesia? </span>
                            <Link href="/register" className="text-sm font-black text-white hover:text-[#fbbf24] transition-colors underline decoration-[#fbbf24] underline-offset-4">
                                Crea tu cuenta
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
