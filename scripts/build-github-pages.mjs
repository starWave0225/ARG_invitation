import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const nextCli = resolve("node_modules/next/dist/bin/next");
const build = spawnSync(process.execPath, [nextCli, "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
  },
});

if (build.error) {
  throw build.error;
}
if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const prepare = spawnSync(process.execPath, ["scripts/prepare-github-pages.mjs"], {
  stdio: "inherit",
  env: process.env,
});

if (prepare.error) {
  throw prepare.error;
}

process.exit(prepare.status ?? 1);
