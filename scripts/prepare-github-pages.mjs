import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const outputRoot = resolve("out");
const basePath = "/ARG_invitation";
const textExtensions = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"]);
const internalRoots = [
  "audio",
  "characters",
  "computer",
  "downloads",
  "ending",
  "evidence",
  "hengmu",
  "hospital",
  "memories",
  "moments",
  "nightdrive",
  "old-computer",
  "opening",
  "paintings",
  "police",
  "qzone",
  "university",
  "weibo",
  "yuanfan",
  "family-brother.svg",
  "family-father.svg",
  "family-group.svg",
  "family-mother.svg",
  "favicon.svg",
  "file.svg",
  "globe.svg",
  "olddriver-group.svg",
  "story-guide.html",
  "window.svg",
];

const escapedRoots = internalRoots
  .sort((left, right) => right.length - left.length)
  .map(value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");
const quotedRootPath = new RegExp(`(["'])/(${escapedRoots})(?=[/"'?&#]|$)`, "g");
const unquotedCssPath = new RegExp(`(url\\(\\s*)/(${escapedRoots})(?=[/)'"]|$)`, "g");

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
  const updated = original
    .replace(quotedRootPath, `$1${basePath}/$2`)
    .replace(unquotedCssPath, `$1${basePath}/$2`)
    .replace(/(["'])\/\1/g, `$1${basePath}/$1`);
  if (updated === original) continue;
  await writeFile(file, updated, "utf8");
  changedFiles += 1;
}

await writeFile(join(outputRoot, ".nojekyll"), "", "utf8");
console.log(`Prepared ${changedFiles} exported files for ${basePath}.`);
