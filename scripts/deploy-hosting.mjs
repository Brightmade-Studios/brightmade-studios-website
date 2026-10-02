// Deploys public/ to Firebase Hosting through the Hosting REST API.
// Runs only in GitHub Actions, with a short-lived access token from
// Workload Identity Federation (no service account keys).
// It uses the REST API instead of the firebase CLI because the CLI has
// had trouble authenticating with federated credentials in CI.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { firebaseConfig, listFiles, sitePath } from "./site-files.mjs";

const token = process.env.ACCESS_TOKEN;
const site = process.env.SITE_ID;
if (!token || !site) throw new Error("ACCESS_TOKEN and SITE_ID must be set");

const API = "https://firebasehosting.googleapis.com/v1beta1";

async function call(method, url, body, headers = {}) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...headers },
    body,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} failed (${res.status}): ${text}`);
  return text ? JSON.parse(text) : {};
}
const json = (method, url, data) =>
  call(method, url, JSON.stringify(data), { "Content-Type": "application/json" });

// firebase.json hosting settings -> REST ServingConfig
function servingConfig(c) {
  const config = {};
  if (c.cleanUrls) config.cleanUrls = true;
  if (c.trailingSlash === false) config.trailingSlashBehavior = "REMOVE";
  if (c.trailingSlash === true) config.trailingSlashBehavior = "ADD";
  if (c.headers) {
    config.headers = c.headers.map((h) => ({
      glob: h.source,
      headers: Object.fromEntries(h.headers.map(({ key, value }) => [key, value])),
    }));
  }
  return config;
}

// 1. Gzip and hash every file.
const byHash = new Map();
const manifest = {};
for (const file of listFiles()) {
  const gz = gzipSync(readFileSync(file), { level: 9 });
  const hash = createHash("sha256").update(gz).digest("hex");
  manifest[sitePath(file)] = hash;
  byHash.set(hash, gz);
}
console.log(`Prepared ${Object.keys(manifest).length} files.`);

// 2. Create a new version with the hosting settings.
const version = await json("POST", `${API}/sites/${site}/versions`, {
  config: servingConfig(firebaseConfig),
});
console.log(`Created ${version.name}`);

// 3. Tell Hosting which files the version has; upload the ones it doesn't already store.
const populated = await json("POST", `${API}/${version.name}:populateFiles`, { files: manifest });
const needed = populated.uploadRequiredHashes || [];
for (const hash of needed) {
  await call("POST", `${populated.uploadUrl}/${hash}`, byHash.get(hash), {
    "Content-Type": "application/octet-stream",
  });
}
console.log(`Uploaded ${needed.length} new files.`);

// 4. Finalize and release it.
await json("PATCH", `${API}/${version.name}?update_mask=status`, { status: "FINALIZED" });
const release = await call(
  "POST",
  `${API}/sites/${site}/releases?versionName=${encodeURIComponent(version.name)}`,
  "{}",
  { "Content-Type": "application/json" },
);
console.log(`Released ${release.name}. Live at https://${site}.web.app`);
