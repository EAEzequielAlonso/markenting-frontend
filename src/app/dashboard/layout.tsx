"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Megaphone,
    Settings,
    LogOut,
    LineChart,
    BrainCircuit,
    Store,
    CreditCard,
    Share2,
    Zap
} from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Vista General", href: "/dashboard" },
    { icon: Megaphone, label: "Campañas Ads IA", href: "/dashboard/campaigns" },
    { icon: Share2, label: "Community Manager", href: "/dashboard/social" },
    { icon: Zap, label: "Campañas Orgánicas IA", href: "/dashboard/organic" },
    { icon: BrainCircuit, label: "Agentes IA", href: "/dashboard/agents" },
    { icon: LineChart, label: "Métricas", href: "/dashboard/analytics" },
    { icon: Settings, label: "Configuración", href: "/dashboard/settings" },
    { icon: CreditCard, label: "Suscripción", href: "/dashboard/billing" },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { logout, isAuthenticated, isLoading: isAuthLoading } = useAuth0()
    const [user, setUser] = React.useState<{ fullName?: string; avatarUrl?: string } | null>(null)
    const [isClient, setIsClient] = React.useState(false)

    React.useEffect(() => {
        setIsClient(true)
        if (isAuthLoading) return;

        const stored = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        console.log("[Dashboard Guard] State:", {
            isAuthenticated,
            hasToken: !!token,
            isAuthLoading,
            path: pathname
        })

        if (stored && stored !== "undefined" && stored !== "null") {
            try {
                setUser(JSON.parse(stored))
            } catch (e) {
                console.error("Error parsing user data", e)
                localStorage.removeItem("user")
            }
        }

        // Protección de ruta revisada
        if (!token && !isAuthenticated) {
            console.warn("[Dashboard Guard] No session found, redirecting...")
            router.push("/auth/login")
        }
    }, [isAuthLoading, isAuthenticated, router, pathname])

    // No renderizar nada hasta que el cliente esté listo para evitar hidratación incorrecta
    if (!isClient || (isAuthLoading && !localStorage.getItem("token"))) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    // No renderizar nada del layout (Sidebar/Header) si no hay sesión
    // Esto previene el parpadeo de ver el dashboard antes de ser expulsado al login
    const hasSession = !!localStorage.getItem("token") || isAuthenticated

    if (!isClient || isAuthLoading || (!hasSession && !isAuthLoading)) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground animate-pulse text-sm">Validando acceso...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/20 flex">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
                <div className="flex h-16 items-center px-6 border-b">
                    <Store className="h-6 w-6 text-primary mr-2" />
                    <span className="font-bold text-lg">SaaS Marketing AI</span>
                </div>
                <nav className="flex-1 flex flex-col gap-1 p-4">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-destructive"
                        onClick={() => {
                            localStorage.clear()
                            logout({ logoutParams: { returnTo: window.location.origin } })
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 sm:ml-64">
                <header className="h-16 flex items-center justify-between px-6 border-b bg-background sticky top-0 z-10">
                    <h2 className="font-semibold text-lg capitalize">
                        {pathname.split("/").pop() || "Dashboard"}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                            Hola, {user?.fullName || "Comercio"}
                        </span>
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                            ) : (
                                user?.fullName?.[0] || "C"
                            )}
                        </div>
                    </div>
                </header>
                <div className="p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
