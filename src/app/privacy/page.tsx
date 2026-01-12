import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, FileText, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header Simple */}
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
                        Política de Privacidad
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Tu privacidad y la seguridad de tus datos son fundamentales para nosotros.
                        Documentamos aquí cómo recopilamos, usamos y protegemos tu información en AdVantage AI.
                    </p>
                    <div className="text-sm text-muted-foreground font-medium pt-2">
                        Última actualización: 12 de Enero de 2026
                    </div>
                </div>

                <div className="grid gap-12">
                    {/* Sección 1 */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Eye className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">1. Información que Recopilamos</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>
                                Para proporcionar nuestros servicios de automatización de marketing e inteligencia artificial, recopilamos diferentes tipos de información:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Información de Cuenta:</strong> Nombre, dirección de correo electrónico y contraseña encriptada al registrarte en nuestra plataforma.</li>
                                <li><strong>Credenciales de Redes Sociales:</strong> Tokens de acceso (OAuth) y permisos para conectar tus cuentas de Facebook, Instagram, LinkedIn u otras plataformas. <strong>No almacenamos tus contraseñas de redes sociales.</strong></li>
                                <li><strong>Datos Operativos:</strong> Prompts, configuraciones de campañas, imágenes y textos que cargas o generas a través de nuestra IA.</li>
                                <li><strong>Datos de Uso:</strong> Información técnica sobre cómo interactúas con nuestra aplicación para mejorar el rendimiento y la experiencia de usuario.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Sección 2 */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Server className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">2. Uso de la Información</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>
                                Utilizamos tu información exclusivamente para operar y mejorar AdVantage AI:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Prestación del Servicio:</strong> Publicar contenido automáticamente, programar posts y gestionar tus campañas de marketing según tus instrucciones.</li>
                                <li><strong>Inteligencia Artificial:</strong> Procesar tus prompts y datos contextuales a través de nuestros modelos de IA para generar sugerencias de contenido, copias y estrategias.</li>
                                <li><strong>Análisis y Mejora:</strong> Entender cómo se usa nuestra plataforma para corregir errores, optimizar flujos de trabajo y desarrollar nuevas funcionalidades.</li>
                                <li><strong>Comunicación:</strong> Enviarte notificaciones importantes sobre el estado de tus campañas, actualizaciones de seguridad o cambios en nuestros términos.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Sección 3 */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">3. Compartición con Terceros</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>
                                No vendemos tus datos personales. Compartimos información solo con proveedores de servicios esenciales para la funcionalidad de la App:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Proveedores de IA:</strong> Enviamos datos de prompts y contexto a proveedores como OpenAI, Anthropic o Groq para generar el contenido. Estos datos no se utilizan para entrenar sus modelos públicos.</li>
                                <li><strong>Plataformas Sociales:</strong> Interactuamos con las APIs de Meta (Facebook/Instagram), LinkedIn, X, etc., para publicar contenido en tu nombre. Esta interacción está sujeta a las políticas de privacidad de cada plataforma.</li>
                                <li><strong>Infraestructura:</strong> Utilizamos servicios de nube seguros (ej. AWS, Vercel, Supabase) para alojar nuestra base de datos y ejecutar la aplicación.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Sección 4 */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Lock className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">4. Seguridad de Datos</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Implementamos medidas de seguridad robustas para proteger tu información. Utilizamos cifrado en tránsito (HTTPS/TLS) para todas las comunicaciones y cifrado en reposo para datos sensibles (como tokens de acceso) en nuestras bases de datos. El acceso a los datos está estrictamente limitado al personal autorizado y necesario para el mantenimiento del sistema.
                        </p>
                    </section>

                    {/* Sección 5 */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">5. Tus Derechos</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Tienes derecho a acceder, corregir, exportar y eliminar tus datos personales en cualquier momento. Puedes gestionar tu cuenta desde la configuración de perfil. Si deseas eliminar completamente tu cuenta y todos los datos asociados, puedes solicitarlo a través de nuestro soporte o utilizar la opción de "Eliminar Cuenta" en el panel de control.
                        </p>
                    </section>

                    {/* Contacto */}
                    <section className="mt-12 pt-8 border-t">
                        <h3 className="text-xl font-bold mb-4">¿Tienes dudas?</h3>
                        <p className="text-muted-foreground">
                            Si tienes preguntas sobre esta política o el manejo de tus datos, contáctanos en:{" "}
                            <a href="mailto:privacy@advantage-ai.com" className="text-primary hover:underline font-medium">
                                phyessoft@gmail.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>

            <footer className="w-full py-8 border-t bg-muted/20 text-center">
                <p className="text-sm text-muted-foreground">
                    © 2026 AdVantage AI. La seguridad y confianza son nuestra prioridad.
                </p>
            </footer>
        </div>
    );
}
