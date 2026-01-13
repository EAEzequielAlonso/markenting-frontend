import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Map, CheckCircle2, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoadmapPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="relative h-8 w-8 rounded-md overflow-hidden">
                            <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" />
                        </div>
                        <span>AdVantage AI</span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver al inicio
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
                <div className="space-y-4 mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Roadmap del Producto
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Estamos construyendo el futuro del marketing automatizado. Mira lo que hemos logrado y lo que está por venir.
                    </p>
                </div>

                <div className="relative border-l border-muted ml-4 md:ml-12 space-y-12">

                    {/* Q4 2025 - Completado */}
                    <div className="relative pl-8 md:pl-12">
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                        <div className="flex flex-col gap-2 mb-4">
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">Completado - Q4 2025</span>
                            <h3 className="text-2xl font-bold">Lanzamiento MVP</h3>
                        </div>
                        <div className="p-6 rounded-2xl bg-muted/30 border space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>Integración con Modelos de IA (OpenAI/DeepSeek) para generación de textos.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>Conexión básica con Facebook e Instagram (Graph API).</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>Panel de control para gestión de campañas simples.</span>
                            </div>
                        </div>
                    </div>

                    {/* Q1 2026 - En Progreso */}
                    <div className="relative pl-8 md:pl-12">
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-background animate-pulse" />
                        <div className="flex flex-col gap-2 mb-4">
                            <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">En Progreso - Q1 2026</span>
                            <h3 className="text-2xl font-bold">Expansión y Automatización</h3>
                        </div>
                        <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                <span><strong>Dashboard Avanzado:</strong> Métricas en tiempo real y reportes de rendimiento unificados.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                <span><strong>Agentes Autónomos:</strong> "Auto-piloto" para responder comentarios y mensajes directos simples.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                <span><strong>Multicanalidad:</strong> Soporte beta para LinkedIn y Twitter (X).</span>
                            </div>
                        </div>
                    </div>

                    {/* Q2 2026 - Futuro */}
                    <div className="relative pl-8 md:pl-12">
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-muted-foreground ring-4 ring-background" />
                        <div className="flex flex-col gap-2 mb-4">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Próximamente - Q2 2026</span>
                            <h3 className="text-2xl font-bold">Generación Multimedia</h3>
                        </div>
                        <div className="p-6 rounded-2xl bg-background border border-dashed space-y-3 opacity-80">
                            <div className="flex items-start gap-3">
                                <Star className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <span>Generación de imágenes y creatividades publicitarias con IA generativa desde el panel.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Star className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <span>Editor de video simple automatizado para Reels/TikToks.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Star className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <span>Marketplace de Prompts para nichos específicos.</span>
                            </div>
                        </div>
                    </div>

                    {/* Q3 2026 - Futuro */}
                    <div className="relative pl-8 md:pl-12">
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-muted-foreground ring-4 ring-background" />
                        <div className="flex flex-col gap-2 mb-4">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Q3 - Q4 2026</span>
                            <h3 className="text-2xl font-bold">IA Predictiva & Enterprise</h3>
                        </div>
                        <div className="p-6 rounded-2xl bg-background border border-dashed space-y-3 opacity-80">
                            <div className="flex items-start gap-3">
                                <Star className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <span>Predicción de tendencias virales basada en análisis de Big Data.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Star className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <span>API pública para desarrolladores.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Star className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <span>Marca blanca para agencias de marketing grandes.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <section className="mt-20 py-12 px-6 rounded-3xl bg-primary text-primary-foreground text-center">
                    <h2 className="text-3xl font-bold mb-4">Sé parte del viaje</h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        No solo mires desde afuera. Únete hoy y aprovecha las herramientas del mañana para tu negocio.
                    </p>
                    <Link href="/auth/register">
                        <Button variant="secondary" size="lg" className="font-bold rounded-full px-8">
                            Comenzar prueba gratuita
                        </Button>
                    </Link>
                </section>

            </main>

            <footer className="w-full py-8 border-t bg-muted/20 text-center">
                <p className="text-sm text-muted-foreground">
                    © 2026 AdVantage AI. Construyendo el futuro.
                </p>
            </footer>
        </div>
    );
}
