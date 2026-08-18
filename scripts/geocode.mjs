// One-off / repeatable geocoding pass for src/lib/professionals.ts.
//
// Reads every professional's `addressArea` string, geocodes it against
// OpenStreetMap's free Nominatim API, and inserts `lat`/`lng` fields right
// after `addressArea` for any entry that doesn't have them yet. Existing
// coordinates are left untouched, so this is safe to re-run whenever new
// listings are added (only the new ones get geocoded).
//
// Respects Nominatim's usage policy: max 1 request/second, identifying
// User-Agent, no bulk/commercial reverse engineering.
// https://operations.osmfoundation.org/policies/nominatim/
//
// Usage: node scripts/geocode.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "..", "src", "lib", "professionals.ts");

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "barcelona-english-pros-dev-geocoder/1.0 (one-off local build script)";
const DELAY_MS = 1100;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocode(query) {
  const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

async function main() {
  let src = readFileSync(filePath, "utf8");

  // Match each professional object block to pull id + addressArea, and
  // detect whether it already has lat/lng.
  const blockRegex = /\{[^{}]*?\}/gs;
  const blocks = src.match(blockRegex) || [];

  const toGeocode = [];
  for (const block of blocks) {
    const idMatch = block.match(/id:\s*"([^"]+)"/);
    const addrMatch = block.match(/addressArea:\s*"([^"]+)"/);
    if (!idMatch || !addrMatch) continue;
    if (/\blat:\s*-?\d/.test(block)) continue; // already geocoded
    toGeocode.push({ id: idMatch[1], addressArea: addrMatch[1] });
  }

  console.log(`${toGeocode.length} professionals need geocoding (of ${blocks.length} total blocks scanned).`);

  const results = new Map();
  for (let i = 0; i < toGeocode.length; i++) {
    const { id, addressArea } = toGeocode[i];
    const query = `${addressArea}, Barcelona, Spain`;
    try {
      const coords = await geocode(query);
      if (coords) {
        results.set(id, coords);
        console.log(`[${i + 1}/${toGeocode.length}] OK   ${id} -> ${coords.lat}, ${coords.lng}`);
      } else {
        console.log(`[${i + 1}/${toGeocode.length}] MISS ${id} (no result for "${query}")`);
      }
    } catch (err) {
      console.log(`[${i + 1}/${toGeocode.length}] ERR  ${id}: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }

  // Splice lat/lng into the source text right after each matched
  // addressArea line, keyed by the id on the same object.
  let inserted = 0;
  for (const [id, { lat, lng }] of results) {
    const idNeedle = `id: "${id}",`;
    const idIdx = src.indexOf(idNeedle);
    if (idIdx === -1) continue;
    // addressArea line is somewhere after the id within the same object;
    // find the next `addressArea: "...",` after this id and insert after it.
    const addrRegex = /addressArea:\s*"[^"]+",/;
    const rest = src.slice(idIdx);
    const addrMatch = rest.match(addrRegex);
    if (!addrMatch) continue;
    const insertAt = idIdx + addrMatch.index + addrMatch[0].length;
    const insertion = `\n    lat: ${lat},\n    lng: ${lng},`;
    src = src.slice(0, insertAt) + insertion + src.slice(insertAt);
    inserted++;
  }

  writeFileSync(filePath, src, "utf8");
  console.log(`\nInserted coordinates for ${inserted} professionals. ${toGeocode.length - results.size} had no geocode match (left without lat/lng).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
