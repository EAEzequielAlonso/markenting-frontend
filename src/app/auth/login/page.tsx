"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Ingresa tu contraseña"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
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
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data)
            localStorage.setItem("token", response.data.access_token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            router.push("/dashboard")
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                setError("Credenciales incorrectas") // Mensaje genérico por seguridad
            } else {
                setError("Ocurrió un error inesperado")
            }
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
                            &ldquo;La optimización de campañas con un solo clic nos ha ahorrado 20 horas semanales de trabajo manual.&rdquo;
                        </p>
                        <footer className="text-sm">Carlos Mendez - CEO de 'TechSolutions'</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Bienvenido de nuevo
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Ingresa tus credenciales para acceder al dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
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
                                Ingresar
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
                            console.log("[Login] Redirecting to Google with select_account...")
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
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.98 12c0-1.05-.12-1.74-.29-2.42H12v4.47h5.71c-.24 1.25-1.01 2.37-2.19 3.12v2.54h3.51c2.1-1.91 3.25-4.75 3.25-8.03l-.3-.68z" />
                                <path d="M12 22c2.72 0 4.98-.86 6.64-2.34l-3.3-2.61c-.88.6-2.02.97-3.34.97-2.6 0-4.83-1.72-5.63-4.04H2.89v2.66C4.6 20.08 8.04 22 12 22z" />
                                <path d="M6.37 13.98A6.095 6.095 0 0 1 5.96 12c0-.69.12-1.36.32-2.01V7.33H2.89A9.993 9.993 0 0 0 2 12c0 1.63.4 3.16 1.1 4.51l3.27-2.53z" />
                                <path d="M12 5.58c1.55 0 2.89.54 3.94 1.53l2.91-2.91C17.06 2.41 14.73 1.5 12 1.5 8.04 1.5 4.6 3.42 2.89 6.81l3.37 2.66C7.07 7.21 9.35 5.58 12 5.58z" />
                            </svg>
                        )}
                        Continuar con Google
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        ¿No tienes cuenta?{" "}
                        <a href="/auth/register" className="underline underline-offset-4 hover:text-primary">
                            Regístrate
                        </a>
                    </div>

                </div>
            </div>
        </div>
    )
}
