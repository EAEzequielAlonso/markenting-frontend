'use client';

export default function CultosPage() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Cultos</h1>
            <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-700">Módulo de Cultos</h2>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Organización de cronogramas, ujieres, multimedia, alabanza y orden del culto domingo a domingo.
                </p>
                <div className="mt-8">
                    <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full font-bold text-sm">
                        🚀 Próximamente
                    </span>
                </div>
            </div>
        </div>
    );
}
