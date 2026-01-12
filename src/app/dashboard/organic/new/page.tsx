"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Zap,
    ChevronRight,
    ChevronLeft,
    Check,
    Info,
    Target,
    ShoppingBag,
    Settings2,
    Eye,
    MessageCircle,
    AlertCircle,
    Lock
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

const STEPS = [
    { title: "Fundamentos", description: "Define el alma de tu campaña", icon: Target },
    { title: "Propuesta", description: "¿Qué vamos a promocionar?", icon: ShoppingBag },
    { title: "Canales", description: "Configuración y contacto", icon: MessageCircle },
    { title: "Revisión", description: "Confirmar y lanzar", icon: Eye },
]

export default function OrganicCampaignWizard() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = React.useState(1)
    const [loading, setLoading] = React.useState(false)
    const [company, setCompany] = React.useState<any>(null)
    const [formData, setFormData] = React.useState({
        name: "",
        objective: "Atraer clientes",
        businessType: "local",
        products: "",
        offers: "",
        couponCode: "",
        whatsappNumber: "",
        durationDays: "7",
        postsPerDay: "3",
        dailyPromos: "",
    })

    React.useEffect(() => {
        fetchCompany()
    }, [])

    const fetchCompany = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${API_URL}/companies/my-company`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCompany(res.data)
        } catch (error) {
            console.error("Error fetching company:", error)
        }
    }

    const planLimits = {
        TRIAL: { maxCampaigns: 1, maxPosts: 9 },
        PRO: { maxCampaigns: 4, maxPosts: 12 },
        BUSINESS: { maxCampaigns: 12, maxPosts: 15 },
    }

    const currentPlan = (company?.plan || "TRIAL") as keyof typeof planLimits
    const limits = planLimits[currentPlan] || planLimits.TRIAL

    const totalPosts = parseInt(formData.durationDays) * parseInt(formData.postsPerDay)
    const isExceedingLimit = totalPosts > limits.maxPosts

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1)
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            await axios.post(`${API_URL}/organic-campaigns`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("¡Campaña creada con éxito! La IA está generando tus contenidos...")
            router.push("/dashboard/organic")
        } catch (error: any) {
            console.error("Error creating campaign:", error)
            toast.error("Error al crear la campaña. Revisa los datos.")
        } finally {
            setLoading(false)
        }
    }

    const progressValue = (currentStep / 4) * 100

    return (
        <div className="max-w-3xl mx-auto py-8">
            {/* Progress Header */}
            <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Nueva Campaña IA</h1>
                        <p className="text-sm text-muted-foreground">Paso {currentStep} de 4: {STEPS[currentStep - 1].title}</p>
                    </div>
                    <Zap className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <Progress value={progressValue} className="h-2" />
                <div className="grid grid-cols-4 gap-2">
                    {STEPS.map((step, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-colors ${idx + 1 <= currentStep ? 'bg-primary' : 'bg-muted'}`}
                        />
                    ))}
                </div>
            </div>

            <Card className="shadow-lg border-2 border-primary/5">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {React.createElement(STEPS[currentStep - 1].icon, { className: "h-5 w-5" })}
                        </div>
                        <div>
                            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    {currentStep === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre de la Campaña</Label>
                                <Input
                                    id="name"
                                    placeholder="Ej: Promo Verano 2026"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="objective">Objetivo</Label>
                                <Select
                                    value={formData.objective}
                                    onValueChange={(v) => setFormData({ ...formData, objective: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un objetivo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Atraer clientes">Atraer Clientes Nuevos</SelectItem>
                                        <SelectItem value="Generar consultas">Generar Consultas por WhatsApp</SelectItem>
                                        <SelectItem value="Visitas al local">Aumentar Visitas al Local Físico</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex gap-3">
                                <Info className="h-5 w-5 text-primary shrink-0" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    <strong>¿Qué es una campaña orgánica?</strong> Es una estrategia de comunicación automática en tus redes sociales.
                                    A diferencia de los Ads, no requiere inversión directa; la IA publica contenidos rotativos en tus perfiles
                                    conectados para mantener tu marca activa y captar interés de forma natural.
                                </p>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="products">Qué productos o servicios promocionamos?</Label>
                                <Textarea
                                    id="products"
                                    placeholder="Enumera tus productos estrella..."
                                    className="min-h-[100px]"
                                    value={formData.products}
                                    onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="offers">Ofertas o beneficios especiales</Label>
                                <Input
                                    id="offers"
                                    placeholder="Ej: 20% OFF pagando en efectivo"
                                    value={formData.offers}
                                    onChange={(e) => setFormData({ ...formData, offers: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="couponCode">Cupón de Descuento (Opcional)</Label>
                                <Input
                                    id="couponCode"
                                    placeholder="Ej: BARRIO20"
                                    value={formData.couponCode}
                                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                    La IA incluirá este cupón en los copys para que puedas trackear las ventas.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dailyPromos">Promociones por día (Opcional)</Label>
                                <Textarea
                                    id="dailyPromos"
                                    placeholder="Ej: Lunes de 2x1, Miércoles de descuento a jubilados..."
                                    className="min-h-[80px]"
                                    value={formData.dailyPromos}
                                    onChange={(e) => setFormData({ ...formData, dailyPromos: e.target.value })}
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                    La IA intentará asignar estas promos a los días correspondientes de la semana.
                                </p>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp de Contacto</Label>
                                <Input
                                    id="whatsapp"
                                    placeholder="Ej: +54 9 11 1234 5678"
                                    value={formData.whatsappNumber}
                                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duración de la Campaña</Label>
                                <Select
                                    value={formData.durationDays}
                                    onValueChange={(v) => setFormData({ ...formData, durationDays: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona duración" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">7 días (Express)</SelectItem>
                                        <SelectItem value="15">15 días (Recomendado)</SelectItem>
                                        <SelectItem value="30">30 días (Mes completo)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-900 flex gap-3">
                                <Settings2 className="h-5 w-5 text-orange-600 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-orange-900 dark:text-orange-400 uppercase tracking-tight">⚠️ Acción Requerida: Conexión de Cuentas</p>
                                    <p className="text-xs text-orange-800/80 dark:text-orange-400/80 mt-1 leading-relaxed">
                                        Para que la IA publique automáticamente, **debes tener conectadas tus páginas de Facebook o cuentas de Instagram comerciales** en la sección "Muro Social".
                                        Si no están conectadas, el contenido se generará pero no podrá ser publicado.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2 bg-muted/30 p-4 rounded-lg border">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Resumen de Campaña IA</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8 py-2">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground">OBJETIVO</p>
                                        <p className="text-sm font-medium">{formData.objective}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground">DURACIÓN</p>
                                        <p className="text-sm font-medium">{formData.durationDays} días</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base flex justify-between items-center">
                                    Frecuencia de Publicación IA
                                    <Badge variant="outline" className="text-[10px] font-normal">
                                        Límite Plan: {limits.maxPosts} posts
                                    </Badge>
                                </Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { val: "1", label: "Baja", desc: "1 post/día", color: "text-slate-500" },
                                        { val: "3", label: "Media", desc: "3 posts/día", color: "text-primary" },
                                        { val: "5", label: "Alta", desc: "5 posts/día", color: "text-orange-600" },
                                    ].map((f) => {
                                        const wouldTotal = parseInt(formData.durationDays) * parseInt(f.val)
                                        const disabled = wouldTotal > limits.maxPosts
                                        return (
                                            <div
                                                key={f.val}
                                                onClick={() => !disabled && setFormData({ ...formData, postsPerDay: f.val })}
                                                className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${formData.postsPerDay === f.val ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'hover:border-primary/30'} ${disabled ? 'opacity-40 grayscale cursor-not-allowed border-dashed' : ''}`}
                                            >
                                                <p className={`text-xs font-bold ${f.color}`}>{f.label}</p>
                                                <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                                                {disabled && <Lock className="h-3 w-3 mx-auto mt-1 text-muted-foreground" />}
                                            </div>
                                        )
                                    })}
                                </div>

                                {isExceedingLimit ? (
                                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-3 rounded-lg flex gap-2 items-center text-red-800 dark:text-red-400 text-xs">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <p>Tu plan actual ({currentPlan}) solo permite {limits.maxPosts} posts por campaña. Baja la frecuencia o reduce la duración.</p>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px] text-center text-muted-foreground italic">
                                        "La IA distribuirá los {totalPosts} contenidos
                                        entre Facebook, Instagram y WhatsApp Estados de forma equilibrada."
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/10 p-6">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1 || loading}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Atrás
                    </Button>
                    {currentStep < 4 ? (
                        <Button
                            onClick={handleNext}
                            disabled={currentStep === 1 && !formData.name}
                        >
                            Siguiente
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            className="bg-primary hover:bg-primary/90"
                            onClick={handleSubmit}
                            disabled={loading || isExceedingLimit}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                                <Check className="mr-2 h-4 w-4" />
                            )}
                            Lanzar Campaña IA
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
