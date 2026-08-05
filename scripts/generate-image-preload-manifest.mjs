import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const sourceRoot = resolve("app");
const outputFile = resolve("public", "game-image-manifest.json");
const sourceExtensions = new Set([".css", ".js", ".jsx", ".ts", ".tsx"]);
const imageExtensions = "png|jpe?g|webp|gif|avif|svg";
const localImagePattern = new RegExp(
  `["'\`](\\/[^"'\`\\r\\n?#]+\\.(?:${imageExtensions}))(?:[?#][^"'\`\\r\\n]*)?["'\`]`,
  "gi",
);
const remoteRuntimeImagePattern = /["'`](https:\/\/images\.unsplash\.com\/[^"'`\r\n]+)["'`]/gi;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(target));
    else if (sourceExtensions.has(extname(entry.name))) files.push(target);
  }

  return files;
}

const sourceFiles = await collectFiles(sourceRoot);
const localAssets = new Set();
const remoteAssets = new Set();

for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");

  for (const match of source.matchAll(localImagePattern)) {
    localAssets.add(match[1].replace(/^\//, ""));
  }

  for (const match of source.matchAll(remoteRuntimeImagePattern)) {
    remoteAssets.add(match[1].replaceAll("&amp;", "&"));
  }
}

const local = [...localAssets].sort((left, right) => {
  const priority = value => value.startsWith("opening/") ? 0 : value.startsWith("characters/") ? 1 : 2;
  return priority(left) - priority(right) || left.localeCompare(right, "zh-CN");
});
const remote = [...remoteAssets].sort();
const manifest = {
  version: 1,
  count: local.length + remote.length,
  local,
  remote,
};

await mkdir(resolve("public"), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Prepared ${manifest.count} game images from ${sourceFiles.length} source files.`);
console.log(relative(process.cwd(), outputFile));
