/**
 * @param {string} secret
 * @param {string} message
 * @returns {Promise<string>} hex
 */
export async function hmacSha256Hex(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * @param {string} s
 * @returns {Promise<string>}
 */
export async function sha256HexUtf8(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * @param {string} a
 * @param {string} b
 */
function constantTimeEqualHex(a, b) {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

/**
 * @param {string} password
 * @param {{ ADMIN_PASSWORD_SHA256: string }} env
 */
export async function verifyAdminPassword(password, env) {
  const expected = (env.ADMIN_PASSWORD_SHA256 || "").toLowerCase().trim();
  if (!expected || typeof password !== "string") return false;
  const got = await sha256HexUtf8(password);
  return constantTimeEqualHex(got.toLowerCase(), expected);
}

const COOKIE = "artcaffe_session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * @param {Request} request
 */
export function getSessionCookie(request) {
  const raw = request.headers.get("Cookie") || "";
  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    if (p.startsWith(COOKIE + "=")) return decodeURIComponent(p.slice(COOKIE.length + 1));
  }
  return null;
}

/**
 * @param {string} value
 * @param {{ SESSION_SECRET: string }} env
 * @returns {Promise<boolean>}
 */
export async function verifySessionValue(value, env) {
  const secret = env.SESSION_SECRET;
  if (!secret || !value) return false;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return false;
  const payloadB64 = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = await hmacSha256Hex(secret, payloadB64);
  if (!constantTimeEqualHex(sig.toLowerCase(), expected.toLowerCase())) return false;
  let json;
  try {
    json = JSON.parse(atob(payloadB64));
  } catch {
    return false;
  }
  if (!json || typeof json.exp !== "number") return false;
  if (Date.now() > json.exp) return false;
  return true;
}

/**
 * @param {Request} request
 * @param {Record<string, string>} env
 */
export async function isAdminSession(request, env) {
  const v = getSessionCookie(request);
  if (!v) return false;
  return verifySessionValue(v, env);
}

/**
 * @param {Record<string, string>} env
 * @returns {Promise<string>}
 */
export async function createSessionToken(env) {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_MS, v: 1 });
  const payloadB64 = btoa(payload);
  const sig = await hmacSha256Hex(env.SESSION_SECRET, payloadB64);
  return `${payloadB64}.${sig}`;
}

/**
 * @param {Response} res
 * @param {string} token
 * @param {Request} [request]
 */
export function appendSessionCookie(res, token, request) {
  const https = !request || new URL(request.url).protocol === "https:";
  const secureFlag = https ? "Secure; " : "";
  const maxAge = Math.floor(SESSION_MS / 1000);
  res.headers.append(
    "Set-Cookie",
    `${COOKIE}=${encodeURIComponent(token)}; ${secureFlag}SameSite=Lax; HttpOnly; Path=/; Max-Age=${maxAge}`
  );
}

/**
 * @param {Response} res
 * @param {Request} [request]
 */
export function clearSessionCookie(res, request) {
  const https = !request || new URL(request.url).protocol === "https:";
  const secureFlag = https ? "Secure; " : "";
  res.headers.append(
    "Set-Cookie",
    `${COOKIE}=; ${secureFlag}SameSite=Lax; HttpOnly; Path=/; Max-Age=0`
  );
}

/** @type {Map<string, { n: number; reset: number }>} */
const loginHits = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX = 12;

/**
 * @param {string} ip
 * @returns {boolean} true if request allowed
 */
export function rateLimitLogin(ip) {
  const now = Date.now();
  let e = loginHits.get(ip);
  if (!e || now > e.reset) {
    e = { n: 0, reset: now + LOGIN_WINDOW_MS };
    loginHits.set(ip, e);
  }
  e.n += 1;
  if (e.n > LOGIN_MAX) return false;
  return true;
}

export function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
}
