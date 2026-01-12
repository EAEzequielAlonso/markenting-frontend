"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthHandshake({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, isLoading: isAuth0Loading } = useAuth0()
    const [isSyncing, setIsSyncing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        console.log("[AuthHandshake] State:", { isAuthenticated, hasUser: !!user, isAuth0Loading })

        const syncUser = async () => {
            if (isAuthenticated && user && !localStorage.getItem("token")) {
                console.log("[AuthHandshake] Starting sync with backend...")
                setIsSyncing(true)
                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/social-login`, {
                        email: user.email,
                        name: user.name,
                        sub: user.sub,
                        picture: user.picture,
                    })

                    localStorage.setItem("token", response.data.access_token)
                    localStorage.setItem("user", JSON.stringify(response.data.user))
                    console.log("[AuthHandshake] Sync successful")

                    if (!response.data.user.company?.onboardingCompleted) {
                        router.push("/dashboard/onboarding")
                    }
                } catch (error: any) {
                    console.error("[AuthHandshake] Sync failed:", error.response?.data || error.message)
                    localStorage.removeItem("token")
                    localStorage.removeItem("user")
                } finally {
                    setIsSyncing(false)
                }
            }
        }

        if (!isAuth0Loading) {
            syncUser()
        }
    }, [isAuthenticated, user, isAuth0Loading, router])

    const needsSync = isAuthenticated && user && !localStorage.getItem("token")

    if (isAuth0Loading || isSyncing || needsSync) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Sincronizando sesión...</p>
            </div>
        )
    }

    return <>{children}</>
}
