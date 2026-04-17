export type User = { email: string; passwordHash: string };
export type Session = { email: string };

const USERS_KEY = "locpilote:users";
const SESSION_KEY = "locpilote:session";

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function listUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function createUser(
  email: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return { ok: false, error: "Email invalide." };
  if (password.length < 6)
    return { ok: false, error: "Le mot de passe doit faire au moins 6 caractères." };
  const users = listUsers();
  if (users.some((u) => u.email === normalized))
    return { ok: false, error: "Un compte existe déjà avec cet email." };
  const passwordHash = await hashPassword(password);
  users.push({ email: normalized, passwordHash });
  saveUsers(users);
  return { ok: true };
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  const user = listUsers().find((u) => u.email === normalized);
  if (!user) return { ok: false, error: "Aucun compte trouvé avec cet email." };
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash)
    return { ok: false, error: "Mot de passe incorrect." };
  return { ok: true };
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(email: string): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}
