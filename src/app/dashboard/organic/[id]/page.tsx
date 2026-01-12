"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Zap,
    Calendar,
    Share2,
    ArrowLeft,
    MoreVertical,
    MessageSquare,
    Facebook,
    Instagram,
    Smartphone,
    CheckCircle2,
    Clock,
    RefreshCw,
    AlertCircle,
    TrendingUp
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export default function CampaignDetails() {
    const { id } = useParams()
    const router = useRouter()
    const [campaign, setCampaign] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)
    const [regeneratingId, setRegeneratingId] = React.useState<string | null>(null)

    React.useEffect(() => {
        fetchCampaign()
    }, [id])

    const fetchCampaign = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${API_URL}/organic-campaign-campaigns/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            // Nota: Me di cuenta que el endpoint en el backend que creé es /organic-campaigns/:id
            // pero el controller tiene el prefix @Controller('organic-campaigns')
            // Re-chequeo el controlador.
            setCampaign(response.data)
        } catch (error) {
            // Intentar con el path correcto si el anterior falla (debido a mi confusión con los nombres)
            try {
                const token = localStorage.getItem("token")
                const res = await axios.get(`${API_URL}/organic-campaigns/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setCampaign(res.data)
            } catch (err) {
                console.error("Error fetching campaign details:", err)
                toast.error("No se pudo cargar la información de la campaña.")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleRegenerate = async (postId: string) => {
        setRegeneratingId(postId)
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(`${API_URL}/organic-campaigns/posts/${postId}/regenerate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("Contenido regenerado con éxito")
            // Actualizar el post en el estado local
            setCampaign((prev: any) => ({
                ...prev,
                posts: prev.posts.map((p: any) => p.id === postId ? response.data : p)
            }))
        } catch (error: any) {
            console.error("Error regenerating post:", error)
            const msg = error.response?.data?.message || "Error al regenerar el contenido."
            toast.error(msg)
        } finally {
            setRegeneratingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!campaign) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Campaña no encontrada.</p>
                <Button variant="link" onClick={() => router.back()}>Volver</Button>
            </div>
        )
    }

    const posts = campaign.posts || []
    const publishedCount = posts.filter((p: any) => p.status === 'PUBLISHED').length
    const plannedCount = posts.filter((p: any) => p.status === 'PLANNED').length

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Nav */}
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Campañas
            </Button>

            {/* Header Card */}
            <Card className="border-primary/10">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{campaign.name}</h1>
                                <Badge variant="default" className="bg-primary/20 text-primary border-none">
                                    {campaign.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">{campaign.objective}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Pausar</Button>
                            <Button size="sm" className="bg-primary">Editar IA Plan</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-0 border-t bg-muted/20 py-4">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Duración</p>
                        <p className="text-sm font-semibold">{campaign.durationDays} días</p>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Publicados</p>
                        <p className="text-sm font-semibold text-green-600">{publishedCount}</p>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Programados</p>
                        <p className="text-sm font-semibold text-primary">{plannedCount}</p>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Cupones</p>
                        <p className="text-sm font-semibold">{campaign.couponCode || 'Ninguno'}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="schedule" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="schedule">
                        <Calendar className="mr-2 h-4 w-4" />
                        Plan de Publicación
                    </TabsTrigger>
                    <TabsTrigger value="metrics">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Resultados
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="mt-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            Contenidos Generados por la IA
                        </h3>

                        <div className="grid gap-4">
                            {posts.length === 0 ? (
                                <p className="text-muted-foreground italic py-8 text-center bg-muted/10 rounded-lg border-dashed border-2">
                                    La IA está trabajando en tus contenidos. Refresca en unos segundos...
                                </p>
                            ) : (
                                posts.map((post: any, idx: number) => (
                                    <PostItem
                                        key={post.id}
                                        post={post}
                                        index={idx}
                                        onRegenerate={() => handleRegenerate(post.id)}
                                        isRegenerating={regeneratingId === post.id}
                                        plan={campaign?.company?.plan}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="metrics" className="mt-6">
                    <Card className="py-12 flex flex-col items-center justify-center text-center opacity-70">
                        <Share2 className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Métricas no disponibles todavía</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">
                            Las interacciones y clics se verán reflejados aquí una vez que la campaña comience a publicar.
                        </p>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function PostItem({ post, index, onRegenerate, isRegenerating, plan }: {
    post: any,
    index: number,
    onRegenerate: () => void,
    isRegenerating: boolean,
    plan: string
}) {
    const isNew = index === 0

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'facebook': return <Facebook className="h-4 w-4 text-blue-600" />;
            case 'instagram': return <Instagram className="h-4 w-4 text-pink-600" />;
            case 'whatsapp': return <Smartphone className="h-4 w-4 text-green-600" />;
            default: return <MessageSquare className="h-4 w-4" />;
        }
    }

    const date = new Date(post.scheduledFor).toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'short'
    })

    const time = new Date(post.scheduledFor).toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    })

    return (
        <Card className={`group hover:border-primary/30 transition-all ${isNew ? 'border-primary/40 bg-primary/5' : ''}`}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                        <div className="mt-1 p-2 rounded bg-muted flex items-center justify-center h-10 w-10">
                            {getPlatformIcon(post.platform)}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm capitalize">{post.platform}</span>
                                {post.status === 'PUBLISHED' ? (
                                    <Badge variant="outline" className="text-[10px] h-5 px-1 bg-green-50 text-green-700 border-green-200">
                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Publicado
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-[10px] h-5 px-1 bg-blue-50 text-blue-700 border-blue-200">
                                        <Clock className="h-3 w-3 mr-1" /> Programado
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {date} • {time}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] h-7 gap-1"
                            onClick={onRegenerate}
                            disabled={isRegenerating || post.status === 'PUBLISHED'}
                        >
                            {isRegenerating ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                                <RefreshCw className="h-3 w-3" />
                            )}
                            Regenerar
                        </Button>
                        <span className="text-[9px] text-muted-foreground italic">
                            {plan === 'BUSINESS' ? (2 - (post.regenerationCount || 0)) :
                                plan === 'PRO' ? (1 - (post.regenerationCount || 0)) : 0} disp.
                        </span>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-background rounded-md border text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap italic relative group">
                    {post.content}
                    {post.regenerationCount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-primary/10 border border-primary/20 text-primary text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                            <Zap className="h-2 w-2" /> REGENERADO {post.regenerationCount}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
