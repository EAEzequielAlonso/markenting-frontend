"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  BarChart3,
  Layers,
  Sparkles,
  MessageCircle,
  TrendingUp,
  Cpu,
  LayoutDashboard
} from "lucide-react";
import { integrations } from "@/lib/integrations-data";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30">
      {/* 1️⃣ HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md px-6 h-16 flex items-center">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-sm">
            <Image src="/logo.jpeg" alt="AdVantage AI Logo" fill className="object-cover" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            AdVantage AI
          </span>
        </div>
        <nav className="ml-auto hidden md:flex gap-8">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#que-es">
            ¿Qué es?
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#automatizacion">
            Automatización
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#integraciones">
            Integraciones
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#precios">
            Precios
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="sm" className="shadow-lg shadow-primary/20 flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Ir al Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex">Ingresar</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="shadow-lg shadow-primary/20">Probar gratis 7 días</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* 2️⃣ HERO SECTION */}
        <section className="relative w-full py-20 lg:py-32 overflow-hidden border-b">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-500 rounded-full blur-[120px]"></div>
          </div>

          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase border border-primary/20 animate-pulse">
                <Zap className="h-3 w-3" /> Marketing 24/7 con Inteligencia Artificial
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Tu agencia de marketing <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/80">
                  trabajando las 24 horas
                </span>
              </h1>
              <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed font-medium">
                Sin agencias costosas. Sin complicaciones. Nuestra IA crea contenido, gestiona campañas y optimiza tus resultados en todos los canales mientras vos te enfocas en crecer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                {isLoggedIn ? (
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button size="lg" className="h-14 px-10 text-lg font-bold w-full rounded-full shadow-xl shadow-primary/25 flex items-center justify-center gap-2">
                      <LayoutDashboard className="h-5 w-5" />
                      Ir al Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/register" className="w-full sm:w-auto">
                      <Button size="lg" className="h-14 px-10 text-lg font-bold w-full rounded-full shadow-xl shadow-primary/25">
                        Probar gratis 7 días
                      </Button>
                    </Link>
                    <Link href="#que-es" className="w-full sm:w-auto">
                      <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold w-full rounded-full border-2">
                        Ver cómo funciona
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-muted-foreground font-medium italic">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Sin tarjeta de crédito</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Sin contratos</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Cancelá cuando quieras</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ QUÉ ES EL SISTEMA */}
        <section id="que-es" className="w-full py-20 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                  ¿Por qué seguir con una agencia <br />
                  <span className="text-primary italic">tradicional?</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  AdVantage AI no solo es una herramienta, es tu nuevo equipo de marketing digital. Eliminamos la fricción de la comunicación, los tiempos de espera y los costos exorbitantes.
                </p>
                <div className="space-y-4 pt-4">
                  {[
                    { title: "Resultados Inmediatos", desc: "La IA toma decisiones basadas en datos en milisegundos." },
                    { title: "Ahorro de Tiempo", desc: "Automatiza el 90% de tus tareas de marketing diarias." },
                    { title: "Simplicidad Total", desc: "Diseñado para emprendedores, no para técnicos." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-video rounded-3xl overflow-hidden border-8 border-background shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-center p-8 bg-background/60 backdrop-blur-xl rounded-2xl border border-white/20 max-w-sm">
                    <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Crecimiento Asegurado</h3>
                    <p className="text-sm text-muted-foreground">Nuestro algoritmo optimiza cada centavo de tu inversión publicitaria.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ AUTOMATIZACIÓN POR IA */}
        <section id="automatizacion" className="w-full py-20 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Poderosa <span className="text-primary">Automatización</span></h2>
              <p className="text-muted-foreground max-w-[700px] text-lg">
                Nuestros agentes de IA están entrenados específicamente para el éxito en marketing digital.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Layers, title: "Creación de Contenido", desc: "Genera piezas visuales y textos persuasivos optimizados para cada plataforma." },
                { icon: Target, title: "Optimización de Campañas", desc: "Ajusta pujas y audiencias en tiempo real para maximizar el ROI." },
                { icon: MessageCircle, title: "Respuestas Inteligentes", desc: "Atención al cliente 24/7 que aprende de tu negocio para cerrar ventas." },
                { icon: BarChart3, title: "Análisis Predictivo", desc: "Detecta qué funciona antes de que gastes tu presupuesto." }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-background border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 flex flex-col md:flex-row items-center gap-8">
              <div className="flex items-center gap-4 bg-background p-4 rounded-2xl shadow-sm border">
                <Cpu className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="font-bold">IA en evolución</h4>
                  <p className="text-xs text-muted-foreground">Optimización continua basada en datos</p>
                </div>
              </div>
              <p className="text-muted-foreground font-medium">
                <span className="text-foreground font-bold">Uso de Créditos de IA:</span> Los créditos se consumen solo cuando el sistema genera valor real para tu marca, como crear un post o responder a un cliente.
              </p>
            </div>
          </div>
        </section>

        {/* 5️⃣ INTEGRACIONES */}
        <section id="integraciones" className="w-full py-20 lg:py-32 bg-muted/30 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Presencia <span className="text-primary">Omnicanal</span> Relevante</h2>
              <p className="text-muted-foreground max-w-[700px] text-lg">
                Conectá tu negocio con las plataformas líderes y dejá que nuestra IA gestione todo profesionalmente.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {integrations.map((item, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-background border hover:shadow-md transition-all flex flex-col items-start gap-4">
                  <div className="p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                    <item.icon className="h-6 w-6" style={{ color: item.color }} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6️⃣ BENEFICIOS */}
        <section className="w-full py-20 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: "24/7", value: "Sin descansos" },
                    { title: "Flexibilidad", value: "Sin contratos" },
                    { title: "Dashboard", value: "Control total" },
                    { title: "Escalable", value: "Crecé sin límites" }
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-muted/50 border flex flex-col gap-1">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.title}</span>
                      <span className="text-xl font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-6 -right-6 p-6 bg-primary rounded-3xl text-primary-foreground shadow-2xl hidden md:block">
                  <h4 className="text-2xl font-bold">90%</h4>
                  <p className="text-sm font-medium opacity-90">Más económico que una agencia</p>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">La ventaja competitiva que <br /><span className="text-primary">tu negocio necesita</span></h2>
                <div className="space-y-4">
                  {[
                    "No necesitás conocimientos técnicos ni de diseño.",
                    "Control total centralizado desde un solo panel inteligente.",
                    "Inversión inteligente: pagá por resultados, no por horas.",
                    "Multi-canal real sincronizado automáticamente."
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-lg text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-6">
                  <Link href="/auth/register">
                    <Button variant="link" className="text-primary font-bold text-lg p-0 h-auto flex items-center gap-2 group">
                      Empezar ahora <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7️⃣ PLANES Y PRECIOS */}
        <section id="precios" className="w-full py-20 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Elegí el plan perfecto</h2>
              <p className="text-muted-foreground max-w-[700px] text-lg">
                Simple, transparente y diseñado para escalar con vos. <br />
                <span className="text-sm font-semibold text-primary">Precios en USD. Se cobra en pesos argentinos al cambio del día.</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
              {/* PLAN TRIAL */}
              <div className="flex flex-col p-8 bg-background border rounded-3xl shadow-sm hover:border-primary transition-colors">
                <div className="space-y-2 mb-6">
                  <h3 className="font-bold text-lg uppercase tracking-wider text-muted-foreground">🧪 PLAN TRIAL</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">$0</span>
                    <span className="text-sm text-muted-foreground">Gratis (7 días)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Ideal para probar la IA.</p>
                </div>
                <div className="space-y-3 flex-1 mb-8">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>1 Campaña orgánica</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Hasta 9 Posts totales</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Cómplice de copies por IA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium opacity-50">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="line-through">Ads no incluidos</span>
                  </div>
                </div>
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-bold">Probar gratis</Button>
                </Link>
              </div>

              {/* PLAN PRO */}
              <div className="flex flex-col p-8 bg-background border-2 border-primary rounded-3xl shadow-xl relative scale-105 z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest">
                  Más Popular
                </div>
                <div className="space-y-2 mb-6">
                  <h3 className="font-bold text-lg uppercase tracking-wider text-primary">🚀 PLAN PRO</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">$20</span>
                    <span className="text-sm text-muted-foreground">/ mes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Para emprendedores y comercios locales.</p>
                </div>
                <div className="space-y-3 flex-1 mb-8">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>4 Campañas (Orgánico + Ads)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Hasta 12 Posts por campaña</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>1 Regeneración por post</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>10 Ediciones IA por mes</span>
                  </div>
                </div>
                <Link href="/auth/register">
                  <Button className="w-full h-12 rounded-xl shadow-lg bg-primary font-bold">Obtener Pro</Button>
                </Link>
              </div>

              {/* PLAN BUSINESS */}
              <div className="flex flex-col p-8 bg-background border rounded-3xl shadow-sm hover:border-primary transition-colors">
                <div className="space-y-2 mb-6">
                  <h3 className="font-bold text-lg uppercase tracking-wider text-muted-foreground">🏢 PLAN BUSINESS</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">$60</span>
                    <span className="text-sm text-muted-foreground">/ mes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Para negocios consolidados y agencias.</p>
                </div>
                <div className="space-y-3 flex-1 mb-8">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>12 Campañas (Orgánico + Ads)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Hasta 15 Posts por campaña</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>2 Regeneraciones por post</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>50 Ediciones IA por mes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Chat IA libre (con límites)</span>
                  </div>
                </div>
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-bold">Obtener Business</Button>
                </Link>
              </div>
            </div>

            <div className="mt-12 flex items-center justify-center p-6 bg-background/50 rounded-2xl border border-dashed border-primary/40 max-w-3xl mx-auto">
              <p className="text-sm text-center text-muted-foreground italic">
                <strong className="text-foreground">Regla general:</strong> Los límites aplican al total del sistema (orgánico + ads). La IA está incluida en todos los planes pagos con límites claros por cantidad de posts.
              </p>
            </div>
          </div>
        </section>

        {/* 8️⃣ TESTIMONIOS */}
        <section className="w-full py-20 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Historias de <span className="text-primary">éxito</span> real</h2>
              <p className="text-muted-foreground max-w-[700px] text-lg">
                Empresas que ya transformaron su marketing con nuestra IA.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Carlos Ruiz", role: "Dueño de Café Local", text: "Antes no tenía tiempo para publicar nada. Ahora, la IA gestiona todo mi Instagram y he triplicado mis clientes en 2 meses.", avatar: "CR" },
                { name: "Elena Gómez", role: "Fundadora de EcoModa", text: "Me ahorré el sueldo de una agencia y los resultados en Facebook Ads son mucho mejores. La plataforma es hiper simple.", avatar: "EG" },
                { name: "Marcos Sosa", role: "Freelance IT", text: "Uso el plan Pro para mi marca personal. Las automatizaciones en LinkedIn me consiguen leads todas las semanas.", avatar: "MS" }
              ].map((testimony, i) => (
                <div key={i} className="p-8 rounded-3xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all flex flex-col gap-6">
                  <p className="text-lg italic text-muted-foreground flex-1">"{testimony.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {testimony.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{testimony.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimony.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-20 text-center">
              <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase mb-8">Empresas que confían en nosotros</p>
              <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale contrast-125">
                <div className="text-2xl font-black italic">TECHFLOW</div>
                <div className="text-2xl font-black italic">GLOVEX</div>
                <div className="text-2xl font-black italic">UPSTRIDE</div>
                <div className="text-2xl font-black italic">LUMINA</div>
              </div>
            </div>
          </div>
        </section>

        {/* 9️⃣ CTA FINAL */}
        <section className="w-full py-24 lg:py-40 relative overflow-hidden bg-primary">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-purple-700 -z-10 opacity-90"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
                ¿Estás listo para dejar de preocuparte <br /> por el marketing?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                Unite a cientos de emprendedores que ya están escalando sus negocios mientras duermen.
              </p>
              <div className="flex flex-col items-center gap-6">
                <Link href="/auth/register">
                  <Button size="lg" className="h-16 px-12 text-xl font-bold rounded-full bg-slate-950 text-white hover:bg-slate-900 shadow-2xl transition-all hover:scale-105 border-0">
                    Probar gratis 7 días
                  </Button>
                </Link>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold uppercase tracking-widest text-white/80">
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Sin tarjeta</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Sin compromiso</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Configuración en 2 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 🔟 FOOTER */}
      <footer className="w-full py-12 px-6 border-t bg-background">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
              <div className="relative h-8 w-8 rounded-lg overflow-hidden grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image src="/logo.jpeg" alt="AdVantage AI" fill className="object-cover" />
              </div>
              <span>AdVantage AI</span>
            </div>
            <p className="text-muted-foreground max-w-xs leading-relaxed">
              La primera agencia de marketing automatizada 24/7 impulsada por inteligencia artificial para emprendedores y pymes.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Producto</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#automatizacion" className="text-sm text-muted-foreground hover:text-primary">Funciones</Link>
              <Link href="#integraciones" className="text-sm text-muted-foreground hover:text-primary">Integraciones</Link>
              <Link href="#precios" className="text-sm text-muted-foreground hover:text-primary">Precios</Link>
              <Link href="/roadmap" className="text-sm text-muted-foreground hover:text-primary">Roadmap</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Legales</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacidad</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Términos</Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">Cookies</Link>
            </nav>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 AdVantage AI. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <div className="h-4 w-4 bg-muted-foreground rounded-full"></div>
            <div className="h-4 w-4 bg-muted-foreground rounded-full"></div>
            <div className="h-4 w-4 bg-muted-foreground rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const Target = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
