import { isAdminSession } from "../../_lib/auth.js";
import { readMenuItems, writeMenuItems, nextId } from "../../_lib/menu.js";

/**
 * @param {Request} request
 * @param {Record<string, string>} env
 */
async function requireAdmin(request, env) {
  const ok = await isAdminSession(request, env);
  if (!ok) return Response.json({ error: "Niste prijavljeni." }, { status: 401 });
  return null;
}

/**
 * @param {unknown} x
 */
function isValidItem(x) {
  if (!x || typeof x !== "object") return false;
  const o = /** @type {Record<string, unknown>} */ (x);
  return (
    typeof o.name === "string" &&
    o.name.trim().length > 0 &&
    typeof o.category === "string" &&
    o.category.trim().length > 0 &&
    typeof o.price === "number" &&
    Number.isFinite(o.price) &&
    o.price >= 0 &&
    (o.description === undefined || typeof o.description === "string")
  );
}

/**
 * @param {{ request: Request; env: { MENU_KV?: KVNamespace } & Record<string, string> }} context
 */
export async function onRequestGet(context) {
  const denied = await requireAdmin(context.request, context.env);
  if (denied) return denied;
  const items = await readMenuItems(context.env.MENU_KV);
  return Response.json({ items });
}

/**
 * @param {{ request: Request; env: { MENU_KV?: KVNamespace } & Record<string, string> }} context
 */
export async function onRequestPost(context) {
  const denied = await requireAdmin(context.request, context.env);
  if (denied) return denied;
  const kv = context.env.MENU_KV;
  if (!kv) return Response.json({ error: "KV nije povezan." }, { status: 500 });

  let body;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: "Neispravan JSON." }, { status: 400 });
  }

  if (!isValidItem(body)) {
    return Response.json({ error: "Nedostaju ili su neispravna polja (naziv, kategorija, cena)." }, { status: 400 });
  }

  const items = await readMenuItems(kv);
  const id = nextId(items);
  const item = {
    id,
    category: String(body.category).trim(),
    name: String(body.name).trim(),
    description: body.description != null ? String(body.description).trim() : "",
    price: Number(body.price),
  };
  items.push(item);
  await writeMenuItems(kv, items);
  return Response.json({ ok: true, item });
}

/**
 * @param {{ request: Request; env: { MENU_KV?: KVNamespace } & Record<string, string> }} context
 */
export async function onRequestPut(context) {
  const denied = await requireAdmin(context.request, context.env);
  if (denied) return denied;
  const kv = context.env.MENU_KV;
  if (!kv) return Response.json({ error: "KV nije povezan." }, { status: 500 });

  let body;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: "Neispravan JSON." }, { status: 400 });
  }

  if (!isValidItem(body) || !body.id || typeof body.id !== "string") {
    return Response.json({ error: "Neispravan zapis." }, { status: 400 });
  }

  const items = await readMenuItems(kv);
  const idx = items.findIndex((i) => i.id === body.id);
  if (idx === -1) return Response.json({ error: "Stavka nije pronađena." }, { status: 404 });

  items[idx] = {
    id: body.id,
    category: String(body.category).trim(),
    name: String(body.name).trim(),
    description: body.description != null ? String(body.description).trim() : "",
    price: Number(body.price),
  };
  await writeMenuItems(kv, items);
  return Response.json({ ok: true, item: items[idx] });
}

/**
 * @param {{ request: Request; env: { MENU_KV?: KVNamespace } & Record<string, string> }} context
 */
export async function onRequestDelete(context) {
  const denied = await requireAdmin(context.request, context.env);
  if (denied) return denied;
  const kv = context.env.MENU_KV;
  if (!kv) return Response.json({ error: "KV nije povezan." }, { status: 500 });

  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return Response.json({ error: "Nedostaje id." }, { status: 400 });
  }

  const items = await readMenuItems(kv);
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return Response.json({ error: "Stavka nije pronađena." }, { status: 404 });

  await writeMenuItems(kv, next);
  return Response.json({ ok: true });
}
