import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageContainerProps {
    title: string;
    description?: string;
    headerAction?: React.ReactNode;
    children: React.ReactNode;
    backButton?: boolean;
}

export default function PageContainer({ title, description, headerAction, children, backButton }: PageContainerProps) {
    const router = useRouter();

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="space-y-1">
                    {backButton && (
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-2 transition-colors font-medium"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Volver
                        </button>
                    )}
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
                    {description && <p className="text-slate-500 text-lg leading-relaxed">{description}</p>}
                </div>
                {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}
