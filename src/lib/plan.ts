export type Plan = "starter" | "pro" | "unlimited" | null;

export const LIMITS: Record<NonNullable<Plan>, number> = {
  starter: 3,
  pro: 10,
  unlimited: Infinity,
};

export const PLAN_LABELS: Record<NonNullable<Plan>, string> = {
  starter: "Starter",
  pro: "Pro",
  unlimited: "Unlimited",
};

export function planLabel(plan: Plan): string {
  if (!plan) return "Gratuit";
  return `Offre ${PLAN_LABELS[plan]}`;
}

export function maxProperties(plan: Plan): number {
  if (!plan) return 1; // tier gratuit = 1 bien
  return LIMITS[plan];
}

export function canAddProperty(plan: Plan, currentCount: number): boolean {
  return currentCount < maxProperties(plan);
}

export function canUseICal(plan: Plan): boolean {
  return true;
}

export function isValidPlan(value: string | null): value is NonNullable<Plan> {
  return value === "starter" || value === "pro" || value === "unlimited";
}

export function planKey(email: string): string {
  return `locpilote:plan:${email}`;
}

export function propertiesKey(email: string): string {
  return `locpilote:properties:${email}`;
}
