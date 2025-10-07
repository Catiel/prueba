"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LogOut, User } from "lucide-react";

const LoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
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
      console.log("Auth state changed:", _event, session?.user);
      setUser(session?.user ?? null);
      setIsLoading(false);
      setIsSigningOut(false); // Reset signing out state

      // Si se cerró sesión, refrescar
      if (!session?.user && _event === 'SIGNED_OUT') {
        router.refresh();
      }

      // Si se inició sesión, refrescar
      if (session?.user && _event === 'SIGNED_IN') {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();

    try {
      // Hacer logout directamente desde el cliente
      await supabase.auth.signOut();

      // El listener se encargará de actualizar el estado
      // Pero por si acaso, lo actualizamos manualmente también
      setTimeout(() => {
        setUser(null);
        setIsSigningOut(false);
        router.push("/");
        router.refresh();
      }, 100);

    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false);
    }
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
        disabled={isSigningOut}
        className="w-full sm:w-auto gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">
          {isSigningOut ? "Cerrando..." : "Cerrar sesión"}
        </span>
        <span className="sm:hidden">{isSigningOut ? "..." : "Salir"}</span>
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