// Shared helpers: read firebase.json and list the files to publish.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

export const firebaseConfig = JSON.parse(readFileSync("firebase.json", "utf8")).hosting;
export const publicDir = firebaseConfig.public;

export function listFiles(dir = publicDir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

// "public/apps.html" -> "/apps.html"
export function sitePath(file) {
  return "/" + relative(publicDir, file).split(sep).join("/");
}
