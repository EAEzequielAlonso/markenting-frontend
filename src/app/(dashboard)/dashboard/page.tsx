'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface DashboardStats {
    members: {
        total: number;
        newLastMonth: number;
        growthPercentage: number;
    };
    groups: {
        total: number;
        active: number;
    };
    treasury: {
        monthlyIncome: number;
        currency: string;
    };
    visitors: {
        new: number;
        pending: number;
    };
}

export default function DashboardPage() {
    const { churchId } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [upcomingServices, setUpcomingServices] = useState<any[]>([]);

    const [subscription, setSubscription] = useState<any>(null);

    useEffect(() => {
        if (!churchId) {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [statsRes, subRes, upcomingRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/dashboard/stats?churchId=${churchId}`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/subscriptions/current`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/dashboard/upcoming?churchId=${churchId}`, { headers })
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (subRes.ok) setSubscription(await subRes.json());
                if (upcomingRes.ok) setUpcomingServices(await upcomingRes.json());
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [churchId]);

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
    };

    if (loading && !stats) {
        return <div className="p-6">Cargando estadísticas...</div>;
    }

    if (!churchId) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold">No has seleccionado ninguna iglesia</h2>
                <p className="text-gray-500 mt-2">Crea una nueva iglesia o solicita unirte a una existente.</p>
                {/* Add buttons here if needed */}
            </div>
        );
    }

    // Trial calculation
    const isTrial = subscription?.status === 'TRIAL';
    const trialDaysLeft = isTrial && subscription?.plan?.name === 'TRIAL'
        ? Math.ceil((new Date(subscription.trialEndsAt || 0).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            </div>

            {isTrial && trialDaysLeft <= 14 && (
                <div className={`p-4 rounded-lg border ${trialDaysLeft <= 3 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-indigo-50 border-indigo-200 text-indigo-800'} mb-6 `}>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-bold">¡Estás en el periodo de prueba!</span>
                            <span className="ml-2">Te quedan {Math.max(0, trialDaysLeft)} días para disfrutar de todas las funciones PRO.</span>
                        </div>
                        <a href="/subscription" className="px-4 py-2 bg-white rounded shadow-sm text-sm font-semibold hover:bg-gray-50 transition-colors">
                            Ver Planes
                        </a>
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Miembros Totales</h3>
                    <p className="text-3xl font-bold mt-2 text-primary">{stats?.members.total || 0}</p>
                    <span className="text-xs text-green-600 flex items-center mt-1">
                        {(stats?.members.growthPercentage || 0) > 0 ? '+' : ''}{stats?.members.growthPercentage || 0}% vs mes anterior
                    </span>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Grupos Activos</h3>
                    <p className="text-3xl font-bold mt-2 text-primary">{stats?.groups.active || 0}</p>
                    <span className="text-xs text-green-600 flex items-center mt-1">Total: {stats?.groups.total}</span>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Ofrendas (Mes Actual)</h3>
                    <p className="text-3xl font-bold mt-2 text-primary">
                        {formatCurrency(stats?.treasury.monthlyIncome || 0, stats?.treasury.currency || 'USD')}
                    </p>
                    <span className="text-xs text-green-600 flex items-center mt-1">{/* TODO: Compare with last month */}</span>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Nuevos Visitantes</h3>
                    <p className="text-3xl font-bold mt-2 text-primary">{stats?.visitors.new || 0}</p>
                    <span className="text-xs text-yellow-600 flex items-center mt-1">{stats?.visitors.pending} requieren seguimiento</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
                    <h3 className="font-semibold mb-4">Actividad Reciente</h3>
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Gráfico de actividad implementado próximamente
                    </div>
                </div>
                <div className="col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold mb-4">Próximos Eventos</h3>
                    <div className="space-y-4">
                        {upcomingServices.length > 0 ? (
                            upcomingServices.map((event: any) => {
                                let badgeColor = 'bg-gray-50 text-gray-700';
                                let iconColor = 'bg-gray-50 text-gray-700';

                                switch (event.type) {
                                    case 'WORSHIP':
                                        badgeColor = 'text-indigo-600 bg-indigo-50';
                                        iconColor = 'bg-indigo-50 text-indigo-700';
                                        break;
                                    case 'ACTIVITY':
                                        badgeColor = 'text-emerald-600 bg-emerald-50';
                                        iconColor = 'bg-emerald-50 text-emerald-700';
                                        break;
                                    case 'COURSE':
                                        badgeColor = 'text-violet-600 bg-violet-50';
                                        iconColor = 'bg-violet-50 text-violet-700';
                                        break;
                                    default: // OTHER or PERSONAL
                                        badgeColor = 'text-slate-600 bg-slate-50';
                                        iconColor = 'bg-slate-50 text-slate-700';
                                }

                                return (
                                    <div
                                        key={event.id}
                                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                                        onClick={() => router.push(event.link || '/calendar')}
                                    >
                                        <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold shrink-0 ${iconColor}`}>
                                            <span className="text-sm leading-none">{format(new Date(event.date), 'dd')}</span>
                                            <span className="text-[10px] uppercase leading-none mt-0.5">{format(new Date(event.date), 'MMM', { locale: es })}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-gray-900 truncate">{event.title}</p>
                                                {event.type !== 'WORSHIP' && <span className={`text-[10px] px-1.5 rounded-sm font-bold uppercase tracking-wider ${badgeColor}`}>{event.type === 'COURSE' ? 'Curso' : event.type === 'ACTIVITY' ? 'Actividad' : 'Evento'}</span>}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(event.date), 'HH:mm')} hs
                                                </span>
                                                {event.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {event.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor}`}>
                                            Ver
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No hay eventos próximos.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
