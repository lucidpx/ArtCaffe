import { clearSessionCookie } from "../../_lib/auth.js";

/**
 * @param {{ request: Request }} context
 */
export async function onRequestPost(context) {
  const res = Response.json({ ok: true });
  clearSessionCookie(res, context.request);
  return res;
}
