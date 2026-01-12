"use client"

import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentCancelPage() {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
            <div className="rounded-full bg-yellow-100 p-6">
                <AlertCircle className="h-16 w-16 text-yellow-600" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Pago Cancelado</h1>
                <p className="text-muted-foreground max-w-md">
                    No se ha realizado ningún cobro. Si tuviste problemas al procesar el pago, puedes intentar de nuevo o contactar a soporte.
                </p>
            </div>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => router.push("/dashboard/billing")}>
                    Reintentar
                </Button>
                <Button onClick={() => router.push("/dashboard")}>
                    Volver al Dashboard
                </Button>
            </div>
        </div>
    )
}
