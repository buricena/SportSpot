"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { useState } from "react";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  if (checking) {
    return <p style={{ padding: "2rem" }}>Checking authentication...</p>;
  }

  return <>{children}</>;
}
