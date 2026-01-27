'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, CreditCard, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface Plan {
    id: string;
    name: string;
    price: number;
    currency: string;
    features: string[];
    description: string;
}

interface Subscription {
    id: string;
    status: string;
    plan: Plan;
    nextPaymentDate?: string;
    trialEndsAt?: string;
}

export default function SubscriptionPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [currentSub, setCurrentSub] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [plansRes, subRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/subscriptions/plans`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/subscriptions/current`, { headers })
            ]);

            if (plansRes.ok) setPlans(await plansRes.json());
            if (subRes.ok) {
                const sub = await subRes.json();
                setCurrentSub(sub || null);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error cargando información de suscripción');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId: string) => {
        setProcessingId(planId);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/subscriptions/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ planId })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.init_point) {
                    window.location.href = data.init_point; // Redirect to MercadoPago
                } else if (data.message) {
                    toast.success(data.message);
                    fetchData(); // Refresh if immediate (e.g. Free plan)
                }
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || 'Error al iniciar suscripción');
            }
        } catch (error) {
            toast.error('Error de conexión');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const currentPlanId = currentSub?.plan?.id;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price).replace(/\s/g, ' '); // Ensure consistent spacing
    };

    return (
        <div className="space-y-8 p-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Suscripción y Pagos</h2>
                <p className="text-muted-foreground">Gestiona el plan de tu iglesia y métodos de pago.</p>
            </div>

            {/* Current Plan Section */}
            <Card className="bg-slate-50 border-slate-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Plan Actual
                        {currentSub?.status === 'ACTIVE' && <Badge className="bg-green-600">Activo</Badge>}
                        {currentSub?.status === 'TRIAL' && <Badge variant="secondary">Periodo de Prueba</Badge>}
                        {currentSub?.status === 'CANCELLED' && <Badge variant="destructive">Cancelado</Badge>}
                    </CardTitle>
                    <CardDescription>
                        Estás suscrito al plan <span className="font-bold text-slate-900">{currentSub?.plan?.name || 'Gratuito'}</span>.
                        {currentSub?.nextPaymentDate && ` Tu próxima renovación es el ${new Date(currentSub.nextPaymentDate).toLocaleDateString()}.`}
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Plans List */}
            <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card key={plan.id} className={`flex flex-col relative ${currentPlanId === plan.id ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : ''}`}>
                        {plan.name === 'PRO' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                RECOMENDADO
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <div className="mt-2">
                                <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                                <span className="text-muted-foreground text-sm"> / mes</span>
                            </div>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2 text-sm">
                                {Array.isArray(plan.features) && plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={currentPlanId === plan.id ? "outline" : (plan.name === 'PRO' ? "default" : "secondary")}
                                disabled={currentPlanId === plan.id || processingId === plan.id}
                                onClick={() => handleSubscribe(plan.id)}
                            >
                                {processingId === plan.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {currentPlanId === plan.id ? 'Plan Actual' : (plan.price === 0 ? 'Cambiar a Gratis' : 'Suscribirse')}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
