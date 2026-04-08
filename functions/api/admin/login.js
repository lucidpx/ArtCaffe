import {
  appendSessionCookie,
  clientIp,
  createSessionToken,
  rateLimitLogin,
  verifyAdminPassword,
} from "../../_lib/auth.js";

/**
 * @param {{ request: Request; env: Record<string, string> }} context
 */
export async function onRequestPost(context) {
  const { request, env } = context;
  const ip = clientIp(request);
  if (!rateLimitLogin(ip)) {
    return Response.json({ error: "Previše pokušaja. Sačekajte malo." }, { status: 429 });
  }

  if (!env.SESSION_SECRET) {
    return Response.json({ error: "Server nije konfigurisan (SESSION_SECRET)." }, { status: 500 });
  }
  if (!env.ADMIN_PASSWORD_SHA256) {
    return Response.json({ error: "Server nije konfigurisan (ADMIN_PASSWORD_SHA256)." }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Neispravan JSON." }, { status: 400 });
  }

  const password = body && typeof body.password === "string" ? body.password : "";
  const ok = await verifyAdminPassword(password, env);
  if (!ok) {
    return Response.json({ error: "Pogrešna lozinka." }, { status: 401 });
  }

  const token = await createSessionToken(env);
  const res = Response.json({ ok: true });
  appendSessionCookie(res, token, request);
  return res;
}
