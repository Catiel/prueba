"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LogOut, User } from "lucide-react";

const LoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    fetchUser();

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Si se cerró sesión, redirigir a home
      if (!session?.user && _event === 'SIGNED_OUT') {
        router.push("/");
        router.refresh();
      }

      // Si se inició sesión, actualizar
      if (session?.user && _event === 'SIGNED_IN') {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    setIsLoading(true);
    const supabase = createClient();

    // Hacer logout directamente desde el cliente
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      setIsLoading(false);
      return;
    }

    setUser(null);
    setIsLoading(false);

    // Redirigir a home
    router.push("/");
    router.refresh();
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-full sm:w-auto">
        <span className="hidden sm:inline">Cargando...</span>
        <span className="sm:hidden">...</span>
      </Button>
    );
  }

  if (user) {
    return (
      <Button
        onClick={handleSignOut}
        variant="outline"
        disabled={isLoading}
        className="w-full sm:w-auto gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">
          {isLoading ? "Cerrando..." : "Cerrar sesión"}
        </span>
        <span className="sm:hidden">{isLoading ? "..." : "Salir"}</span>
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      onClick={() => {
        router.push("/login");
      }}
      className="w-full sm:w-auto gap-2 bg-sky-600 hover:bg-sky-700"
    >
      <User className="w-4 h-4" />
      <span className="hidden sm:inline">Iniciar sesión</span>
      <span className="sm:hidden">Login</span>
    </Button>
  );
};

export default LoginButton;