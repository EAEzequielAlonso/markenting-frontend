"use client"

import * as React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    Megaphone,
    Plus,
    TrendingUp,
    Users,
    Eye,
    MousePointerClick,
    Target,
    BarChart3,
    BrainCircuit,
    Loader2
} from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
    const { user: auth0User } = useAuth0()
    const router = useRouter()
    const [localUser, setLocalUser] = React.useState<any>(null)
    const [company, setCompany] = React.useState<any>(null)
    const [report, setReport] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const token = localStorage.getItem("token")
            const storedUser = localStorage.getItem("user")

            if (storedUser) setLocalUser(JSON.parse(storedUser))

            if (token) {
                try {
                    // Fetch Company
                    const companyResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/companies/my-company`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setCompany(companyResponse.data)

                    // Fetch Analytics Report
                    const reportResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/analytics/report`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setReport(reportResponse.data)

                    if (!companyResponse.data.industry) {
                        router.push("/dashboard/onboarding")
                    }
                } catch (error) {
                    console.error("Error fetching dashboard data:", error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const displayCompany = company || localUser?.company || {}

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Bienvenido, {localUser?.fullName?.split(" ")[0] || "Comercio"} 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Tu negocio de <span className="text-primary font-medium">{displayCompany.industry || "Rubro no definido"}</span> está listo para crecer.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/analytics">
                        <Button variant="outline">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Reportes
                        </Button>
                    </Link>
                    <Link href="/dashboard/organic/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Campaña
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-background to-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Impresiones</CardTitle>
                        <Eye className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report?.ads?.impressions?.toLocaleString() || "0"}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">Últimos 30 días</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background to-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report?.ads?.clicks?.toLocaleString() || "0"}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">Últimos 30 días</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background to-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">CTR Promedio</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report?.ads?.ctr ? `${parseFloat(report.ads.ctr).toFixed(2)}%` : "0.00%"}
                        </div>
                        <p className="text-xs text-muted-foreground">Click-through rate</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background to-muted/50 md:hidden lg:flex">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Objetivo: {displayCompany.goal || "Ventas"}</CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report?.whatsapp?.conversionRate ? `${report.whatsapp.conversionRate.toFixed(1)}%` : "0%"}
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${report?.whatsapp?.conversionRate || 0}%` }}></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* IA Strategy Section */}
            {displayCompany.strategySummary && (
                <Card className="border-primary/20 bg-primary/5 shadow-md overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                            <BrainCircuit className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Tu Estrategia IA Antigravedad</CardTitle>
                            <CardDescription>Generada automáticamente por nuestro Agente Estratega.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed italic">
                            "{report?.aiAnalysis || displayCompany.strategySummary || "Analizando tus datos para generar recomendaciones..."}"
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Area */}
            <div className="grid gap-6 md:grid-cols-7">
                <Card className="md:col-span-4 border-none shadow-lg bg-background/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Rendimiento Reciente</CardTitle>
                        <CardDescription>Visualiza el impacto de tus anuncios en los últimos 7 días.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center border rounded-md m-6 border-dashed border-muted-foreground/20">
                        <div className="text-center space-y-2">
                            <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground/30" />
                            <p className="text-muted-foreground text-sm">Próximamente: Gráficos de Meta Ads en tiempo real.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Estado de Integraciones</CardTitle>
                        <CardDescription>Configuración de tus canales de marketing.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                    <Target className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-sm">Meta Ads</span>
                            </div>
                            <span className={displayCompany.metaToken ? "text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium" : "text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium"}>
                                {displayCompany.metaToken ? "Conectado" : "Pendiente"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                                    <BrainCircuit className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-sm">Agente de IA</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">Activo</span>
                        </div>
                        <Link href="/dashboard/settings" className="w-full">
                            <Button variant="ghost" className="w-full text-primary" size="sm">
                                Gestionar Conexiones
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

