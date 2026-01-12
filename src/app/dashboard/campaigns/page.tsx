"use client"

import * as React from "react"
import {
    Megaphone,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Play,
    Pause,
    BarChart2,
    Trash2,
    Loader2
} from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { AdsSuggestionsInbox } from "@/components/dashboard/ads/suggestions-inbox"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<string | null>(null)

    const fetchCampaigns = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${API_URL}/ads/campaigns`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCampaigns(res.data)
        } catch (error) {
            console.error("Error fetching campaigns:", error)
            toast.error("Error al cargar las campañas.")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchCampaigns()
    }, [])

    const toggleStatus = async (id: string) => {
        try {
            const token = localStorage.getItem("token")
            await axios.patch(`${API_URL}/ads/campaigns/${id}/status`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("Estado actualizado con éxito.")
            fetchCampaigns()
        } catch (error) {
            toast.error("Error al actualizar el estado.")
        }
    }

    const deleteCampaign = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta campaña?")) return
        try {
            const token = localStorage.getItem("token")
            await axios.delete(`${API_URL}/ads/campaigns/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("Campaña eliminada.")
            fetchCampaigns()
        } catch (error) {
            toast.error("Error al eliminar la campaña.")
        }
    }

    const filteredCampaigns = campaigns.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter ? c.status === statusFilter : c.status !== 'ARCHIVED'
        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campañas Ads IA</h1>
                    <p className="text-muted-foreground">Gestiona tus anuncios y estrategia publicitaria real de Meta.</p>
                </div>
                <Link href="/dashboard/campaigns/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95">
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Campaña Ads
                    </Button>
                </Link>
            </div>

            {/* <AdsSuggestionsInbox /> - Movido al Centro de Inteligencia */}

            {/* Toolbar */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -mt-2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar campañas..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setStatusFilter(null)}>Todas las activas</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('ACTIVE')}>Solo Activas</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('PAUSED')}>Solo Pausadas</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('COMPLETED')}>Completadas</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Campaign Table/Cards */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredCampaigns.length > 0 ? (
                        filteredCampaigns.map((campaign) => (
                            <Card key={campaign.id} className="overflow-hidden hover:border-primary/50 transition-colors shadow-sm">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-6">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">{campaign.name}</h3>
                                                <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
                                                    {campaign.status === "ACTIVE" ? "Activa" : "Pausada"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground gap-4">
                                                <span className="flex items-center gap-1">
                                                    <Megaphone className="h-3 w-3" /> Meta Ads
                                                </span>
                                                <span className="text-[10px]">ID: {campaign.id.split('-')[0]}...</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:px-8 border-t md:border-t-0 md:border-l pt-4 md:pt-0">
                                            <div className="text-center md:text-left">
                                                <p className="text-[10px] uppercase text-muted-foreground">Inversión/Día</p>
                                                <p className="font-semibold text-sm">${campaign.dailyBudget} USD</p>
                                            </div>
                                            <div className="text-center md:text-left">
                                                <p className="text-[10px] uppercase text-muted-foreground">Objetivo</p>
                                                <p className="font-semibold text-sm">{campaign.objective}</p>
                                            </div>
                                            <div className="text-center md:text-left">
                                                <p className="text-[10px] uppercase text-muted-foreground">Estado Meta</p>
                                                <p className="font-semibold text-sm text-primary">{campaign.metaCampaignId ? 'Sincronizado' : 'Pendiente Push'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleStatus(campaign.id)}
                                                title={campaign.status === "ACTIVE" ? "Pausar" : "Activar"}
                                            >
                                                {campaign.status === "ACTIVE" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 text-green-600" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Ver Reporte">
                                                <BarChart2 className="h-4 w-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => toast.info("Función de duplicar próximamente.")}>Duplicar</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => deleteCampaign(campaign.id)} className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg">
                            <Megaphone className="mx-auto h-12 w-12 text-muted-foreground/30" />
                            <h3 className="mt-4 text-lg font-semibold">No hay campañas Ads</h3>
                            <p className="text-muted-foreground">Tus campañas Ads de Meta optimizadas aparecerán aquí.</p>
                            <Link href="/dashboard/campaigns/new">
                                <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white border-none">Crear mi primera campaña</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
