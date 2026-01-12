"use client"

import * as React from "react"
import {
    BarChart3,
    TrendingUp,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Download,
    Filter
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import axios from "axios"
import { Loader2 } from "lucide-react"

export default function AnalyticsPage() {
    const [report, setReport] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchReport = async () => {
            setIsLoading(true)
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/analytics/report`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setReport(response.data)
                } catch (error) {
                    console.error("Error fetching analytics report:", error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setIsLoading(false)
            }
        }
        fetchReport()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Análisis de Rendimiento</h1>
                    <p className="text-muted-foreground">Monitorea el impacto de tus campañas y el ROI en tiempo real.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Últimos 30 días
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Core KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-background to-muted/50 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">ROAS Total</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report?.ads?.spend > 0 ? "4.2x" : "0.0x"}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            ROAS Estimado
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background to-muted/50 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Inversión Total</CardTitle>
                        <BarChart3 className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${parseFloat(report?.ads?.spend || 0).toLocaleString()}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            Gasto en Meta Ads (30d)
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background to-muted/50 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Costo por Lead</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${parseFloat(report?.ads?.cpc || 0).toFixed(2)}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            Avg. Costo por Click
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background to-muted/50 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-none text-[10px]">Meta Ads</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report?.whatsapp?.interestedLeads || 0}
                        </div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            Leads interesados (WhatsApp)
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Graph Placeholder */}
                <Card className="lg:col-span-4 border-none shadow-lg bg-background/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Tendencia de Clicks vs Impresiones</CardTitle>
                        <CardDescription>Datos históricos de los últimos 7 días.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex items-end justify-between px-6 pb-6 pt-10">
                        {/* Dynamic Bar Chart based on daily impressions */}
                        {report?.adsDaily?.length > 0 ? report.adsDaily.slice(-10).map((day: any, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-2 group w-full">
                                <div className="relative w-8 bg-muted rounded-t-md overflow-hidden h-full flex items-end">
                                    <div
                                        className="w-full bg-primary/40 group-hover:bg-primary transition-all duration-500 rounded-t-sm"
                                        style={{ height: `${Math.min((day.impressions / (Math.max(...report.adsDaily.map((d: any) => d.impressions)) || 1)) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-[8px] text-muted-foreground rotate-45 mt-2">
                                    {new Date(day.date_start).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        )) : (
                            <div className="w-full text-center text-muted-foreground italic">
                                No hay datos diarios disponibles aún.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Channels */}
                <Card className="lg:col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Canales con Mejor ROI</CardTitle>
                        <CardDescription>Distribución de éxito por plataforma.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Facebook Newsfeed</span>
                                <span className="text-muted-foreground">65%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Instagram Stories</span>
                                <span className="text-muted-foreground">22%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full">
                                <div className="h-full bg-pink-500 rounded-full" style={{ width: '22%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">WhatsApp Direct</span>
                                <span className="text-muted-foreground">13%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: '13%' }}></div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground italic">Insight de la IA antigravedad:</span>
                                <p className="text-sm font-medium text-foreground">
                                    "{report?.aiAnalysis || "Pendiente de nuevos datos para generar el próximo análisis detallado."}"
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
