Galerija — kako dodati slike i video

1. Stavite fajlove ovde:
   - slike:  gallery/images/   (jpg, png, webp, gif …)
   - video:  gallery/videos/   (mp4, webm …)

2. Otvorite u editoru fajl: public/gallery-manifest.json

3. U niz "items" dodajte objekat za svaku stavku.

   Slika:
   {
     "type": "image",
     "src": "images/ime-fajla.jpg",
     "alt": "Kratak opis za pristupačnost",
     "caption": "Opcioni natpis ispod slike"
   }

   Video:
   {
     "type": "video",
     "src": "videos/ime-fajla.mp4",
     "poster": "images/poster-za-video.jpg",
     "caption": "Opcioni natpis"
   }
   (polje "poster" možete izostaviti ako nemate sličicu)

4. Pokrenite: npm run build   (ili sačekajte deploy na Cloudflare)

Stranica: /galerija.html
