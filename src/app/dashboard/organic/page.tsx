"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Zap, Share2, MessageSquare, TrendingUp, Calendar, ArrowRight } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export default function OrganicDashboard() {
    const [campaigns, setCampaigns] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetchCampaigns()
    }, [])

    const fetchCampaigns = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${API_URL}/organic-campaigns`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCampaigns(response.data)
        } catch (error) {
            console.error("Error fetching organic campaigns:", error)
            toast.error("No se pudieron cargar las campañas.")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campañas Orgánicas IA</h1>
                    <p className="text-muted-foreground mt-1">
                        Marketing real sin pagar anuncios, automatizado por nuestra inteligencia artificial.
                    </p>
                </div>
                <Button asChild className="w-full md:w-auto">
                    <Link href="/dashboard/organic/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Campaña Orgánica
                    </Link>
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Publicaciones IA</CardTitle>
                        <Zap className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{campaigns.reduce((acc, c) => acc + (c.posts?.length || 0), 0)}</div>
                        <p className="text-xs text-muted-foreground">Generadas y programadas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Redes en Uso</CardTitle>
                        <Share2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">META</div>
                        <p className="text-xs text-muted-foreground">FB, IG & WhatsApp</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Consultas (Est.)</CardTitle>
                        <MessageSquare className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Tracking orgánico activado</p>
                    </CardContent>
                </Card>
            </div>

            {/* Campaigns List */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Tus Campañas</h2>
                {campaigns.length === 0 ? (
                    <Card className="border-dashed py-12">
                        <CardContent className="flex flex-col items-center justify-center text-center">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-medium">No tienes campañas orgánicas aún</h3>
                            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                                Deja que la IA gestione tus redes sociales. Crea contenidos atractivos,
                                rotativos y enfocados en ventas sin gastar en anuncios.
                            </p>
                            <Button asChild>
                                <Link href="/dashboard/organic/new">
                                    Empezar ahora
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {campaigns.map((campaign) => (
                            <Card key={campaign.id} className="overflow-hidden flex flex-col">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant={campaign.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                            {campaign.status === 'ACTIVE' ? 'En marcha' : campaign.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {campaign.durationDays} días
                                        </span>
                                    </div>
                                    <CardTitle className="line-clamp-1">{campaign.name}</CardTitle>
                                    <CardDescription>{campaign.objective}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 font-medium">
                                            <span>Progreso de Publicación</span>
                                            <span>0%</span>
                                        </div>
                                        <Progress value={0} className="h-1.5" />
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <div className="px-2 py-1 rounded bg-muted">FB</div>
                                        <div className="px-2 py-1 rounded bg-muted">IG</div>
                                        <div className="px-2 py-1 rounded bg-muted">WA</div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t bg-muted/50 py-3">
                                    <Button variant="ghost" size="sm" className="w-full justify-between font-normal" asChild>
                                        <Link href={`/dashboard/organic/${campaign.id}`}>
                                            Ver detalles y métricas
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
