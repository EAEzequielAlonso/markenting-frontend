import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Cookie, Settings, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiesPage() {
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

            <main className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
                <div className="space-y-4 mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Política de Cookies
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Explicación clara sobre cómo y por qué utilizamos cookies y tecnologías similares en AdVantage AI para mejorar tu experiencia.
                    </p>
                    <div className="text-sm text-muted-foreground font-medium pt-2">
                        Última actualización: 13 de Enero de 2026
                    </div>
                </div>

                <div className="grid gap-12">
                    {/* 1. Qué son */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Cookie className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">1. ¿Qué son las Cookies?</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Las cookies son pequeños archivos de texto que los sitios web que visitas guardan en tu navegador. Permiten que el sitio recuerde tus acciones y preferencias (como tu inicio de sesión y configuración de idioma), para que no tengas que volver a introducirlas cada vez que regresas o navegas de una página a otra.
                        </p>
                    </section>

                    {/* 2. Qué cookies usamos */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Info className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">2. Tipos de Cookies que Usamos</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <ul className="space-y-4 list-none pl-0">
                                <li className="bg-muted/30 p-4 rounded-lg border">
                                    <strong className="text-foreground block mb-1">Cookies Esenciales (Técnicas)</strong>
                                    Son estrictamente necesarias para el funcionamiento de la plataforma. Nos permiten autenticarte, prevenir fraudes y asegurar la conexión. Sin estas cookies, servicios como el inicio de sesión o la gestión de campañas no pueden funcionar.
                                </li>
                                <li className="bg-muted/30 p-4 rounded-lg border">
                                    <strong className="text-foreground block mb-1">Cookies de Funcionalidad</strong>
                                    Permiten recordar tus preferencias, como el idioma o la configuración del panel de control, para personalizar tu experiencia.
                                </li>
                                <li className="bg-muted/30 p-4 rounded-lg border">
                                    <strong className="text-foreground block mb-1">Cookies de Análisis</strong>
                                    Nos ayudan a entender cómo interactúan los usuarios con nuestra aplicación (páginas más visitadas, tiempos de carga) para mejorar el rendimiento. Utilizamos servicios como Google Analytics con IP anonimizada.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* 3. Cookies de Terceros */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">3. Cookies de Terceros</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>
                                Además de nuestras propias cookies, utilizamos servicios de terceros que pueden establecer sus propias cookies en tu dispositivo:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Proveedores de Autenticación:</strong> Auth0, Google, Facebook (para facilitar el inicio de sesión social).</li>
                                <li><strong>Redes Sociales:</strong> Cuando conectas tus cuentas (Instagram, LinkedIn, etc.), estas plataformas pueden utilizar cookies para rastrear la interacción.</li>
                                <li><strong>Pagos:</strong> Stripe o procesadores de pago para garantizar transacciones seguras.</li>
                            </ul>
                        </div>
                    </section>

                    {/* 4. Control */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Settings className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">4. Gestión de Cookies</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            La mayoría de los navegadores aceptan cookies automáticamente, pero puedes configurar tu navegador para rechazarlas o para que te avise antes de aceptarlas. Ten en cuenta que si desactivas las <strong>cookies esenciales</strong>, partes de AdVantage AI podrían dejar de funcionar correctamente.
                            <br /><br />
                            Para más información sobre cómo gestionar cookies en tu navegador, visita la sección de ayuda de tu navegador (Chrome, Firefox, Safari, Edge).
                        </p>
                    </section>

                    {/* Contacto */}
                    <section className="mt-12 pt-8 border-t">
                        <p className="text-muted-foreground text-sm">
                            Si tienes preguntas sobre nuestra política de cookies, contáctanos en:{" "}
                            <a href="mailto:phyessoft@gmail.com" className="text-primary hover:underline font-medium">
                                phyessoft@gmail.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>

            <footer className="w-full py-8 border-t bg-muted/20 text-center">
                <p className="text-sm text-muted-foreground">
                    © 2026 AdVantage AI.
                </p>
            </footer>
        </div>
    );
}
