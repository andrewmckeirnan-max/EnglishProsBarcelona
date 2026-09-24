// Renders the 1200x630 social share image (public/og.png). Run: node scripts/make-og.mjs
import sharp from "sharp";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3ecff"/><stop offset="1" stop-color="#fdf3ee"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<rect x="0" y="0" width="1200" height="18" fill="#5b21b6"/>
<text x="80" y="150" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="46" letter-spacing="-1" fill="#1a1523">BARCELONA</text>
<text x="82" y="188" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="20" letter-spacing="6" fill="#5b21b6">ENGLISH PROS</text>
<text x="80" y="330" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="76" letter-spacing="-2" fill="#1a1523">Find an English-speaking</text>
<text x="80" y="418" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="76" letter-spacing="-2" fill="#1a1523">professional in Barcelona</text>
<text x="80" y="500" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="#6b6480">Verified dentists, doctors, lawyers, tax advisors and more, by neighbourhood.</text>
<rect x="80" y="545" rx="24" ry="24" width="330" height="48" fill="#ffb020"/>
<text x="245" y="578" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="24" fill="#2a1a00">barcelonaenglishpros.com</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("og.png written");
