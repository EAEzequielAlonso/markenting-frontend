'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    sectionName?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-red-900">
                            Algo salió mal en {this.props.sectionName || 'esta sección'}
                        </h3>
                        <p className="text-sm text-red-700 max-w-md mt-1">
                            Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
                        </p>
                        {this.state.error && (
                            <p className="text-xs text-red-500 mt-2 font-mono bg-red-50 p-2 rounded">
                                Error: {this.state.error.message}
                            </p>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900"
                        onClick={() => window.location.reload()}
                    >
                        Recargar Página
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
