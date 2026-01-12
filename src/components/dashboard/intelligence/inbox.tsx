"use client"

import * as React from "react"
import { Sparkles, Check, AlertTriangle, ChevronRight, BrainCircuit, Mic } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Suggestion {
    id: string
    category: 'ADS' | 'ORGANIC'
    type: string
    message: string
    reasoning: string
    status: 'PENDING' | 'APPLIED' | 'IGNORED'
    campaign?: {
        name: string
    }
    organicCampaign?: {
        name: string
    }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export function IntelligenceInbox() {
    const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isExpanded, setIsExpanded] = React.useState(false) // Default collapsed

    const fetchSuggestions = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                setLoading(false)
                return
            }
            const res = await axios.get(`${API_URL}/ai/intelligence/suggestions`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSuggestions(res.data)
            if (res.data && res.data.length > 0) {
                setIsExpanded(true) // Auto-expand if there are suggestions
            }
        } catch (error: any) {
            console.error("Error fetching suggestions:", error)
            // Error handling for 500 or other errors
            if (error.response?.status === 500) {
                // Optionally show a toast or a message in the UI
            }
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
            await axios.patch(`${API_URL}/ads/suggestions/${id}/apply`, {}, { // Still using ads endpoint for action for now, needs unification later if organic logic differs significantly
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("Acción aplicada con éxito")
            setSuggestions(prev => prev.filter(s => s.id !== id))
        } catch (error) {
            toast.error("Error al aplicar")
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
        <div className="p-4 rounded-xl border border-dashed border-slate-300 animate-pulse bg-slate-50/50 h-32">
            <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
            <div className="h-4 w-full bg-slate-100 rounded" />
        </div>
    )

    const hasSuggestions = suggestions.length > 0

    return (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-500">
            {/* Header / Summary Bar */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm",
                    hasSuggestions
                        ? "bg-gradient-to-r from-indigo-50 to-white border-indigo-100 hover:shadow-md"
                        : "bg-white border-slate-100"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-full shadow-sm",
                        hasSuggestions ? "bg-indigo-600 text-white" : "bg-green-500 text-white"
                    )}>
                        {hasSuggestions ? <Sparkles className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            Inbox de Decisiones
                            {hasSuggestions && <Badge variant="destructive" className="h-5 px-1.5 text-[10px] rounded-full">{suggestions.length}</Badge>}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {hasSuggestions
                                ? "La IA ha detectado oportunidades que requieren tu aprobación."
                                : "No hay acciones pendientes. Tus estrategias están optimizadas."}
                        </p>
                    </div>
                </div>
                <ChevronRight className={cn(
                    "h-5 w-5 text-slate-400 transition-transform duration-300",
                    isExpanded && "rotate-90"
                )} />
            </div>

            {/* List */}
            {isExpanded && (
                <div className="animate-in zoom-in-95 fade-in duration-300 origin-top">
                    {!hasSuggestions ? (
                        <div className="text-center py-8 text-muted-foreground bg-slate-50/50 rounded-xl border border-dashed">
                            <BrainCircuit className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Todo en orden por aquí.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {suggestions.map((suggestion) => (
                                <Card key={suggestion.id} className="border-l-4 shadow-sm hover:shadow-md transition-all bg-white dark:bg-slate-950"
                                    style={{ borderLeftColor: suggestion.category === 'ADS' ? '#4f46e5' : '#db2777' }}
                                >
                                    <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className={cn(
                                                    "text-[10px] font-bold tracking-wider border-0",
                                                    suggestion.category === 'ADS' ? "bg-indigo-50 text-indigo-700" : "bg-pink-50 text-pink-700"
                                                )}>
                                                    {suggestion.category === 'ADS' ? 'PUBLICIDAD' : 'ORGÁNICO'}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase">
                                                    {suggestion.campaign?.name || suggestion.organicCampaign?.name || "General"}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                                {suggestion.message}
                                            </h4>
                                            <div className="flex text-xs text-muted-foreground gap-1 items-start">
                                                <div className="mt-0.5 min-w-[3px] min-h-[3px] rounded-full bg-slate-400" />
                                                <p className="leading-snug">{suggestion.reasoning}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                                            <Button
                                                size="sm"
                                                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                                                onClick={() => handleApply(suggestion.id)}
                                            >
                                                <Check className="mr-1.5 h-3.5 w-3.5" /> Aprobar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="flex-1 md:flex-none text-slate-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleIgnore(suggestion.id)}
                                            >
                                                Descartar
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
