"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

const UserGreetText = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return null; // O un skeleton loader si prefieres
  }

  if (user !== null) {
    const displayName = user.user_metadata.full_name || user.email?.split('@')[0] || "Usuario";

    return (
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-slate-700">
          {displayName}
        </span>
      </div>
    );
  }

  return null;
};

export default UserGreetText;