import sharp from "sharp";

const source = "public/insight-cones-source.png";

await sharp(source)
  .resize(1440, 752, { fit: "cover" })
  .png({ compressionLevel: 9, palette: true, quality: 95 })
  .toFile("public/insight-cones.png");

const overlay = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shade" x1="0" x2="1">
        <stop offset="0" stop-color="#241052" stop-opacity=".86"/>
        <stop offset=".52" stop-color="#241052" stop-opacity=".3"/>
        <stop offset=".72" stop-color="#241052" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#shade)"/>
    <rect x="68" y="64" width="330" height="48" rx="24" fill="#b9ee68"/>
    <text x="233" y="96" text-anchor="middle" font-family="Malgun Gothic, sans-serif"
      font-size="20" font-weight="800" fill="#2b2142">AI·디지털 활용 선도학교</text>
    <text x="68" y="196" font-family="Malgun Gothic, sans-serif"
      font-size="62" font-weight="900" fill="#ffffff" letter-spacing="-3">
      <tspan x="68" dy="0">예산과 사례를</tspan>
      <tspan x="68" dy="76">2학기 실행으로</tspan>
      <tspan x="68" dy="76">바꿔요</tspan>
    </text>
    <text x="72" y="452" font-family="Malgun Gothic, sans-serif"
      font-size="25" font-weight="700" fill="#e9e3ff">2026 운영 인사이트</text>
    <rect x="68" y="496" width="202" height="54" rx="15" fill="#ffffff"/>
    <text x="169" y="531" text-anchor="middle" font-family="Malgun Gothic, sans-serif"
      font-size="20" font-weight="800" fill="#34216d">예산 데이터 분석</text>
    <rect x="282" y="496" width="202" height="54" rx="15" fill="#ffdfeb"/>
    <text x="383" y="531" text-anchor="middle" font-family="Malgun Gothic, sans-serif"
      font-size="20" font-weight="800" fill="#34216d">과제 사례 분석</text>
  </svg>
`);

await sharp(source)
  .resize(1200, 630, { fit: "cover" })
  .composite([{ input: overlay }])
  .png({ compressionLevel: 9 })
  .toFile("public/og-insights.png");
