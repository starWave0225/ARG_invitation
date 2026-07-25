import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { rewriteGitHubPagesPaths } from "./github-pages-paths.mjs";

const outputRoot = resolve("out");
const basePath = "/ARG_invitation";
const textExtensions = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"]);

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(target));
    else files.push(target);
  }
  return files;
}

const files = await collectFiles(outputRoot);
let changedFiles = 0;

for (const file of files) {
  if (!textExtensions.has(extname(file))) continue;
  const original = await readFile(file, "utf8");
  const updated = rewriteGitHubPagesPaths(original);
  if (updated === original) continue;
  await writeFile(file, updated, "utf8");
  changedFiles += 1;
}

await writeFile(join(outputRoot, ".nojekyll"), "", "utf8");
console.log(`Prepared ${changedFiles} exported files for ${basePath}.`);
