"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
            <div className="rounded-full bg-green-100 p-6">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">¡Pago Confirmado!</h1>
                <p className="text-muted-foreground max-w-md">
                    Tu suscripción ha sido activada correctamente. Ahora tienes acceso total a las herramientas de IA para escalar tu negocio.
                </p>
            </div>
            <Button onClick={() => router.push("/dashboard")} className="px-8">
                Ir al Dashboard
            </Button>
        </div>
    )
}
