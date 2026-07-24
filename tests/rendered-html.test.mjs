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

  assert.match(page, /AI·디지털 활용 선도학교 운영 길잡이/);
  assert.match(page, /예산 데이터 분석/);
  assert.match(page, /과제 사례 분석/);
  assert.match(page, /src="\/case-hero\.png"/);
  assert.match(page, /1학기 사례에서 찾은/);
  assert.match(page, /예산 숫자를/);
  assert.match(page, /에듀테크 선택 현황/);
  assert.match(page, /학생 사용 전 필수 확인/);
  assert.match(page, /학교운영위원회 심의/);
  assert.match(page, /법정대리인의 개인정보 활용 동의/);
  assert.match(page, /서울시교육청: AI·에듀테크 공교육 도입 및 활용 가이드라인·지원자료/);
  assert.doesNotMatch(page, /교육부: 학습지원 소프트웨어 선정 기준·학교운영위원회 심의/);
  assert.doesNotMatch(page, /교육부: 개인정보 동의서와 최소 수집 확인/);
  assert.doesNotMatch(page, /general-ai-notice|학생 직접 사용 제한|ChatGPT·SUNO는 만 13세 미만|Gemini·Genspark.*일반 범용 AI 서비스/);
  assert.doesNotMatch(page, /className="general-ai-badge"/);
  assert.doesNotMatch(page, /도구를 선택하면 현재 공식 약관에 따른 상세 조건을 볼 수 있습니다/);
  assert.doesNotMatch(page, /tool-safety-detail|selectedSafety|toolSafetyMeta/);
  assert.doesNotMatch(page, /ChatGPT는 18세 미만 사용 불가|SUNO는 18세 미만 사용 불가/);
  assert.match(page, /전체 사례 보기/);
  assert.match(page, /전체 사례 카드/);
  assert.match(page, /메인으로/);
  assert.match(page, /제작자: 서울가동초 백인규/);
  assert.doesNotMatch(page, /All rights reserved|© 2026/);
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
  assert.match(page, /자료 읽는 법/);
  assert.match(page, /학교별 집행률을 낮은 순서부터 놓았을 때 정확히 절반이 지난 위치/);
  assert.match(page, /className="term-help"/);
  assert.doesNotMatch(page, /가운데 학교|가운데 수준|롱테일/);
  assert.doesNotMatch(page, /총액보다 지금 필요한 판단|입력값은 이 브라우저|완료 체크는 서버로|공식 기능을 다시 대조|에듀테크 토핑|우리 학교 스쿱 진단|운영 인사이트/);
  assert.match(page, /4K Video Downloader\+/);
  assert.match(page, /후크패드/);
  assert.match(page, /선택 학교 비율/);
  assert.match(page, /getWordSize/);
  assert.doesNotMatch(page, /정확한 수치 보기 <span>Top 10/);
  assert.match(page, /영역별 예산/);
  assert.match(page, /상세 분석 보기/);
  assert.match(page, /budgetRateDistributions/);
  assert.match(page, /영역별 집행률 분포를 10개 구간/);
  assert.match(page, /분포 아래쪽부터 약/);
  assert.match(page, /학교명 제외 · 원문 지출내용과 산출근거/);
  assert.match(page, /세부 지출 예시/);
  assert.match(page, /median: 57\.7/);
  assert.match(page, /2학기 운영 계획/);
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
