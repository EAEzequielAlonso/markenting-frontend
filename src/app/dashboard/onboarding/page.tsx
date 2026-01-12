"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Check, ChevronRight, Store, Target, Share2, Loader2, MapPin, DollarSign, MessageSquare } from "lucide-react"
import { FacebookLoginButton } from "@/components/ui/facebook-login-button"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const INDUSTRIES = [
    { id: "ecommerce", label: "E-commerce", icon: Store, description: "Tienda online de productos físicos." },
    { id: "services", label: "Servicios", icon: Target, description: "Consultoría, educación, salud, etc." },
    { id: "retail", label: "Local Físico", icon: Store, description: "Restaurante, tienda de ropa, gimnasio." },
    { id: "digital", label: "Productos Digitales", icon: Share2, description: "Software, cursos online, ebooks." },
]

const GOALS = [
    { id: "sales", label: "Aumentar Ventas", description: "Maximizar el retorno de inversión (ROAS)." },
    { id: "leads", label: "Generar Leads", description: "Conseguir datos de potenciales clientes." },
    { id: "awareness", label: "Reconocimiento", description: "Llegar a la mayor cantidad de personas." },
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = React.useState(1)
    const [loading, setLoading] = React.useState(false)

    const [formData, setFormData] = React.useState({
        industry: "",
        productsDescription: "",
        location: "",
        goal: "",
        monthlyBudget: "",
        metaToken: "",
    })

    const handleNext = () => {
        if (step < 6) {
            setStep(step + 1)
        } else {
            finishSetup()
        }
    }

    const finishSetup = async () => {
        setLoading(true)
        try {
            const storedUser = localStorage.getItem("user")
            const token = localStorage.getItem("token")

            if (!storedUser || !token) {
                router.push("/auth/login")
                return
            }

            const user = JSON.parse(storedUser)
            const companyId = user.company?.id || user.companyId || user.company

            if (!companyId) {
                toast.error("Error: No se encontró la ID del comercio. Por favor reloguea.")
                setLoading(false)
                return
            }

            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}`,
                {
                    industry: formData.industry.toUpperCase(),
                    productsDescription: formData.productsDescription,
                    location: formData.location,
                    goal: formData.goal,
                    monthlyBudget: parseFloat(formData.monthlyBudget) || 0,
                    metaToken: formData.metaToken,
                    onboardingCompleted: true
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            router.push("/dashboard")
        } catch (error: any) {
            console.error("Error saving setup:", error)
            const message = error.response?.data?.message || "Hubo un error al guardar tu configuración."
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    const TOTAL_STEPS = 6

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-10">
            <div className="w-full max-w-3xl space-y-8">
                {/* Progress Bar */}
                <div className="relative">
                    <div className="absolute left-0 top-1/2 -mt-0.5 w-full h-1 bg-muted rounded-full" />
                    <div
                        className="absolute left-0 top-1/2 -mt-0.5 h-1 bg-primary rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
                    />
                    <div className="relative flex justify-between">
                        {[1, 2, 3, 4, 5, 6].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background font-semibold transition-colors duration-500",
                                    step >= s ? "border-primary text-primary" : "border-muted text-muted-foreground",
                                    step > s && "bg-primary text-primary-foreground border-primary"
                                )}
                            >
                                {step > s ? <Check className="h-4 w-4" /> : s}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">¿Cuál es tu rubro?</h2>
                                <p className="text-muted-foreground">Ayúdanos a personalizar la IA para tu tipo de negocio.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {INDUSTRIES.map((ind) => (
                                    <Card
                                        key={ind.id}
                                        className={cn(
                                            "cursor-pointer hover:border-primary transition-all",
                                            formData.industry === ind.id ? "border-primary ring-2 ring-primary/20" : ""
                                        )}
                                        onClick={() => setFormData({ ...formData, industry: ind.id })}
                                    >
                                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                            <div className="p-2 rounded-md bg-primary/10 text-primary">
                                                <ind.icon className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <CardTitle className="text-base">{ind.label}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription>{ind.description}</CardDescription>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">¿Qué vendes exactamente?</h2>
                                <p className="text-muted-foreground">Describe tus productos o servicios principales.</p>
                            </div>
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="products">Descripción de productos/servicios</Label>
                                        <Textarea
                                            id="products"
                                            placeholder="Ej: Vendemos juguetes didácticos para bebés de 0 a 3 años hecho de madera natural..."
                                            value={formData.productsDescription}
                                            onChange={(e) => setFormData({ ...formData, productsDescription: e.target.value })}
                                            className="min-h-[120px]"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">¿Dónde está tu público?</h2>
                                <p className="text-muted-foreground">Define la zona geográfica donde quieres vender.</p>
                            </div>
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Ubicación (Ciudad, Provincia o País)</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="location"
                                                placeholder="Ej: Buenos Aires, Argentina"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">¿Cuál es tu objetivo principal?</h2>
                                <p className="text-muted-foreground">La IA priorizará las estrategias basadas en esto.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {GOALS.map((goal) => (
                                    <Card
                                        key={goal.id}
                                        className={cn(
                                            "cursor-pointer hover:border-primary transition-all",
                                            formData.goal === goal.id ? "border-primary ring-2 ring-primary/20" : ""
                                        )}
                                        onClick={() => setFormData({ ...formData, goal: goal.id })}
                                    >
                                        <div className="flex items-center p-6">
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{goal.label}</h3>
                                                <p className="text-sm text-muted-foreground">{goal.description}</p>
                                            </div>
                                            {formData.goal === goal.id && <Check className="h-5 w-5 text-primary" />}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">Presupuesto mensual</h2>
                                <p className="text-muted-foreground">¿Cuánto planeas invertir en publicidad aproximadamente? (en USD)</p>
                            </div>
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="budget">Presupuesto mensual proyectado</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="budget"
                                                type="number"
                                                placeholder="Ej: 500"
                                                value={formData.monthlyBudget}
                                                onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Esto nos ayuda a calcular el alcance estimado.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {step === 6 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">Conecta tus Redes</h2>
                                <p className="text-muted-foreground">Obligatorio para que la IA pueda lanzar tus anuncios.</p>
                            </div>

                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                                    <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600">
                                        <Share2 className="h-8 w-8" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="font-semibold">Meta (Facebook & Instagram)</h3>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                            Conecta tu cuenta de publicidad de Meta para comenzar.
                                        </p>
                                    </div>
                                    <FacebookLoginButton
                                        appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""}
                                        onSuccess={(response: any) => {
                                            if (response.accessToken) {
                                                setFormData({ ...formData, metaToken: response.accessToken })
                                            }
                                        }}
                                        variant={formData.metaToken ? "secondary" : "outline"}
                                    >
                                        {formData.metaToken ? "¡Cuenta Conectada! ✅" : "Conectar Cuenta con Facebook"}
                                    </FacebookLoginButton>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                <div className="flex justify-between pt-8 border-t">
                    <Button
                        variant="ghost"
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1 || loading}
                    >
                        Atrás
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !formData.industry) ||
                            (step === 2 && !formData.productsDescription) ||
                            (step === 3 && !formData.location) ||
                            (step === 4 && !formData.goal) ||
                            (step === 5 && !formData.monthlyBudget) ||
                            loading
                        }
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {step === TOTAL_STEPS ? "Finalizar Setup" : "Siguiente"}
                        {!loading && step < TOTAL_STEPS && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}
