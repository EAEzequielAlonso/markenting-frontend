"use client"

import * as React from "react"
import { Sparkles, BrainCircuit, Activity, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CapabilitiesGrid } from "@/components/dashboard/intelligence/capabilities-grid"
import { ActivityLog } from "@/components/dashboard/intelligence/activity-log"
import { IntelligenceInbox } from "@/components/dashboard/intelligence/inbox"
import Link from "next/link"

export default function IntelligencePage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        Centro de Inteligencia IA <Sparkles className="h-6 w-6 text-indigo-500 fill-indigo-500" />
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Tu equipo de inteligencia artificial analizando y optimizando tu negocio 24/7.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/settings">
                        <Button variant="outline">
                            <Settings2 className="mr-2 h-4 w-4" />
                            Configurar Autonomía
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Decision Inbox */}
            <section className="space-y-4">
                <IntelligenceInbox />
            </section>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Capabilities Grid (Left 2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-xl font-semibold tracking-tight">Capacidades Activas</h2>
                    </div>
                    <CapabilitiesGrid />
                </div>

                {/* Activity Feed (Right 1 col) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-xl font-semibold tracking-tight">Actividad Reciente</h2>
                    </div>
                    <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-base font-medium">Log de Operaciones</CardTitle>
                            <CardDescription className="text-xs">
                                Registro de análisis y acciones automáticas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ActivityLog />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
