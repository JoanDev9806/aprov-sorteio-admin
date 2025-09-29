"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLogged } from "@/services/adminAuthService";

export default function RequireAdmin({ children }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (isAdminLogged()) {
      setOk(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  if (!ok) return null; // ou um spinner
  return children;
}