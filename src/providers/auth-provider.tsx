"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    // Evitamos error si las variables no están definidas en build time, pero avisamos en runtime
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "";
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "";
    const redirectUri = process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL || "http://localhost:3000/dashboard";

    if (!domain || !clientId) {
        // Podríamos retornar null o un children sin provider si preferimos no romper, 
        // pero mejor renderizar children para que la app funcione (aunque auth falle)
        // hasta que el user ponga las keys.
        console.warn("Auth0 domain or client ID missing in environment variables.");
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
            }}
            cacheLocation="localstorage"
        >
            {children}
        </Auth0Provider>
    );
}
