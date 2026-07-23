import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("builds a standard Next.js deployment and keeps the dashboard content", async () => {
  await access(new URL(".next/BUILD_ID", root));

  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.match(page, /AI·디지털 선도학교 예산 레시피/);
  assert.match(page, /예산 숫자를/);
  assert.match(page, /에듀테크 토핑/);
  assert.match(page, /학교명 없이/);
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
});
