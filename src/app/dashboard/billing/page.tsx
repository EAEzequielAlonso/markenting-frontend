"use client"

import * as React from "react"
import axios from "axios"
import { Check, Zap, Rocket, ShieldCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const PLANS = [
    {
        name: "🧪 Trial (Prueba)",
        id: "TRIAL",
        price: "$0",
        description: "7 días para probar el marketing orgánico con IA.",
        features: ["1 Campaña orgánica", "Hasta 9 Posts totales", "Cómplice de copies por IA"],
        buttonText: "Activar Prueba",
        variant: "outline",
    },
    {
        name: "🚀 Pro",
        id: "PRO",
        price: "$20",
        localPrice: "$30.000",
        description: "Para emprendedores y comercios locales.",
        features: [
            "4 Campañas (Orgánico + Ads)",
            "Hasta 12 Posts por campaña",
            "1 Regeneración por post",
            "10 Ediciones IA por mes"
        ],
        buttonText: "Suscribirse",
        variant: "default",
        amount: 30000,
    },
    {
        name: "🏢 Business",
        id: "BUSINESS",
        price: "$60",
        localPrice: "$90.000",
        description: "Automatización total para negocios y agencias.",
        features: [
            "12 Campañas (Orgánico + Ads)",
            "Hasta 15 Posts por campaña",
            "2 Regeneraciones por post",
            "50 Ediciones IA por mes",
            "Chat IA libre (limitado)"
        ],
        buttonText: "Elegir Business",
        variant: "default",
        highlight: true,
        amount: 90000,
    }
]

export default function BillingPage() {
    const [loading, setLoading] = React.useState<string | null>(null)

    const handleMP = async (amount: number, planName: string, planId: string) => {
        setLoading(planId)
        const token = localStorage.getItem("token")
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/payments/mercadopago/create-preference`,
                { amount, planName },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            // Redirect to MP
            if (response.data.init_point) {
                window.location.href = response.data.init_point
            }
        } catch (error: any) {
            console.error('Error initiating MP payment:', error)
            const errorMsg = error.response?.data?.message || "Error al iniciar pago con Mercado Pago."
            toast.error(errorMsg)
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Elige el plan ideal para tu negocio</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Escala tus ventas con inteligencia artificial. Comienza gratis y paga solo por lo que necesitas.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {PLANS.map((plan) => (
                    <Card key={plan.id} className={plan.highlight ? "border-primary shadow-lg scale-105" : "bg-card/50"}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                                {plan.highlight && <Badge className="bg-primary text-primary-foreground">Popular</Badge>}
                            </div>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="mt-4 flex flex-col">
                                <span className="text-4xl font-extrabold">{plan.price}</span>
                                <span className="text-sm text-muted-foreground">USD / mes</span>
                                {plan.localPrice && (
                                    <span className="text-sm font-medium text-primary mt-1">~ {plan.localPrice} ARS/mes</span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-2">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            {plan.id === "TRIAL" ? (
                                <Button className="w-full" variant="outline" disabled>
                                    Trial Activado (7 días)
                                </Button>
                            ) : plan.id === "CUSTOM" ? (
                                <Button className="w-full" variant="outline" asChild>
                                    <a href="mailto:ventas@advantage-ai.com">Contactar Ventas</a>
                                </Button>
                            ) : (
                                <Button
                                    className="w-full flex items-center justify-center gap-2 font-bold"
                                    onClick={() => handleMP(plan.amount || 0, plan.name, plan.id)}
                                    disabled={!!loading}
                                >
                                    {loading === plan.id && <Loader2 className="animate-spin h-4 w-4" />}
                                    Pagar con Mercado Pago <Zap className="h-3 w-3" />
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-8 border-t opacity-60">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="text-sm font-medium">Pago Seguro SSL</span>
                </div>
                <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    <span className="text-sm font-medium">Activación inmediata</span>
                </div>
            </div>
        </div>
    )
}
