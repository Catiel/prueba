import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/src/presentation/actions/profile.actions";
import { getAllCourses } from "@/src/presentation/actions/course.actions";
import { signout } from "@/src/presentation/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, BookOpen, Clock, CheckCircle2, Calendar, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function StudentDashboardPage() {
  const profileResult = await getCurrentProfile();

  if ('error' in profileResult) {
    redirect("/login");
  }

  const { profile } = profileResult;

  if (!profile.isStudent) {
    redirect("/dashboard");
  }

  // Obtener todos los cursos
  const coursesResult = await getAllCourses();
  const allCourses = 'error' in coursesResult ? [] : coursesResult.courses || [];

  // Filtrar cursos activos y próximos (los estudiantes ven estos)
  const activeCourses = allCourses.filter(c => c.status === 'active');
  const upcomingCourses = allCourses.filter(c => c.status === 'upcoming');
  const visibleCourses = [...activeCourses, ...upcomingCourses];

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3"
            >
              <div className="relative h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10">
                <Image
                  src="/logo.png"
                  alt="Aprende Code Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="truncate text-lg font-bold text-slate-800 sm:text-xl md:text-2xl">
                Aprende Code
              </h1>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden text-xs font-medium text-blue-600 sm:inline sm:text-sm">
                👨‍🎓 Estudiante
              </span>
              {profile.avatarUrl ? (
                <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full sm:h-10 sm:w-10">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white sm:h-10 sm:w-10 sm:text-sm">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden max-w-[120px] truncate text-xs font-medium text-slate-700 sm:text-sm md:inline lg:max-w-none">
                {profile.displayName}
              </span>
              <form action={signout}>
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  className="bg-transparent text-xs sm:text-sm"
                >
                  <LogOut className="h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-2 text-balance text-2xl font-bold text-slate-800 sm:mb-3 sm:text-3xl md:text-4xl">
            Mi Panel de Estudiante
          </h1>
          <p className="text-pretty text-sm text-slate-600 sm:text-base">
            Bienvenido, {profile.displayName}. Accede a tus cursos y continúa aprendiendo
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-3">
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <BookOpen className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                Cursos Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600 sm:text-3xl">{visibleCourses.length}</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <CheckCircle2 className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
                Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600 sm:text-3xl">{activeCourses.length}</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Clock className="h-4 w-4 text-orange-600 sm:h-5 sm:w-5" />
                Próximos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600 sm:text-3xl">{upcomingCourses.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-4 text-xl font-bold text-slate-800 sm:text-2xl">
            Cursos Disponibles
          </h2>

          {visibleCourses.length === 0 ? (
            <Card className="border-2">
              <CardContent className="p-8 text-center">
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8">
                  <BookOpen className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                  <h3 className="mb-2 text-lg font-semibold text-slate-800">
                    No hay cursos disponibles actualmente
                  </h3>
                  <p className="text-sm text-slate-600">
                    Los cursos aparecerán aquí cuando el administrador los active
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {visibleCourses.map((course) => (
                <Card key={course.id} className="border-2 transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="mb-2 text-xl">{course.title}</CardTitle>
                        {course.status === 'active' ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Activo - Disponible Ahora
                          </Badge>
                        ) : course.status === 'upcoming' ? (
                          <Badge className="bg-orange-100 text-orange-700">
                            <Clock className="mr-1 h-3 w-3" />
                            Próximamente
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-slate-300 text-slate-600">
                            <XCircle className="mr-1 h-3 w-3" />
                            Finalizado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-slate-600">{course.description}</p>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-start gap-2 rounded-lg border bg-slate-50 p-3">
                        <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                        <div>
                          <p className="text-xs text-slate-600">Inicio</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {formatDate(course.startDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-lg border bg-slate-50 p-3">
                        <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                        <div>
                          <p className="text-xs text-slate-600">Fin</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {formatDate(course.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {course.status === 'active' && course.daysRemaining > 0 && (
                      <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                        <strong>⏳ {course.daysRemaining} días restantes</strong> para completar
                      </div>
                    )}

                    {course.status === 'upcoming' && course.daysUntilStart > 0 && (
                      <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
                        <strong>⏰ Comienza en {course.daysUntilStart} días</strong>
                      </div>
                    )}

                    <div className="mt-4">
                      {course.status === 'active' ? (
                        <Link href={`/courses/${course.id}`} className="block">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Ir al Curso
                          </Button>
                        </Link>
                      ) : (
                        <Button className="w-full" variant="outline" disabled>
                          <Clock className="mr-2 h-4 w-4" />
                          Próximamente
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        {visibleCourses.length > 0 && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-blue-900">
                    Acceso a Cursos
                  </h4>
                  <p className="text-xs text-blue-700">
                    Puedes acceder a todos los cursos activos y ver el contenido publicado por tus docentes.
                    Los cursos próximos estarán disponibles en sus fechas de inicio correspondientes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
