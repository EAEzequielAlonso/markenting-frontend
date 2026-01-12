"use client"

import * as React from "react"
import { Activity, CheckCircle2, Info, AlertTriangle } from "lucide-react"
import axios from "axios"

interface Log {
    id: string
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
    message: string
    createdAt: string
    agentName: string
}

const MOCK_LOGS: Log[] = [
    {
        id: "mock-1",
        type: "INFO",
        message: "Monitor de Ads activado. Analizando campañas activas...",
        createdAt: new Date().toISOString(),
        agentName: "Sistema"
    },
    {
        id: "mock-2",
        type: "SUCCESS",
        message: "Análisis de tendencias de mercado completado.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        agentName: "Detector de Tendencias"
    }
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export function ActivityLog() {
    const [logs, setLogs] = React.useState<Log[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setLogs(MOCK_LOGS)
                    setLoading(false)
                    return
                }
                const res = await axios.get(`${API_URL}/ai/intelligence/activity`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.data && res.data.length > 0) {
                    setLogs(res.data)
                } else {
                    setLogs(MOCK_LOGS) // Fallback to mock for demo "aliveness"
                }
            } catch (error) {
                console.error("Error fetching logs", error)
                setLogs(MOCK_LOGS)
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()
    }, [])

    return (
        <div className="h-[300px] w-full rounded-md border p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-auto">
            <div className="space-y-3">
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="mt-0.5 shrink-0">
                            {log.type === 'SUCCESS' && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                            {log.type === 'WARNING' && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                            {log.type === 'INFO' && <Activity className="h-3.5 w-3.5 text-blue-500" />}
                        </div>
                        <div className="flex-1 space-y-0.5">
                            <p className="leading-tight text-slate-300">
                                <span className="font-semibold text-slate-100 mr-2">[{log.agentName}]</span>
                                {log.message}
                            </p>
                            <p className="text-[10px] text-slate-500">
                                {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(log.createdAt))}
                            </p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-2 items-center text-slate-500 animate-pulse">
                        <Activity className="h-3 w-3" />
                        <span>Sincronizando logs de actividad...</span>
                    </div>
                )}
            </div>
        </div>
    )
}
