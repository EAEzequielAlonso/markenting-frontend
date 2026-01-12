"use client"

import * as React from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import {
    Facebook,
    Loader2,
    RefreshCw,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Twitter,
    Linkedin,
    Youtube,
    MessageCircle,
    Music2,
    Globe
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const INTEGRATIONS = [
    {
        id: "facebook",
        name: "Meta (Facebook & Instagram)",
        description: "Publicidad y Posts Orgánicos + WhatsApp.",
        icon: Facebook,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900/20",
        connected: false,
        action: "connect"
    },
    {
        id: "google",
        name: "Google Ads",
        description: "Próximamente.",
        icon: Globe,
        iconColor: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/10",
        connected: false,
        action: "upcoming"
    },
    {
        id: "x",
        name: "X (Twitter)",
        description: "Próximamente.",
        icon: Twitter,
        iconColor: "text-slate-900 dark:text-slate-100",
        bgColor: "bg-slate-100 dark:bg-slate-800",
        connected: false,
        action: "upcoming"
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        description: "Próximamente.",
        icon: Linkedin,
        iconColor: "text-blue-700",
        bgColor: "bg-blue-50 dark:bg-blue-900/10",
        connected: false,
        action: "upcoming"
    },
    /*{
        id: "whatsapp",
        name: "WhatsApp",
        description: "Próximamente.",
        icon: MessageCircle,
        iconColor: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900/20",
        connected: false,
        action: "upcoming"
    },*/
    {
        id: "tiktok",
        name: "TikTok Ads",
        description: "Próximamente.",
        icon: Music2,
        iconColor: "text-pink-600",
        bgColor: "bg-pink-100 dark:bg-pink-900/20",
        connected: false,
        action: "upcoming"
    },
    {
        id: "youtube",
        name: "YouTube",
        description: "Próximamente.",
        icon: Youtube,
        iconColor: "text-red-700",
        bgColor: "bg-red-50 dark:bg-red-900/10",
        connected: false,
        action: "upcoming"
    }
]

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
    const [loading, setLoading] = React.useState(false)
    const [aiConfig, setAiConfig] = React.useState({
        aiContext: "",
        aiObjective: "",
        aiTone: "",
        aiConstraints: ""
    })

    React.useEffect(() => {
        fetchCompanySettings()
    }, [])

    const fetchCompanySettings = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/companies/my-company`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = response.data
            setAiConfig({
                aiContext: data.aiContext || "",
                aiObjective: data.aiObjective || "",
                aiTone: data.aiTone || "",
                aiConstraints: data.aiConstraints || ""
            })
        } catch (error) {
            console.error(error)
        }
    }

    const saveAiConfig = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/companies/my-company`, aiConfig, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("Configuración de IA actualizada.")
        } catch (error) {
            toast.error("Error al guardar configuración.")
        } finally {
            setLoading(false)
        }
    }

    const connectFacebook = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/social/auth/facebook`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.data.url) {
                window.location.href = response.data.url
            }
        } catch (error) {
            console.error(error)
            toast.error("Error al conectar con Facebook.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
                <p className="text-muted-foreground">Gestiona tus integraciones y el cerebro de tu IA.</p>
            </div>

            <Tabs defaultValue="integrations" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="integrations">Integraciones</TabsTrigger>
                    <TabsTrigger value="ai-brain">Cerebro IA</TabsTrigger>
                </TabsList>

                <TabsContent value="integrations" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Integraciones</CardTitle>
                            <CardDescription>Conecta tus redes sociales para potenciar la IA.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            {INTEGRATIONS.map((app) => (
                                <div
                                    key={app.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 border rounded-xl transition-all duration-200 hover:shadow-sm",
                                        app.action === "upcoming" && "opacity-60"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-2 rounded-lg", app.bgColor, app.iconColor)}>
                                            <app.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">{app.name}</h3>
                                            <p className="text-xs text-muted-foreground">{app.description}</p>
                                        </div>
                                    </div>

                                    {app.action === "connect" ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={connectFacebook}
                                            disabled={loading}
                                        >
                                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Conectar
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="sm" disabled className="text-xs">
                                            Próximamente
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ai-brain" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personalidad y Conocimiento</CardTitle>
                            <CardDescription>Define cómo debe comportarse tu Agente IA al responder mensajes y comentarios.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="context">Contexto del Negocio</Label>
                                <Textarea
                                    id="context"
                                    placeholder="Ej: Somos una pizzería en el centro de Buenos Aires. Nuestra especialidad es la masa madre..."
                                    className="min-h-[100px]"
                                    value={aiConfig.aiContext}
                                    onChange={(e) => setAiConfig({ ...aiConfig, aiContext: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">Información base que la IA usará para entender quién eres.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="objective">Objetivo Principal</Label>
                                    <Input
                                        id="objective"
                                        placeholder="Ej: Conseguir reservas de mesa"
                                        value={aiConfig.aiObjective}
                                        onChange={(e) => setAiConfig({ ...aiConfig, aiObjective: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tone">Tono de Voz</Label>
                                    <Input
                                        id="tone"
                                        placeholder="Ej: Divertido y juvenil, con emojis"
                                        value={aiConfig.aiTone}
                                        onChange={(e) => setAiConfig({ ...aiConfig, aiTone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="constraints">Restricciones</Label>
                                <Textarea
                                    id="constraints"
                                    placeholder="Ej: Nunca dar precios exactos sin preguntar detalles. No usar jerga técnica..."
                                    value={aiConfig.aiConstraints}
                                    onChange={(e) => setAiConfig({ ...aiConfig, aiConstraints: e.target.value })}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={saveAiConfig} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Configuración
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
