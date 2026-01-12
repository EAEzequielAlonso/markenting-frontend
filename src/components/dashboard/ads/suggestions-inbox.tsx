"use client"

import * as React from "react"
import { Sparkles, ArrowRight, Check, X, AlertTriangle, ChevronRight } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Suggestion {
    id: string
    type: 'BUDGET_INCREASE' | 'PAUSE_CAMPAIGN' | 'CHANGE_COPY'
    message: string
    reasoning: string
    status: 'PENDING' | 'APPLIED' | 'IGNORED'
    campaign: {
        id: string
        name: string
    }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export function AdsSuggestionsInbox() {
    const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isExpanded, setIsExpanded] = React.useState(false)

    const fetchSuggestions = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${API_URL}/ads/suggestions`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSuggestions(res.data)
            // Auto expand if there are new/urgent suggestions? Maybe not, keep it compact.
        } catch (error) {
            console.error("Error fetching suggestions:", error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchSuggestions()
    }, [])

    const handleApply = async (id: string) => {
        try {
            const token = localStorage.getItem("token")
            await axios.patch(`${API_URL}/ads/suggestions/${id}/apply`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("Mejora aplicada con éxito")
            setSuggestions(prev => prev.filter(s => s.id !== id))
        } catch (error) {
            toast.error("Error al aplicar la sugerencia")
        }
    }

    const handleIgnore = async (id: string) => {
        try {
            const token = localStorage.getItem("token")
            await axios.patch(`${API_URL}/ads/suggestions/${id}/ignore`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.info("Sugerencia descartada")
            setSuggestions(prev => prev.filter(s => s.id !== id))
        } catch (error) {
            toast.error("Error al ignorar")
        }
    }

    if (loading) return (
        <div className="mb-4 p-3 rounded-lg border border-dashed border-slate-300 animate-pulse bg-slate-50/50">
            <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>
    )

    const hasSuggestions = suggestions.length > 0

    return (
        <div className="mb-6 space-y-3 animate-in slide-in-from-top-2 duration-500">
            {/* Collapsed Bar / Trigger */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300",
                    hasSuggestions
                        ? "bg-indigo-50/80 border-indigo-100 hover:bg-indigo-100/80"
                        : "bg-slate-50/80 border-slate-100 hover:bg-slate-100/80"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-1.5 rounded-full",
                        hasSuggestions ? "bg-indigo-500 text-white" : "bg-green-500 text-white"
                    )}>
                        {hasSuggestions ? <Sparkles className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {hasSuggestions
                                ? `IA: Tienes ${suggestions.length} sugerencias para tus campañas`
                                : "IA: Todo bajo control en tus Ads"
                            }
                        </p>
                        {!isExpanded && (
                            <p className="text-[10px] text-muted-foreground leading-none">
                                {hasSuggestions ? "Haz clic para ver las optimizaciones recomendadas" : "No hay acciones urgentes en este momento"}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {hasSuggestions && !isExpanded && (
                        <Badge className="bg-indigo-600 animate-bounce py-0 h-5">Nuevo</Badge>
                    )}
                    <ChevronRight className={cn(
                        "h-4 w-4 text-slate-400 transition-transform duration-300",
                        isExpanded && "rotate-90"
                    )} />
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="animate-in zoom-in-95 fade-in duration-300 origin-top">
                    {!hasSuggestions ? (
                        <Card className="border-dashed border-2 bg-white/50 dark:bg-slate-900/20">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Asistente IA Activo</p>
                                <p className="text-xs text-muted-foreground max-w-sm">
                                    Estoy analizando el rendimiento de tus Meta Ads 24/7.
                                    Aparecerán nuevas sugerencias aquí cuando detecte oportunidades de ahorro o mayor alcance.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {suggestions.map((suggestion) => (
                                <Card key={suggestion.id} className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm dark:bg-slate-950/50">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                                                {suggestion.campaign?.name || "General"}
                                            </Badge>
                                            {suggestion.type === 'BUDGET_INCREASE' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-sm leading-tight text-slate-800 dark:text-slate-100">
                                                {suggestion.message}
                                            </h3>
                                            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                                                {suggestion.reasoning}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                size="sm"
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs font-medium"
                                                onClick={() => handleApply(suggestion.id)}
                                            >
                                                <Check className="mr-1.5 h-3 w-3" /> Aplicar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="w-full text-slate-500 hover:text-slate-700 h-8 text-xs"
                                                onClick={() => handleIgnore(suggestion.id)}
                                            >
                                                Ignorar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
