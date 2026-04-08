export const MENU_KV_KEY = "menu:v1";

/** Podrazumevani meni kada KV nema podataka — ceo meni Art caffe */
export const DEFAULT_MENU_ITEMS = [
  { id: "1", category: "Preporuke", name: "Ceđeni Art mix", description: "0,33 l", price: 350 },
  { id: "2", category: "Preporuke", name: "Art smoothie", description: "0,33 l", price: 400 },
  { id: "3", category: "Preporuke", name: "Kokice", description: "", price: 150 },
  { id: "4", category: "Preporuke", name: "Carlsberg točeni", description: "0,3 l", price: 190 },

  { id: "5", category: "Topli napici", name: "Espresso", description: "", price: 160 },
  { id: "6", category: "Topli napici", name: "Espresso sa mlekom", description: "", price: 160 },
  { id: "7", category: "Topli napici", name: "Domaća kafa", description: "", price: 130 },
  { id: "8", category: "Topli napici", name: "Nes kafa", description: "", price: 180 },
  { id: "9", category: "Topli napici", name: "Latte macchiato", description: "", price: 200 },
  { id: "10", category: "Topli napici", name: "Cappuccino", description: "", price: 180 },
  { id: "11", category: "Topli napici", name: "Topla čokolada", description: "", price: 250 },
  { id: "12", category: "Topli napici", name: "Čaj", description: "", price: 160 },
  { id: "13", category: "Topli napici", name: "Kuvano vino", description: "", price: 250 },

  { id: "14", category: "Prirodni sokovi", name: "Limunada", description: "0,33 l", price: 200 },
  { id: "15", category: "Prirodni sokovi", name: "Limunada sa ukusom", description: "0,33 l", price: 230 },
  { id: "16", category: "Prirodni sokovi", name: "Ceđena narandža", description: "0,33 l", price: 330 },
  { id: "17", category: "Prirodni sokovi", name: "Ceđeni Art mix", description: "0,33 l", price: 350 },
  { id: "18", category: "Prirodni sokovi", name: "Art smoothie", description: "0,33 l", price: 400 },

  { id: "19", category: "Šejk", name: "Plazma šejk", description: "0,33 l", price: 300 },
  { id: "20", category: "Šejk", name: "Milk šejk", description: "0,33 l", price: 280 },

  { id: "21", category: "Voda", name: "Rosa, negazirana", description: "0,33 l", price: 150 },
  { id: "22", category: "Voda", name: "Rosa, gazirana", description: "0,33 l", price: 150 },
  { id: "23", category: "Voda", name: "Rosa, negazirana", description: "0,75 l", price: 270 },
  { id: "24", category: "Voda", name: "Rosa, gazirana", description: "0,75 l", price: 270 },

  { id: "25", category: "Bezalkoholna pića", name: "Coca-Cola", description: "0,25 l", price: 200 },
  { id: "26", category: "Bezalkoholna pića", name: "Coca-Cola Zero", description: "0,25 l", price: 200 },
  { id: "27", category: "Bezalkoholna pića", name: "Fanta", description: "0,25 l", price: 200 },
  { id: "28", category: "Bezalkoholna pića", name: "Sprite", description: "0,25 l", price: 200 },
  { id: "29", category: "Bezalkoholna pića", name: "Schweppes", description: "0,25 l", price: 240 },
  { id: "30", category: "Bezalkoholna pića", name: "Tangerina", description: "0,25 l", price: 240 },
  { id: "31", category: "Bezalkoholna pića", name: "Next", description: "0,25 l", price: 240 },
  { id: "32", category: "Bezalkoholna pića", name: "Red Bull", description: "0,25 l", price: 350 },
  { id: "33", category: "Bezalkoholna pića", name: "Ultra", description: "0,25 l", price: 260 },
  { id: "34", category: "Bezalkoholna pića", name: "Cedevita Classic", description: "0,25 l", price: 200 },
  { id: "35", category: "Bezalkoholna pića", name: "Cedevita sa ukusom", description: "0,25 l", price: 230 },

  { id: "36", category: "Pivo", name: "Carlsberg točeni", description: "0,3 l", price: 190 },
  { id: "37", category: "Pivo", name: "Carlsberg točeni", description: "0,5 l", price: 290 },
  { id: "38", category: "Pivo", name: "Amstel", description: "0,33 l", price: 250 },
  { id: "39", category: "Pivo", name: "Blanc", description: "0,33 l", price: 250 },
  { id: "40", category: "Pivo", name: "Lav Premium", description: "0,33 l", price: 250 },
  { id: "41", category: "Pivo", name: "Zaječarsko", description: "0,33 l", price: 250 },
  { id: "42", category: "Pivo", name: "Birra Moretti", description: "0,33 l", price: 250 },
  { id: "43", category: "Pivo", name: "Heineken", description: "0,25 l", price: 300 },
  { id: "44", category: "Pivo", name: "Tuborg", description: "0,33 l", price: 250 },

  { id: "45", category: "Žestoka pića", name: "Ballantine's", description: "0,03 l", price: 200 },
  { id: "46", category: "Žestoka pića", name: "Johnnie Walker", description: "0,03 l", price: 200 },
  { id: "47", category: "Žestoka pića", name: "Jameson", description: "0,03 l", price: 250 },
  { id: "48", category: "Žestoka pića", name: "Jack Daniel's", description: "0,03 l", price: 300 },
  { id: "49", category: "Žestoka pića", name: "Chivas Regal", description: "0,03 l", price: 400 },
  { id: "50", category: "Žestoka pića", name: "Finlandia Vodka", description: "0,03 l", price: 200 },
  { id: "51", category: "Žestoka pića", name: "Smirnoff Vodka", description: "0,03 l", price: 200 },
  { id: "52", category: "Žestoka pića", name: "Jägermeister", description: "0,03 l", price: 250 },
  { id: "53", category: "Žestoka pića", name: "Campari", description: "0,03 l", price: 250 },
  { id: "54", category: "Žestoka pića", name: "Two Fingers tekila", description: "0,03 l", price: 250 },
  { id: "55", category: "Žestoka pića", name: "Martini", description: "0,06 l", price: 250 },
  { id: "56", category: "Žestoka pića", name: "Bombay Sapphire Gin", description: "0,03 l", price: 200 },
  { id: "57", category: "Žestoka pića", name: "Gorki List", description: "0,03 l", price: 140 },
  { id: "58", category: "Žestoka pića", name: "Gorki List", description: "0,05 l", price: 240 },

  { id: "59", category: "Vina", name: "Žuti cvet", description: "0,187 l", price: 350 },
  { id: "60", category: "Vina", name: "Tikveš Aleksandria — belo", description: "0,187 l", price: 350 },
  { id: "61", category: "Vina", name: "Tikveš Aleksandria — crveno", description: "0,187 l", price: 350 },
];

/**
 * @param {import('@cloudflare/workers-types').KVNamespace} kv
 */
export async function readMenuItems(kv) {
  if (!kv) return [...DEFAULT_MENU_ITEMS];
  const raw = await kv.get(MENU_KV_KEY);
  if (!raw) return [...DEFAULT_MENU_ITEMS];
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data)) return data;
  } catch {
    /* fallthrough */
  }
  return [...DEFAULT_MENU_ITEMS];
}

/**
 * @param {import('@cloudflare/workers-types').KVNamespace} kv
 * @param {unknown[]} items
 */
export async function writeMenuItems(kv, items) {
  await kv.put(MENU_KV_KEY, JSON.stringify({ items }));
}

/**
 * @param {unknown} id
 * @param {unknown[]} items
 */
export function nextId(items) {
  const nums = items
    .map((i) => (i && typeof i.id === "string" ? parseInt(i.id, 10) : NaN))
    .filter((n) => !isNaN(n));
  const m = nums.length ? Math.max(...nums) : 0;
  return String(m + 1);
}
