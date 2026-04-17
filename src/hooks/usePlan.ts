"use client";

import { useCallback, useEffect, useState } from "react";
import { Plan, maxProperties, planKey, planLabel } from "@/lib/plan";

export function usePlan(email: string | null) {
  const [plan, setPlanState] = useState<Plan>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!email) {
      setPlanState(null);
      setReady(true);
      return;
    }
    try {
      const raw = window.localStorage.getItem(planKey(email));
      if (raw) {
        const parsed = JSON.parse(raw) as { plan: Plan };
        setPlanState(parsed.plan ?? null);
      } else {
        setPlanState(null);
      }
    } catch {
      setPlanState(null);
    }
    setReady(true);
  }, [email]);

  const setPlan = useCallback(
    (next: Plan) => {
      if (!email) return;
      setPlanState(next);
      try {
        window.localStorage.setItem(
          planKey(email),
          JSON.stringify({ plan: next })
        );
      } catch {
        /* ignore */
      }
    },
    [email]
  );

  return {
    plan,
    ready,
    setPlan,
    limit: maxProperties(plan),
    label: planLabel(plan),
  };
}
