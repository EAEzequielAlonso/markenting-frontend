"use client"

import * as React from "react"
import axios from "axios"
import { Send, Sparkles, MessageSquare, Facebook, Instagram, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function SocialMediaPage() {
    const [content, setContent] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [publishing, setPublishing] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [company, setCompany] = React.useState<any>(null)
    const [pages, setPages] = React.useState<any[]>([])
    const [loadingPages, setLoadingPages] = React.useState(false)

    // AI Options state
    const [instructions, setInstructions] = React.useState("")
    const [tone, setTone] = React.useState("profesional")
    const [length, setLength] = React.useState("medio")

    React.useEffect(() => {
        fetchCompanyData()
    }, [])

    const fetchCompanyData = async () => {
        const token = localStorage.getItem("token")
        if (!token) return
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/companies/my-company`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCompany(response.data)

            if (response.data.metaToken && !response.data.fbPageId) {
                fetchAvailablePages(token)
            }
        } catch (error) {
            console.error("Error fetching company:", error)
        }
    }

    const fetchAvailablePages = async (token: string) => {
        setLoadingPages(true)
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/social/facebook/pages`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPages(response.data)
        } catch (error) {
            console.error("Error fetching pages:", error)
            toast.error("No se pudieron cargar tus páginas de Facebook.")
        } finally {
            setLoadingPages(false)
        }
    }

    const handleSelectPage = async (pageId: string, pageAccessToken: string) => {
        const token = localStorage.getItem("token")
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/social/facebook/select-page`,
                { pageId, pageAccessToken },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success("Página seleccionada correctamente.")
            fetchCompanyData()
        } catch (error) {
            toast.error("Error al seleccionar la página.")
        }
    }

    const generateAIContent = async () => {
        setLoading(true)
        const token = localStorage.getItem("token")
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/social/generate-post`,
                { instructions, tone, length },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setContent(response.data)
            toast.success("¡Sugerencia generada!")
        } catch (error: any) {
            console.error(error)
            const message = error.response?.data?.message || "Error al generar contenido con IA."
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    const handlePublish = async () => {
        if (!content) return
        setPublishing(true)
        const token = localStorage.getItem("token")
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/social/publish`,
                { message: content },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success("¡Contenido publicado exitosamente!")
            setSuccess(true)
            setTimeout(() => setSuccess(false), 5000)
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.message || "Para publicar realmente, primero debes conectar tu página en Configuración."
            toast.info(msg)
        } finally {
            setPublishing(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Community Manager IA</h1>
                    <p className="text-muted-foreground">Administra tus redes con posteos directos generados por IA.</p>
                </div>
                <div className="flex gap-2">
                    {company?.plan && (
                        <Badge variant="secondary" className="flex gap-1 items-center px-3 py-1 bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Sparkles className="h-3 w-3" />
                            {company.plan === 'BUSINESS' ? (50 - (company.monthlyAiEditsUsed || 0)) :
                                company.plan === 'PRO' ? (10 - (company.monthlyAiEditsUsed || 0)) : 0} disp.
                        </Badge>
                    )}
                    <Badge variant="outline" className={cn("flex gap-1 items-center px-3 py-1", company?.metaToken ? "text-green-600 border-green-200 bg-green-50" : "text-muted-foreground")}>
                        <Facebook className="h-3 w-3" /> Facebook {company?.fbPageId ? "✓" : ""}
                    </Badge>
                </div>
            </div>

            {(!company?.metaToken && !loading) && (
                <Card className="border-dashed bg-muted/30">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <Facebook className="h-12 w-12 text-muted-foreground opacity-20" />
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">Redes No Conectadas</h2>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Para publicar contenido orgánico y gestionar tus redes, primero debes vincular tu cuenta de Meta en la configuración.
                            </p>
                        </div>
                        <Button asChild>
                            <a href="/dashboard/settings">Conectar Redes Ahora</a>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {company?.metaToken && !company?.fbPageId && pages.length > 0 && (
                <Alert className="bg-blue-50 border-blue-200">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">Conexión de Página Pendiente</AlertTitle>
                    <AlertDescription className="space-y-3">
                        <p className="text-blue-700">Selecciona en qué página de Facebook deseas publicar tus posts orgánicos:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                            {pages.map((page) => (
                                <Button
                                    key={page.id}
                                    variant="outline"
                                    size="sm"
                                    className="justify-start h-auto py-2 px-3"
                                    onClick={() => handleSelectPage(page.id, page.access_token)}
                                >
                                    <div className="text-left">
                                        <div className="font-semibold text-xs">{page.name}</div>
                                        <div className="text-[10px] text-muted-foreground">{page.category}</div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {company?.metaToken && !company?.fbPageId && pages.length === 0 && !loadingPages && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No se encontraron páginas</AlertTitle>
                    <AlertDescription>
                        Asegúrate de que tu cuenta de Meta tenga páginas de Facebook administradas y que hayas concedido los permisos necesarios.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            Nuevo Post con IA
                        </CardTitle>
                        <CardDescription>
                            El Community Manager IA generará contenido optimizado basado en tus objetivos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-dashed">
                            <div className="space-y-2">
                                <Label htmlFor="instructions" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">¿Sobre qué quieres publicar?</Label>
                                <Textarea
                                    id="instructions"
                                    placeholder="Ej: Oferta de fin de semana en pizzas, recordatorio de horario de atención..."
                                    className="min-h-[80px] bg-background"
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tono</Label>
                                    <Select value={tone} onValueChange={setTone}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Selecciona un tono" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="profesional">Empresarial / Pro</SelectItem>
                                            <SelectItem value="familiar">Familiar / Cercano</SelectItem>
                                            <SelectItem value="formal">Formal</SelectItem>
                                            <SelectItem value="informal">Informal / Relajado</SelectItem>
                                            <SelectItem value="divertido">Divertido / Humor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Extensión</Label>
                                    <Select value={length} onValueChange={setLength}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Longitud" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="corto">Corto (Twitter style)</SelectItem>
                                            <SelectItem value="medio">Medio (Estándar)</SelectItem>
                                            <SelectItem value="largo">Largo (Descriptivo)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resultado de la IA (puedes editarlo)</Label>
                            <Textarea
                                placeholder="El contenido generado aparecerá aquí..."
                                className="min-h-[150px] text-base leading-relaxed"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="outline" onClick={generateAIContent} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Generar Sugerencia
                        </Button>
                        <Button onClick={handlePublish} disabled={!content || publishing}>
                            {publishing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                            Publicar Muro
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Vista Previa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-xl p-4 bg-muted/30 min-h-[150px] whitespace-pre-wrap italic">
                                {content || "La vista previa de tu publicación aparecerá aquí..."}
                            </div>
                        </CardContent>
                    </Card>

                    <Alert className="bg-blue-50 border-blue-200">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">Objetivo: Engagement</AlertTitle>
                        <AlertDescription className="text-blue-700">
                            Las publicaciones orgánicas ayudan a construir comunidad. Alterna entre contenido de valor y ofertas directas para maximizar resultados gratuitos.
                        </AlertDescription>
                    </Alert>

                    {success && (
                        <Alert className="bg-green-50 border-green-200 animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-800">¡Publicado!</AlertTitle>
                            <AlertDescription className="text-green-700">
                                Tu post se ha enviado exitosamente a tu muro de Facebook.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    )
}
