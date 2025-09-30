import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Code, Trophy, TrendingUp, Clock, Star, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signout } from "@/lib/auth-actions";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no hay usuario, redirigir al login (doble seguridad con el middleware)
  if (!user) {
    redirect("/login");
  }

  // Obtener el perfil del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url, full_name')
    .eq('id', user.id)
    .single();

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    "Estudiante";

  const avatarUrl = profile?.avatar_url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="Aprende Code Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                Aprende Code
              </h1>
            </Link>

            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline text-sm font-medium text-slate-700">
                {displayName}
              </span>
              <form action={signout}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            ¡Bienvenido, {displayName}! 👋
          </h1>
          <p className="text-lg text-slate-600">
            Estás listo para comenzar tu viaje en Python
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Lecciones</p>
                  <p className="text-2xl font-bold text-slate-800">0/15</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Ejercicios</p>
                  <p className="text-2xl font-bold text-slate-800">0/50</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Puntos</p>
                  <p className="text-2xl font-bold text-slate-800">0</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Racha</p>
                  <p className="text-2xl font-bold text-slate-800">0 días</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Comienza tu aprendizaje
                </CardTitle>
                <CardDescription>
                  Tu primer módulo de Python te está esperando
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-4">
                  <h3 className="text-xl font-bold mb-2">Módulo 1: Introducción a Python</h3>
                  <p className="text-blue-100 mb-4">
                    Aprende los fundamentos de Python: variables, tipos de datos y operadores básicos.
                  </p>
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Clock className="w-4 h-4" />
                    <span>30 minutos</span>
                    <span className="mx-2">•</span>
                    <BookOpen className="w-4 h-4" />
                    <span>5 lecciones</span>
                  </div>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
                    Comenzar Módulo
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="font-semibold text-slate-600">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">¿Qué es Python?</p>
                        <p className="text-sm text-slate-500">5 min</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="font-semibold text-slate-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Variables y tipos de datos</p>
                        <p className="text-sm text-slate-500">8 min</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">🔒 Bloqueado</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Tu Progreso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Curso completo</span>
                      <span className="font-semibold">0%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-slate-600 mb-3">Próximos logros</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          🎯
                        </div>
                        <span className="text-slate-700">Primera lección</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          ⚡
                        </div>
                        <span className="text-slate-700">Primer ejercicio</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Enlaces Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/courses" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ver todos los módulos
                  </Button>
                </Link>
                <Link href="/lessons" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Code className="w-4 h-4 mr-2" />
                    Ejercicios prácticos
                  </Button>
                </Link>
                <Link href="/profile" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Trophy className="w-4 h-4 mr-2" />
                    Mi perfil
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-700 hover:bg-slate-50">
                    Volver al inicio
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}