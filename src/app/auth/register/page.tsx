"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Eye, Loader2 } from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const registerSchema = z.object({
    fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    companyName: z.string().min(2, "El comercio debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const router = useRouter()
    const { loginWithRedirect } = useAuth0()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            router.push("/dashboard")
        }
    }, [router])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    })

    async function onSubmit(data: RegisterFormValues) {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data)
            // Guardar token (idealmente en cookie httpOnly o localStorage temporalmente)
            localStorage.setItem("token", response.data.access_token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            router.push("/dashboard/onboarding") // Redirigir a onboarding para configuración inicial
        } catch (err: any) {
            const message = err.response?.data?.message || "Error al registrarse"
            setError(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-6 w-6"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    SaaS Marketing AI
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Desde que usamos esta plataforma, nuestras ventas online han aumentado un 40% sin contratar agencia.&rdquo;
                        </p>
                        <footer className="text-sm">Sofia Rodriguez - Dueña de 'Green Style'</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Crea tu cuenta gratis
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Ingresa tus datos para comenzar tu prueba de 14 días.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="fullName">Nombre Completo</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Juan Perez"
                                    type="text"
                                    autoCapitalize="none"
                                    autoComplete="name"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    {...register("fullName")}
                                />
                                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="companyName">Nombre del Comercio</Label>
                                <Input
                                    id="companyName"
                                    placeholder="Mi Tienda SRL"
                                    type="text"
                                    disabled={isLoading}
                                    {...register("companyName")}
                                />
                                {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    placeholder="******"
                                    type="password"
                                    disabled={isLoading}
                                    {...register("password")}
                                />
                                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                            </div>

                            {error && (
                                <div className="bg-red-500/15 text-red-500 text-sm p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <Button disabled={isLoading}>
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Registrarse con Email
                            </Button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                O continuar con
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isLoading}
                        onClick={() => {
                            console.log("[Register] Redirecting to Google with select_account...")
                            loginWithRedirect({
                                authorizationParams: {
                                    connection: 'google-oauth2',
                                    prompt: 'select_account'
                                }
                            })
                        }}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                        )}
                        Registrarse con Google
                    </Button>
                </div>
            </div>
        </div>
    )
}
