// Renders the site's text wordmark (see src/components/Logo.tsx) to PNGs for
// email, where SVG/live text isn't reliably supported. 2x retina: 360px wide,
// displayed at 180px. Run: node scripts/make-email-logo.mjs
import sharp from "sharp";

function svg({ top, bottom }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="84" viewBox="0 0 360 84">
  <text x="180" y="44" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="46" letter-spacing="-1.2" fill="${top}">BARCELONA</text>
  <text x="180" y="76" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="19" letter-spacing="5.4" fill="${bottom}">ENGLISH PROS</text>
</svg>`;
}

await sharp(Buffer.from(svg({ top: "#1a1523", bottom: "#5b21b6" }))).png().toFile("public/email/logo.png");
await sharp(Buffer.from(svg({ top: "#ffffff", bottom: "#ffb020" }))).png().toFile("public/email/logo-white.png");
console.log("done");
