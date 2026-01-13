import Link from "next/link";
import { ArrowLeft, FileText, Scale, ShieldAlert, CreditCard, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
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
                <div className="space-y-4 mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Términos y Condiciones
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Por favor, lee detenidamente estos términos antes de utilizar los servicios de AdVantage AI.
                        Al acceder a nuestra plataforma, aceptas estar legalmente vinculado a estas condiciones.
                    </p>
                    <div className="text-sm text-muted-foreground font-medium pt-2">
                        Última actualización: 13 de Enero de 2026
                    </div>
                </div>

                <div className="grid gap-12">
                    {/* 1. Aceptación */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Scale className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">1. Aceptación de los Términos</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>
                                Estos Términos de Servicio ("Términos") rigen el acceso y uso de la plataforma AdVantage AI ("Servicio"), operada por Phyessoft ("Nosotros", "La Compañía"). Al registrarse, acceder o utilizar nuestros servicios, usted ("El Usuario") confirma que ha leído, entendido y acepta estos Términos en su totalidad. Si no está de acuerdo con alguna parte, no debe utilizar el servicio.
                            </p>
                        </div>
                    </section>

                    {/* 2. Descripción del Servicio e IA */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <RefreshCw className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">2. Servicios y Contenido Generado por IA</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>
                                AdVantage AI proporciona herramientas de automatización de marketing impulsadas por Inteligencia Artificial (IA).
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Generación de Contenido:</strong> El Usuario reconoce que el contenido generado por nuestra IA (textos, imágenes, estrategias) es una sugerencia automatizada. AdVantage AI no garantiza la exactitud, originalidad o idoneidad legal de dicho contenido para fines específicos.</li>
                                <li><strong>Responsabilidad Editorial:</strong> Es responsabilidad exclusiva del Usuario revisar, editar y aprobar cualquier contenido antes de su publicación. La Compañía no se hace responsable por errores, alucinaciones de la IA o contenido inapropiado que sea publicado sin la debida supervisión del Usuario.</li>
                                <li><strong>Disponibilidad:</strong> Nos esforzamos por mantener el servicio disponible 24/7, pero no garantizamos un tiempo de actividad ininterrumpido debido a mantenimientos o fallos de terceros (ej. caídas de APIs de redes sociales).</li>
                            </ul>
                        </div>
                    </section>

                    {/* 3. Cuentas y Seguridad */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">3. Cuentas y Seguridad</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Usted es responsable de mantener la confidencialidad de sus credenciales de acceso. Cualquier actividad realizada desde su cuenta será considerada su responsabilidad. Debe notificarnos inmediatamente sobre cualquier uso no autorizado. AdVantage AI se reserva el derecho de suspender cuentas que violen estos términos o realicen actividades sospechosas.
                        </p>
                    </section>

                    {/* 4. Suscripciones y Pagos */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">4. Suscripciones y Pagos</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Planes:</strong> El servicio se ofrece bajo modelos de suscripción (Free, Pro, Business). Las características y límites de cada plan se detallan en nuestra página de precios.</li>
                                <li><strong>Pagos:</strong> Los pagos son procesados por terceros seguros (ej. Stripe/MercadoPago). Al suscribirse, autoriza el cobro recurrente según el período seleccionado.</li>
                                <li><strong>Cancelación:</strong> Puede cancelar su suscripción en cualquier momento. La cancelación se hará efectiva al finalizar el período de facturación actual. No ofrecemos reembolsos por períodos parciales no utilizados, salvo que la ley local exija lo contrario.</li>
                            </ul>
                        </div>
                    </section>

                    {/* 5. Propiedad Intelectual */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">5. Propiedad Intelectual</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            <strong>De la Plataforma:</strong> Todo el software, diseño, código y tecnología de AdVantage AI son propiedad exclusiva de Phyessoft.
                            <br /><br />
                            <strong>Del Usuario:</strong> Usted conserva todos los derechos sobre el contenido, datos y materiales que cargue en la plataforma ("Contenido del Usuario"). Al usar el servicio, nos otorga una licencia mundial y libre de regalías para alojar, usar y procesar dicho contenido únicamente con el fin de prestarle el servicio.
                        </p>
                    </section>

                    {/* 6. Limitación de Responsabilidad */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">6. Limitación de Responsabilidad</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            En la máxima medida permitida por la ley, AdVantage AI no será responsable por daños indirectos, incidentales, especiales o consecuentes (incluyendo pérdida de beneficios o datos) derivados del uso o la imposibilidad de uso del servicio. Nuestra responsabilidad total por cualquier reclamo relacionado con el servicio no excederá la cantidad pagada por usted en los últimos 12 meses.
                        </p>
                    </section>

                    {/* 7. Contacto */}
                    <section className="mt-12 pt-8 border-t">
                        <h3 className="text-xl font-bold mb-4">Contacto Legal</h3>
                        <p className="text-muted-foreground">
                            Para notificaciones legales o preguntas sobre estos términos, por favor contáctenos en:{" "}
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
