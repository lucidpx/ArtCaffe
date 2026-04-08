import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function walkHtml(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walkHtml(full, acc);
    else if (name.endsWith(".html")) acc.push(full);
  }
  return acc;
}

rmrf(dist);
fs.mkdirSync(path.join(dist, "css"), { recursive: true });

execSync(
  `npx tailwindcss -i "${path.join(root, "src", "input.css")}" -o "${path.join(dist, "css", "styles.css")}" --minify`,
  { stdio: "inherit", cwd: root }
);

const header = fs.readFileSync(path.join(root, "partials", "header.html"), "utf8");
const footer = fs.readFileSync(path.join(root, "partials", "footer.html"), "utf8");

copyDir(path.join(root, "public", "js"), path.join(dist, "js"));
copyDir(path.join(root, "images"), path.join(dist, "images"));
copyDir(path.join(root, "public", "gallery"), path.join(dist, "gallery"));

const manifestSrc = path.join(root, "public", "gallery-manifest.json");
const manifestDest = path.join(dist, "gallery-manifest.json");
if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDest);
}

const publicHtml = walkHtml(path.join(root, "public"));
for (const file of publicHtml) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/\{\{HEADER\}\}/g, header).replace(/\{\{FOOTER\}\}/g, footer);
  const rel = path.relative(path.join(root, "public"), file);
  const out = path.join(dist, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, "utf8");
}

console.log("Build complete → dist/");
