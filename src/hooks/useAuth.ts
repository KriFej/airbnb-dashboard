"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearSession,
  createUser,
  getSession,
  setSession,
  verifyCredentials,
} from "@/lib/auth";

export function useAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    setEmail(s?.email ?? null);
    setReady(true);
  }, []);

  const signup = useCallback(async (mail: string, password: string) => {
    const res = await createUser(mail, password);
    return res;
  }, []);

  const login = useCallback(async (mail: string, password: string) => {
    const res = await verifyCredentials(mail, password);
    if (res.ok) {
      setSession(mail.trim().toLowerCase());
      setEmail(mail.trim().toLowerCase());
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setEmail(null);
  }, []);

  return { email, ready, signup, login, logout };
}
