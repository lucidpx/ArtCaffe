import { readMenuItems } from "../_lib/menu.js";

/**
 * @param {{ env: { MENU_KV?: KVNamespace } }} context
 */
export async function onRequestGet(context) {
  const items = await readMenuItems(context.env.MENU_KV);
  return Response.json(
    { items },
    {
      headers: {
        "Cache-Control": "public, max-age=60",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
