import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("keeps GitHub Pages and EdgeOne static exports independent", async () => {
  const [packageJson, nextConfig, edgeOneBuild, githubPagesBuild, edgeOneConfig] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../scripts/build-edgeone.mjs", import.meta.url), "utf8"),
    readFile(new URL("../scripts/build-github-pages.mjs", import.meta.url), "utf8"),
    readFile(new URL("../edgeone.json", import.meta.url), "utf8"),
  ]);

  assert.match(packageJson, /"build:edgeone": "node scripts\/build-edgeone\.mjs"/);
  assert.match(packageJson, /"build:pages": "node scripts\/build-github-pages\.mjs"/);
  assert.match(nextConfig, /isEdgeOnePages = process\.env\.EDGEONE_PAGES === "true"/);
  assert.match(nextConfig, /isStaticExport = isGitHubPages \|\| isEdgeOnePages/);
  assert.match(nextConfig, /\.\.\.\(isGitHubPages/);
  assert.match(edgeOneBuild, /EDGEONE_PAGES: "true"/);
  assert.doesNotMatch(edgeOneBuild, /ARG_invitation|GITHUB_PAGES/);
  assert.match(githubPagesBuild, /GITHUB_PAGES: "true"/);
  assert.match(githubPagesBuild, /prepare-github-pages\.mjs/);
  assert.deepEqual(JSON.parse(edgeOneConfig), {
    installCommand: "npm ci",
    buildCommand: "npm run build:edgeone",
    outputDirectory: "./out",
    nodeVersion: "22.11.0",
  });
});

test("does not rely on blocked third-party image hosts at runtime", async () => {
  const [desktop, weiboImage, styles] = await Promise.all([
    readFile(new URL("../app/computer/DesktopRoute.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/weibo/WeiboImage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  for (const source of [desktop, weiboImage, styles]) {
    assert.doesNotMatch(source, /images\.unsplash\.com|picsum\.photos/);
  }
});
