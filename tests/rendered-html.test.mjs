import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("builds a standard Next.js deployment and keeps the dashboard content", async () => {
  await access(new URL(".next/BUILD_ID", root));
  await access(new URL("public/case-hero.png", root));

  const [page, caseData, caseCatalog, styles, layout, packageJson] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/case-data.ts", root), "utf8"),
    readFile(new URL("app/case-catalog-data.ts", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.match(page, /AI·디지털 활용 선도학교 운영 인사이트/);
  assert.match(page, /예산 데이터 분석/);
  assert.match(page, /과제 사례 분석/);
  assert.match(page, /src="\/case-hero\.png"/);
  assert.match(page, /사례의 숫자보다/);
  assert.match(page, /예산 숫자를/);
  assert.match(page, /에듀테크 토핑/);
  assert.match(page, /전체 사례 보기/);
  assert.match(page, /전체 사례 카드/);
  assert.match(page, /메인으로/);
  assert.doesNotMatch(page, /학교명 없이|학교명은 표시하지|공통 운영 방식으로 재서술|공개 데이터에 포함/);
  assert.match(layout, /metadataBase/);
  const manifest = JSON.parse(packageJson);
  assert.equal(manifest.scripts.build, "next build");
  assert.equal(manifest.engines.node, "22.x");
  assert.equal(manifest.dependencies.vinext, undefined);
  assert.equal(manifest.devDependencies.wrangler, undefined);
  assert.equal(manifest.devDependencies["cross-env"], undefined);
  assert.doesNotMatch(page, /총 교부액|19,397,529|1120616420|2000000000/);
  assert.doesNotMatch(page, /58개 선도학교|58개교 익명|미집행|아직 지출 없음/);
  assert.match(page, /role="tab"/);
  assert.match(page, /hidden=\{activeTab !== "edutech"\}/);
  assert.match(page, /상위 10개부터 롱테일까지, 78종을 모두/);
  assert.match(page, /4K Video Downloader\+/);
  assert.match(page, /후크패드/);
  assert.match(page, /선택 학교 비율/);
  assert.match(page, /getWordSize/);
  assert.doesNotMatch(page, /정확한 수치 보기 <span>Top 10/);
  assert.match(page, /예산 4스쿱/);
  assert.match(page, /상세 분석 보기/);
  assert.match(page, /2학기 운영 레시피/);
  assert.match(page, /실행 체크/);
  assert.match(caseData, /필수과제 1/);
  assert.match(caseData, /필수과제 2/);
  assert.match(caseData, /필수과제 3/);
  assert.match(caseData, /선택과제/);
  assert.match(page, /2학기 운영 시 생각해볼 사안/);
  assert.doesNotMatch(caseData, /초등학교|학교명|개교|미제출/);
  assert.equal((caseCatalog.match(/"id":/g) ?? []).length, 231);
  assert.doesNotMatch(caseCatalog, /초등학교|중학교|학교명|원본파일|PDF페이지/);
  assert.doesNotMatch(caseCatalog, /교사 는|피드백 과|제공하 였|이었습 니다|아 바타|유 행|디 지털|도 구|학 습|수 업/);
  assert.match(styles, /\.case-app[\s\S]*word-break: keep-all/);
  assert.match(styles, /\.band-row span,[\s\S]*white-space: nowrap/);
  assert.match(styles, /\.budget-app[\s\S]*word-break: keep-all/);
  assert.match(styles, /\.case-overview-art img[\s\S]*object-fit: contain/);
  assert.match(styles, /\.hero \{[\s\S]*overflow: hidden/);
  assert.doesNotMatch(page, /AI·디지털 선도학교 예산 레시피/);
});
