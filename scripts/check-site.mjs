// Runs on every pull request and before every deploy.
// Fails if a page links to a file that doesn't exist, or if a stylesheet
// uses a raw color outside theme.css (colors belong in theme variables).
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { firebaseConfig, publicDir, listFiles, sitePath } from "./site-files.mjs";

const files = listFiles();
const problems = [];

function resolves(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "" || clean === "/") return existsSync(join(publicDir, "index.html"));
  const target = join(publicDir, clean);
  if (existsSync(target)) return true;
  return firebaseConfig.cleanUrls && existsSync(target + ".html");
}

for (const file of files.filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!href.startsWith("/")) continue;
    if (!resolves(href)) problems.push(`${sitePath(file)} links to missing ${href}`);
  }
  if (/[–—]/.test(html)) problems.push(`${sitePath(file)} contains an en or em dash`);
}

for (const file of files.filter((f) => f.endsWith(".css") && !f.endsWith("theme.css"))) {
  const css = readFileSync(file, "utf8");
  if (/#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(css)) problems.push(`${sitePath(file)} uses a raw color; add a variable to theme.css instead`);
}

if (problems.length) {
  console.error("Site check failed:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log(`Site check passed (${files.length} files).`);
