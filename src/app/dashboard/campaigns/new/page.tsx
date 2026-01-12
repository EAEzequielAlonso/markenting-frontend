"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Megaphone,
    ChevronRight,
    ChevronLeft,
    Check,
    Info,
    Target,
    ShoppingBag,
    Users,
    Wallet,
    Eye,
    AlertCircle,
    BrainCircuit,
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
    { title: "Objetivo", description: "¿Qué quieres lograr?", icon: Target },
    { title: "Oferta", description: "Detalles del anuncio", icon: ShoppingBag },
    { title: "Audiencia", description: "¿A quién llegamos?", icon: Users },
    { title: "Presupuesto", description: "Inversión y tiempo", icon: Wallet },
    { title: "Creatividad", description: "Magia de IA", icon: BrainCircuit },
    { title: "Lanzamiento", description: "Revisión final", icon: Check },
]

export default function AdsCampaignWizard() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = React.useState(1)
    const [loading, setLoading] = React.useState(false)
    const [company, setCompany] = React.useState<any>(null)
    const [formData, setFormData] = React.useState({
        name: "",
        objective: "MESSAGES",
        productDescription: "",
        offer: "",
        couponCode: "",
        cta: "WHATSAPP_MESSAGE",
        location: "",
        targetRadius: 5,
        ageRange: "18-65+",
        gender: "ALL",
        interests: "",
        dailyBudget: 5,
        durationDays: 7,
    })

    const [aiCreativity, setAiCreativity] = React.useState({
        copy: "",
        headline: "",
        description: ""
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

    const handleNext = async () => {
        if (currentStep === 4 && !aiCreativity.copy) {
            // We generate creativity before moving to step 5
            await generateAiCreativity()
        }
        if (currentStep < 6) setCurrentStep(currentStep + 1)
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const generateAiCreativity = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post(`${API_URL}/ads/generate-proposal`, {
                objective: formData.objective,
                productDescription: formData.productDescription,
                cta: formData.cta
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            try {
                const parsed = JSON.parse(res.data.proposal)
                setAiCreativity({
                    copy: parsed.copy || "¡Descubre nuestra oferta especial! 🚀 Atendemos por WhatsApp.",
                    headline: parsed.headline || "Oferta Exclusiva",
                    description: parsed.description || "Calidad garantizada."
                })
            } catch (e) {
                // Si no es JSON, guardar en copy
                setAiCreativity({
                    copy: res.data.proposal || "¡Descubre nuestra oferta especial! 🚀 Atendemos por WhatsApp.",
                    headline: "Oferta Exclusiva",
                    description: "Calidad garantizada."
                })
            }
        } catch (error) {
            toast.error("Error generando creatividad con IA.")
        } finally {
            setLoading(false)
        }
    }

    const [autoPublish, setAutoPublish] = React.useState(false)

    // ... (rest of simple state)

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            await axios.post(`${API_URL}/ads/campaigns`, {
                ...formData,
                aiCopy: aiCreativity.copy,
                aiHeadline: aiCreativity.headline,
                aiDescription: aiCreativity.description,
                autoPublish: autoPublish // Flag for backend
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("¡Campaña Ads creada con éxito!")
            router.push("/dashboard/campaigns")
        } catch (error: any) {
            toast.error("Error al crear la campaña Ads.")
        } finally {
            setLoading(false)
        }
    }

    const progressValue = (currentStep / 6) * 100

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Nueva Campaña Ads con IA</h1>
                        <p className="text-sm text-muted-foreground">Paso {currentStep} de 6: {STEPS[currentStep - 1].title}</p>
                    </div>
                    <Megaphone className="h-8 w-8 text-primary" />
                </div>
                <Progress value={progressValue} className="h-2" />
                <div className="grid grid-cols-6 gap-2">
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
                            {/* ... (Step 1 inputs kept same, just ensuring context wrapping) */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre de la Campaña</Label>
                                <Input
                                    id="name"
                                    placeholder="Ej: Campaña Black Friday 2026"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Objetivo de Marketing</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: "MESSAGES", label: "Mensajes", desc: "WhatsApp y Messenger" },
                                        { id: "TRAFFIC", label: "Tráfico", desc: "Visitas al sitio" },
                                        { id: "AWARENESS", label: "Alcance", desc: "Reconocimiento local" },
                                        { id: "CONVERSIONS", label: "Conversiones", desc: "Ventas directas" },
                                    ].map((obj) => (
                                        <div
                                            key={obj.id}
                                            onClick={() => setFormData({ ...formData, objective: obj.id })}
                                            className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${formData.objective === obj.id ? 'border-primary bg-primary/5' : 'hover:border-primary/30'}`}
                                        >
                                            <p className="font-bold text-sm">{obj.label}</p>
                                            <p className="text-[10px] text-muted-foreground">{obj.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="desc">¿Qué quieres promocionar?</Label>
                                <Textarea
                                    id="desc"
                                    placeholder="Describe tu producto o servicio..."
                                    value={formData.productDescription}
                                    onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="offer">Oferta (Opcional)</Label>
                                    <Input
                                        id="offer"
                                        placeholder="Ej: 20% OFF hoy"
                                        value={formData.offer}
                                        onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="coupon">Cupón</Label>
                                    <Input
                                        id="coupon"
                                        placeholder="Ej: OFF10"
                                        value={formData.couponCode}
                                        onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>CTA</Label>
                                <Select value={formData.cta} onValueChange={(v) => setFormData({ ...formData, cta: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="WHATSAPP_MESSAGE">Enviar WhatsApp</SelectItem>
                                        <SelectItem value="LEARN_MORE">Más información</SelectItem>
                                        <SelectItem value="BOOK_NOW">Reservar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="loc">Ubicación</Label>
                                <Input
                                    id="loc"
                                    placeholder="Ciudad o dirección..."
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Edad</Label>
                                    <Input value={formData.ageRange} onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Género</Label>
                                    <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Todos</SelectItem>
                                            <SelectItem value="MEN">Hombres</SelectItem>
                                            <SelectItem value="WOMEN">Mujeres</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Presupuesto Diario (USD)</Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    value={formData.dailyBudget}
                                    onChange={(e) => setFormData({ ...formData, dailyBudget: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Días</Label>
                                <Input
                                    type="number"
                                    value={formData.durationDays}
                                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-200">
                                <strong>Importante:</strong> El presupuesto se factura directamente en tu cuenta de Meta Ads.
                            </div>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="border rounded-xl p-4 space-y-3 bg-muted/20">
                                <p className="text-xs font-bold uppercase text-muted-foreground">Creatividad IA</p>
                                {loading ? (
                                    <div className="animate-pulse space-y-2">
                                        <div className="h-4 bg-muted rounded w-3/4"></div>
                                        <div className="h-20 bg-muted rounded"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold">{aiCreativity.headline}</p>
                                        <p className="text-sm">{aiCreativity.copy}</p>
                                    </div>
                                )}
                            </div>
                            <Button variant="outline" size="sm" onClick={generateAiCreativity} disabled={loading}>
                                <BrainCircuit className="mr-2 h-4 w-4" /> Regenerar
                            </Button>
                        </div>
                    )}

                    {currentStep === 6 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-muted/30 p-4 rounded-lg border space-y-2">
                                <p className="text-sm"><strong>Campaña:</strong> {formData.name}</p>
                                <p className="text-sm"><strong>Objetivo:</strong> {formData.objective}</p>
                                <p className="text-sm"><strong>Presupuesto:</strong> ${formData.dailyBudget * formData.durationDays} USD Estimado</p>
                            </div>

                            <div className="flex items-center space-x-2 border p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800">
                                <div className="flex-1">
                                    <Label htmlFor="auto-publish" className="text-base font-semibold">Publicar Automáticamente en Meta</Label>
                                    <p className="text-xs text-muted-foreground">Si desactivas esto, la campaña se creará en modo borrador local.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    id="auto-publish"
                                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    checked={autoPublish}
                                    onChange={(e) => setAutoPublish(e.target.checked)}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between border-t bg-muted/10 p-6">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || loading}>
                        Atrás
                    </Button>
                    {currentStep < 6 ? (
                        <Button onClick={handleNext} disabled={!formData.name || loading}>
                            {loading ? "Generando..." : "Siguiente"} <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading}>
                            Finalizar y Lanzar
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
