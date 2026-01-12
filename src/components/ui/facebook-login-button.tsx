"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FacebookLoginButtonProps {
    appId: string
    onSuccess: (response: any) => void
    onFailure?: (error: any) => void
    className?: string
    children?: React.ReactNode
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

declare global {
    interface Window {
        fbAsyncInit: () => void
        FB: any
    }
}

export function FacebookLoginButton({
    appId,
    onSuccess,
    onFailure,
    className,
    children,
    variant = "outline"
}: FacebookLoginButtonProps) {
    const [isSdkLoaded, setIsSdkLoaded] = React.useState(false)

    React.useEffect(() => {
        if (!appId) return

        // Check if SDK is already loaded
        if (window.FB) {
            setIsSdkLoaded(true)
            return
        }

        // Setup async init
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: appId,
                cookie: true,
                xfbml: true,
                version: 'v18.0' // Use latest version
            })
            setIsSdkLoaded(true)
        }

        // Load SDK asynchronously
        const loadSdk = () => {
            if (document.getElementById('facebook-jssdk')) return
            const js = document.createElement('script')
            js.id = 'facebook-jssdk'
            js.src = "https://connect.facebook.net/en_US/sdk.js"
            document.body.appendChild(js)
        }

        loadSdk()
    }, [appId])

    const handleLogin = () => {
        if (!isSdkLoaded || !window.FB) {
            console.error("Facebook SDK not loaded yet")
            return
        }

        window.FB.login((response: any) => {
            if (response.authResponse) {
                // Get additional user info if needed, similar to the old library
                window.FB.api('/me', { fields: 'name,email,picture' }, (profileResponse: any) => {
                    const combinedResponse = {
                        ...profileResponse,
                        accessToken: response.authResponse.accessToken,
                        userID: response.authResponse.userID,
                        expiresIn: response.authResponse.expiresIn,
                        signedRequest: response.authResponse.signedRequest
                    }
                    onSuccess(combinedResponse)
                })
            } else {
                if (onFailure) {
                    onFailure({ status: 'unknown', message: 'User cancelled login or did not authorize.' })
                }
            }
        }, { scope: 'public_profile,email' })
    }

    return (
        <Button
            variant={variant}
            className={cn("w-full", className)}
            onClick={handleLogin}
            disabled={!isSdkLoaded}
            type="button"
        >
            {children || "Login with Facebook"}
        </Button>
    )
}
