import { createHash } from "node:crypto";

const pw = process.argv[2];
if (!pw) {
  console.error("Upotreba: node scripts/hash-password.mjs \"vaša-lozinka\"");
  process.exit(1);
}

const hex = createHash("sha256").update(pw, "utf8").digest("hex");
console.log("ADMIN_PASSWORD_SHA256 (dodajte kao tajnu u Cloudflare):");
console.log(hex);
