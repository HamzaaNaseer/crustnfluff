// Minimal signed-cookie session for the single shared admin password.
// No user accounts/DB needed — just prove possession of ADMIN_SESSION_SECRET.

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Buffer.from(sig).toString("hex");
}

export async function createSessionToken() {
  const expires = Date.now() + SESSION_TTL_MS;
  const sig = await hmac(String(expires));
  return `${expires}.${sig}`;
}

export async function isValidSessionToken(token: string | undefined | null) {
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig) return false;
  if (Date.now() > Number(expires)) return false;
  const expected = await hmac(expires);
  return expected === sig;
}

export { SESSION_COOKIE, SESSION_TTL_MS };
