"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function FacebookCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading')

    React.useEffect(() => {
        const code = searchParams.get('code')
        const state = searchParams.get('state') // state es el companyId opcionalmente

        if (code) {
            confirmAuth(code)
        } else {
            setStatus('error')
        }
    }, [searchParams])

    const confirmAuth = async (code: string) => {
        try {
            const token = localStorage.getItem("token")
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/social/auth/facebook/confirm`,
                { code },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setStatus('success')
            toast.success("¡Facebook conectado con éxito!")
            setTimeout(() => {
                router.push("/dashboard/settings")
            }, 2000)
        } catch (error) {
            console.error("Error confirmando Facebook:", error)
            setStatus('error')
            toast.error("Error al conectar con Facebook.")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            {status === 'loading' && (
                <>
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Procesando conexión...</h2>
                        <p className="text-muted-foreground">Estamos vinculando tu cuenta de Meta.</p>
                    </div>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-green-600">¡Conexión Exitosa!</h2>
                        <p className="text-muted-foreground">Redirigiéndote a configuración...</p>
                    </div>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600">
                        <AlertCircle className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600">Ups, algo salió mal</h2>
                        <p className="text-muted-foreground">No pudimos completar la conexión con Facebook.</p>
                    </div>
                    <Button onClick={() => router.push("/dashboard/settings")}>
                        Volver a Configuración
                    </Button>
                </>
            )}
        </div>
    )
}
