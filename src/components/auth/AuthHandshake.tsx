"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/context/AuthContext"

export default function AuthHandshake({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, isLoading: isAuth0Loading } = useAuth0()
    const { login, user: contextUser } = useAuth()
    const [isSyncing, setIsSyncing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const syncUser = async () => {
            // Check if Auth0 is authenticated, but we don't have a backend session in context yet
            if (isAuthenticated && user && !contextUser && !isSyncing) {
                console.log("[AuthHandshake] Starting sync with backend...")
                setIsSyncing(true)
                try {
                    // Assuming API URL is http://localhost:3002 as per previous context or env
                    // Ideally use process.env.NEXT_PUBLIC_API_URL
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

                    const response = await axios.post(`${apiUrl}/auth/social-login`, {
                        email: user.email,
                        name: user.name,
                        sub: user.sub,
                        picture: user.picture,
                    })

                    console.log("[AuthHandshake] Sync successful")

                    // Update context via login function
                    login(
                        response.data.accessToken,
                        response.data.user,
                        response.data.churchId || ""
                    );

                    // Redirect logic is handled inside login() now (it checks isOnboarded)
                    // But we might want to let the login function handle it completely.
                    // The login function in AuthContext already does: localStorage set + setUser + Router Push if isOnboarded check.

                } catch (error: any) {
                    console.error("[AuthHandshake] Sync failed:", error.response?.data || error.message)
                    // Ensure we don't end up in a loop, maybe logout?
                    // logout();
                } finally {
                    setIsSyncing(false)
                }
            }
        }

        if (!isAuth0Loading) {
            syncUser()
        }
    }, [isAuthenticated, user, isAuth0Loading, contextUser, login])

    const needsSync = isAuthenticated && user && !localStorage.getItem("token")

    // Determine if we should show the loader
    // 1. Auth0 is loading
    // 2. We are currently syncing with backend
    // 3. We are authenticated with Auth0 but context doesn't have the user yet (needs sync)
    // 4. We are authenticated but checking (isSyncing covers this)

    // logic: If Auth0 user exists but Context user does not, we are likely syncing or about to sync.
    const showLoader = isAuth0Loading || isSyncing || (isAuthenticated && !contextUser);

    if (showLoader) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Sincronizando sesión...</p>
            </div>
        )
    }

    return <>{children}</>
}
