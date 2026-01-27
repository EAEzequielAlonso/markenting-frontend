'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAuth0 } from '@auth0/auth0-react';
import api from '@/lib/api';

export default function Auth0CallbackPage() {
    const router = useRouter();
    const { login } = useAuth();
    const { user, isAuthenticated, isLoading } = useAuth0();

    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            const socialDto = {
                email: user.email,
                name: user.name,
                picture: user.picture
            };

            api.post('/auth/social-login', socialDto)
                .then(res => {
                    const { accessToken, user: backendUser, churchId, claimProfile } = res.data;

                    if (claimProfile?.found) {
                        // Storing temp data for the claim screen
                        localStorage.setItem('tempToken', accessToken);
                        localStorage.setItem('claimPerson', JSON.stringify(claimProfile.person));
                        router.push('/claim-profile');
                    } else {
                        login(accessToken, backendUser, churchId);
                    }
                })
                .catch(err => {
                    console.error('Social Login failed', err);
                    router.push('/login?error=auth_failed');
                });
        } else if (!isLoading && !isAuthenticated) {
            // If we ended up here but not authenticated (e.g. user cancelled), go back to login
            // However, give it a moment as Auth0 might be initializing
        }
    }, [isLoading, isAuthenticated, user, login, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Autenticando...</h2>
                <p className="text-gray-500">Conectando con el servidor...</p>
            </div>
        </div>
    );
}
