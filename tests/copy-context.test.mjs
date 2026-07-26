import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("uses source-accurate language for edtech purchase and subscription data", async () => {
  const [page, edtechData, buildScript] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/edtech-data.ts", root), "utf8"),
    readFile(new URL("scripts/build-edtech-data.mjs", root), "utf8"),
  ]);

  assert.match(page, /에듀테크 구매·구독 현황/);
  assert.match(page, /에서 구매·구독이 확인됐습니다/);
  assert.match(page, /실제 사용 빈도나 만족도를 뜻하지 않습니다/);
  assert.match(page, /이 유형의 도구가 지원하는 활동/);
  assert.match(page, /학교급별 확인 비율 비교/);

  assert.doesNotMatch(page, /가장 넓었|가장 넓고|가장 넓게 확인/);
  assert.doesNotMatch(page, /운영을 잇는 선택|선택 경향|이 도구를 선택한 수업 목적/);
  assert.doesNotMatch(page, /학교에서 해결하려는 수업 문제를 먼저 정한 뒤 제품을 비교/);

  const revisedTeacherWebAppCopy = "교사가 수업에 필요한 기능을 직접 구현한 사례도 확인됐습니다.";
  assert.match(edtechData, new RegExp(revisedTeacherWebAppCopy));
  assert.match(buildScript, new RegExp(revisedTeacherWebAppCopy));
});
