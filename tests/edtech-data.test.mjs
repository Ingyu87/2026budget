import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

const round1 = (value) => Math.round(value * 10) / 10;

test("keeps the 7.24 edtech snapshot internally consistent and anonymous", async () => {
  const source = await readFile(new URL("app/edtech-data.ts", root), "utf8");
  const snapshotMatch = source.match(
    /export const edtechSnapshot: EdtechSnapshot = (\{[\s\S]*?\});\s+export const teacherWebAppSummary/,
  );
  const teacherMatch = source.match(
    /export const teacherWebAppSummary: TeacherWebAppSummary = (\{[\s\S]*\});\s*$/,
  );

  assert.ok(snapshotMatch, "에듀테크 스냅샷을 읽을 수 있어야 합니다.");
  assert.ok(teacherMatch, "교사개발 웹앱 요약을 읽을 수 있어야 합니다.");

  const snapshot = JSON.parse(snapshotMatch[1]);
  const teacher = JSON.parse(teacherMatch[1]);
  const levels = ["all", "elementary", "middle", "high"];

  assert.equal(snapshot.asOf, "2026-07-24");
  assert.deepEqual(snapshot.denominators, {
    all: 177,
    elementary: 89,
    middle: 51,
    high: 37,
  });
  assert.ok(snapshot.tools.length >= 100, "구매·구독 도구가 충분히 보존되어야 합니다.");
  assert.ok(snapshot.usageCases.length >= 100, "도구별 익명 활용 사례가 함께 제공되어야 합니다.");
  assert.equal(snapshot.tools[0].name, "패들렛");
  assert.equal(snapshot.tools[0].counts.all, 76);
  assert.deepEqual(teacher.counts, {
    all: 24,
    elementary: 8,
    middle: 12,
    high: 4,
  });

  for (const tool of snapshot.tools) {
    for (const level of levels) {
      assert.ok(tool.counts[level] <= snapshot.denominators[level]);
      assert.equal(
        tool.rates[level],
        round1((tool.counts[level] / snapshot.denominators[level]) * 100),
        `${tool.name} ${level} 비율이 건수와 일치해야 합니다.`,
      );
    }
  }

  const codeMos = snapshot.tools.find((tool) => tool.name === "코드모스");
  assert.ok(codeMos, "코드모스가 코딩·컴퓨팅 도구에 포함되어야 합니다.");
  assert.equal(codeMos.group, "코딩·컴퓨팅");
  assert.equal(codeMos.counts.elementary, 3);

  const senSchool = snapshot.tools.find((tool) => tool.name === "SEN스쿨");
  assert.ok(senSchool, "SEN스쿨 통합 항목이 있어야 합니다.");
  assert.deepEqual(senSchool.counts, {
    all: 9,
    elementary: 6,
    middle: 3,
    high: 0,
  });
  assert.equal(snapshot.tools.some((tool) => tool.name === "센스쿨"), false);
  assert.equal(snapshot.tools.some((tool) => tool.name === "SEN에듀"), false);

  const padletCases = snapshot.usageCases.filter((usageCase) => usageCase.tools.includes("패들렛"));
  assert.equal(padletCases.length, 20, "패들렛이 제목·본문에서 직접 확인된 사례만 연결되어야 합니다.");
  assert.ok(padletCases.every((usageCase) =>
    usageCase.title
    && usageCase.summary
    && usageCase.subject
    && usageCase.evidence["패들렛"]
    && /패들렛|Padlet/i.test(usageCase.evidence["패들렛"])
    && ["elementary", "middle", "high"].includes(usageCase.level)
    && !Object.hasOwn(usageCase, "school"),
  ));

  assert.ok(snapshot.usageCases.every((usageCase) =>
    usageCase.tools.length > 0
    && usageCase.tools.every((toolName) => usageCase.evidence[toolName]),
  ), "모든 도구-사례 연결에는 도구별 직접 근거 문장이 있어야 합니다.");

  assert.doesNotMatch(source, /초등학교|중학교|고등학교|"school"/);
  assert.doesNotMatch(source, /학생 제작|학생개발/);
});
