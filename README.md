# Art caffe — statički sajt + admin menija (Cloudflare Pages)

Javni sajt (HTML, Tailwind, mali JavaScript) sa tamno/svetlom temom, parallax hero sekcijom i stranicama na **srpskoj latinici**. Meni se učitava sa **Cloudflare Pages Functions** i čuva u **KV**; admin panel na `/admin/` omogućava dodavanje, izmenu i brisanje stavki uz prijavu lozinkom.

## Struktura

- `public/` — HTML šabloni (`{{HEADER}}` / `{{FOOTER}}`), `js/`.
- `images/` — slike za sajt; glavni logo u headeru je **`images/logo.jpg`** (URL `/images/logo.jpg`). Build kopira u `dist/images/`.
- `partials/` — zajednički header i footer (ubacuje ih `npm run build`).
- `src/input.css` — ulaz za Tailwind.
- `functions/` — edge API (`/api/menu`, `/api/admin/*`).
- `dist/` — izlaz builda (ne commitujte; generiše se komandom ispod).
- `public/galerija.html` + `public/js/gallery.js` — galerija slika i video zapisa.
- `public/gallery-manifest.json` — redosled i opisi stavki; fajlovi u `public/gallery/images/` i `public/gallery/videos/` (vidi `public/gallery/README.txt`).

## Galerija

1. Stavite slike u `public/gallery/images/`, video u `public/gallery/videos/` (preporučeno: mp4 ili webm, umerena veličina radi bržeg učitavanja).
2. U `public/gallery-manifest.json` u niz `items` dodajte objekte tipa `image` ili `video` (primeri u `public/gallery/README.txt`).
3. Pokrenite `npm run build` i objavite. Stranica: **`/galerija.html`**.

Kada pošaljete materijal (npr. u četu), možete tražiti da se fajlovi dodaju u `gallery/` i da se manifest ažurira umesto vas.

## Lokalni razvoj

```bash
npm install
npm run build
```

Lokalno pokretanje sa Functions i KV zahteva **Wrangler** i fajl `.dev.vars`:

1. Prijavite se: `npx wrangler login`
2. Napravite KV namespace (jednom):  
   `npx wrangler kv namespace create MENU_KV`  
   Zapišite `id` i stavite ga u `wrangler.toml` umesto `REPLACE_WITH_YOUR_KV_NAMESPACE_ID` (i za `preview_id` može isti ID za jednostavnost).
3. Kopirajte `.dev.vars.example` u `.dev.vars` i popunite:
   - `SESSION_SECRET` — dug slučajan string (npr. 40+ karaktera).
   - `ADMIN_PASSWORD_SHA256` — heks iz koraka ispod.
4. Generišite heš lozinke:

```bash
npm run hash-password -- "vaša-jaka-lozinka"
```

Nalepite ispisani heks u `.dev.vars` kao vrednost `ADMIN_PASSWORD_SHA256`.

5. Pokrenite:

```bash
npm run dev
```

Otvorite prikazani URL (npr. `http://localhost:8788`). Admin: `/admin/`.

## GitHub — šta i kako da gurnete u repozitorijum

1. Na GitHubu kreirajte **novi prazan repozitorijum** (bez README ako već imate lokalno).
2. U folderu projekta:

```bash
git init
git add .
git commit -m "Inicijalni sajt Art caffe"
git branch -M main
git remote add origin https://github.com/VASE_KORISNICKO_IME/NAZIV_REPO.git
git push -u origin main
```

3. Proverite da `.gitignore` isključuje `node_modules/`, `dist/` i `.dev.vars` (već je podešeno).

## Cloudflare Pages — objavljivanje

### 1. KV namespace (produkcija)

Ako još nemate:

```bash
npx wrangler kv namespace create MENU_KV
```

Kopirajte **id** u `wrangler.toml` (`id` i po želji `preview_id`).

### 2. Povezivanje repozitorijuma

1. Ulogujte se na [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Izaberite GitHub i repozitorijum ovog projekta.
3. Podešavanje builda:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (koren repozitorijuma)

### 3. Tajne i varijable (obavezno za admin)

U **Pages** projektu → **Settings** → **Environment variables** (Production, i po želji Preview):

| Ime | Tip | Vrednost |
|-----|-----|----------|
| `SESSION_SECRET` | Secret | Dug slučajan string (isti princip kao lokalno) |
| `ADMIN_PASSWORD_SHA256` | Secret | Izlaz komande `npm run hash-password -- "vaša-lozinka"` (heks) |

**KV binding:** Settings → **Functions** → **KV namespace bindings** → Add binding:

- Variable name: `MENU_KV`
- KV namespace: izaberite kreirani namespace

(Alternativa: ako `wrangler.toml` u repou sadrži ispravan `[[kv_namespaces]]` sa pravim `id`, Cloudflare često povuče binding pri deployu — u suprotnom dodajte ručno u dashboardu.)

### 4. Deploy

Svaki `git push` na povezanu granu pokreće novi build. Posle prvog uspešnog deploya:

- Sajt: URL koji Pages dodeli (npr. `https://art-caffe.pages.dev`).
- Admin: `https://vaš-domen.pages.dev/admin/`

### 5. Početni meni u KV (opciono)

Dok KV nema podatke, API vraća ugrađeni primer menija. Da odmah sačuvate svoj JSON u KV:

```bash
npx wrangler kv key put --binding=MENU_KV "menu:v1" --path=./primer-meni.json
```

(gde `primer-meni.json` ima oblik `{"items":[...]}` — isti format koji admin čuva.)

## Bezbednost (kratko)

- Lozinka se ne čuva u čitljivom obliku — u oblaku je samo **SHA-256** heš.
- Sesija je **HttpOnly** kolačić potpisan **HMAC**-om (`SESSION_SECRET`).
- Prijava ima grub **rate limit** po IP-u u kodu; za ozbiljniji sajt dodajte Cloudflare **WAF / Rate limiting** pravila.

## Produkcioni domen (opciono)

U Pages projektu: **Custom domains** → dodajte domen i pratite DNS uputstva Cloudflare-a.

## Kontakt forma

Forma na `kontakt.html` koristi `mailto:` — bez server-side slanja e-pošte. Za slanje preko servera kasnije možete dodati Worker + servis (npr. Resend) i poseban endpoint.

## Podrška

- Logo i ostale slike za `/images/…` stavite u `images/` u korenu projekta (vidi `images/README.txt`).
- Adresa, mapa, telefon i e-pošta su primeri u HTML — zamenite stvarnim podacima pre objave.
