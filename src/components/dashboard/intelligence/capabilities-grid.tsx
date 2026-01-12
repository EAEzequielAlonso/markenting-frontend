import { BrainCircuit, Zap, Search, BarChart3, PenTool, CheckCircle2, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const CAPABILITIES = [
    {
        id: "ads-optimization",
        name: "Optimización de Ads",
        description: "Monitoreo 24/7 de tus campañas de Meta Ads para detectar fugas de presupuesto.",
        icon: BarChart3,
        status: "ACTIVE",
        activeText: "Analizando ROAS...",
        autonomy: "SUGGESTION_ONLY", // Solo sugerencias
        area: "Paid Ads",
        color: "indigo"
    },
    {
        id: "content-creation",
        name: "Generación de Contenido",
        description: "Redacción de copys y propuestas de temas para tus redes sociales.",
        icon: PenTool,
        status: "ACTIVE",
        activeText: "Buscando tendencias...",
        autonomy: "SEMI_AUTO", // Puede sugerir y auto-publicar si se aprueba
        area: "Organic Social",
        color: "pink"
    },
    {
        id: "opportunity-detection",
        name: "Detector de Tendencias",
        description: "Análisis de tendencias de mercado para sugerir nuevos ángulos de venta.",
        icon: Search,
        status: "STANDBY",
        activeText: "Esperando ciclo...",
        autonomy: "SUGGESTION_ONLY",
        area: "Market Research",
        color: "amber"
    }
]

export function CapabilitiesGrid() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {CAPABILITIES.map((cap) => (
                <Card key={cap.id} className="relative overflow-hidden hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: `var(--${cap.color}-500)` }}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div className={cn(
                                "p-2 rounded-lg transition-all duration-1000",
                                `bg-${cap.color}-100 dark:bg-${cap.color}-900/20 text-${cap.color}-600`,
                                cap.status === 'ACTIVE' && "animate-pulse"
                            )}>
                                <cap.icon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col items-end">
                                <Badge variant="outline" className="text-[10px] font-medium mb-1">
                                    {cap.area}
                                </Badge>
                                {cap.status === 'ACTIVE' && (
                                    <span className="text-[10px] text-green-600 flex items-center gap-1 animate-pulse">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        {cap.activeText}
                                    </span>
                                )}
                            </div>
                        </div>
                        <CardTitle className="mt-4 text-base font-semibold">{cap.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-xs leading-relaxed mb-4">
                            {cap.description}
                        </CardDescription>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                            {cap.autonomy === 'SUGGESTION_ONLY' ? (
                                <Lock className="h-3 w-3 text-amber-500" />
                            ) : (
                                <Zap className="h-3 w-3 text-green-500" />
                            )}
                            <span className="font-medium">
                                {cap.autonomy === 'SUGGESTION_ONLY' ? 'Requiere Aprobación' : 'Semi-Automático'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
