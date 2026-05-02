"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Plan, maxProperties, planKey, planLabel } from "@/lib/plan";

type SubRow = {
  plan: Plan;
  status: string;
};

function readLocalPlan(email: string): Plan {
  try {
    const raw = window.localStorage.getItem(planKey(email));
    if (raw) {
      const parsed = JSON.parse(raw) as { plan: Plan };
      return parsed.plan ?? null;
    }
  } catch {}
  return null;
}

export function usePlan(email: string | null, userId: string | null = null) {
  const [plan, setPlanState] = useState<Plan>(null);
  const [ready, setReady] = useState(false);

  const supabase = useMemo<SupabaseClient | null>(() => {
    if (typeof window === "undefined") return null;
    return createClient();
  }, []);

  useEffect(() => {
    if (!email) {
      setPlanState(null);
      setReady(true);
      return;
    }

    // Affiche le cache local immédiatement
    const cached = readLocalPlan(email);
    if (cached) setPlanState(cached);

    if (!userId || !supabase) {
      setReady(true);
      return;
    }

    let cancelled = false;
    supabase
      .from("subscriptions")
      .select("plan,status")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          // Table absente ou pas de ligne → garde le cache local
          setReady(true);
          return;
        }
        const row = data as SubRow;
        const activePlan: Plan =
          row.status === "active" && row.plan ? row.plan : null;

        setPlanState(activePlan);
        try {
          window.localStorage.setItem(
            planKey(email),
            JSON.stringify({ plan: activePlan }),
          );
        } catch {}
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [email, userId, supabase]);

  const setPlan = useCallback(
    (next: Plan) => {
      if (!email) return;
      setPlanState(next);
      try {
        window.localStorage.setItem(
          planKey(email),
          JSON.stringify({ plan: next }),
        );
      } catch {}
    },
    [email],
  );

  return {
    plan,
    ready,
    setPlan,
    limit: maxProperties(plan),
    label: planLabel(plan),
  };
}
