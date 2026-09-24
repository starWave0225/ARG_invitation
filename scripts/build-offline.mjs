import { createHash } from "node:crypto";
import { chmod, cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);
const cache = join(root, ".offline-cache");
const output = join(root, "outputs", "offline");
const nodeVersion = "22.23.1";
const nodeBase = `https://nodejs.org/dist/v${nodeVersion}/`;
const textExtensions = new Set([".html", ".js", ".css", ".json", ".txt", ".svg", ".xml"]);
const remotePattern = /https:\/\/(?:images\.unsplash\.com|picsum\.photos)\/[^\s"'`<>\\)]+/g;
const hash = data => createHash("sha256").update(data).digest("hex");
const run = (command, args, options = {}) => execFileSync(command, args, { stdio: "inherit", ...options });

async function filesIn(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

async function download(url, destination) {
  await mkdir(dirname(destination), { recursive: true });
  // curl respects the workstation's proxy settings and retries transient failures.
  run("curl", ["--fail", "--location", "--silent", "--show-error", "--retry", "3", "--connect-timeout", "20", "--max-time", "240", url, "--output", destination]);
  return readFile(destination);
}

async function localizeImages(site) {
  const urls = new Set();
  for (const file of await filesIn(join(root, "app"))) {
    if (![".tsx", ".ts", ".css"].includes(extname(file))) continue;
    for (const match of (await readFile(file, "utf8")).matchAll(remotePattern)) {
      urls.add(match[0].replaceAll("&amp;", "&"));
    }
  }
  const replacements = [];
  for (const url of [...urls].sort()) {
    const name = hash(url).slice(0, 24) + ".jpg";
    const cached = join(cache, "images", name);
    let data;
    try { data = await readFile(cached); } catch { data = await download(url, cached); }
    // These providers deliver JPEG, PNG, WebP or AVIF. Do not package an error page.
    let extension;
    if (data[0] === 0xff && data[1] === 0xd8) extension = ".jpg";
    else if (data.subarray(1, 4).toString() === "PNG") extension = ".png";
    else if (data.subarray(8, 12).toString() === "WEBP") extension = ".webp";
    else if (data.subarray(4, 8).toString() === "ftyp") extension = ".avif";
    else throw new Error(`Image download is not an image: ${url}`);
    const local = `/offline-assets/${name.replace(/\.jpg$/, extension)}`;
    await mkdir(join(site, "offline-assets"), { recursive: true });
    await writeFile(join(site, local), data);
    replacements.push({ url, local, sha256: hash(data) });
    console.log(`Bundled image ${replacements.length}/${urls.size}`);
  }
  for (const file of await filesIn(site)) {
    if (!textExtensions.has(extname(file))) continue;
    const original = await readFile(file, "utf8");
    let updated = original;
    for (const { url, local } of replacements) {
      // React HTML attributes and embedded Flight payloads encode ampersands differently.
      for (const variant of [url, url.replaceAll("&", "&amp;"), url.replaceAll("&", "\\u0026"), url.replaceAll("&", "\\\\u0026")]) {
        updated = updated.replaceAll(variant, local);
      }
    }
    if (updated !== original) await writeFile(file, updated);
    if (/https:\/\/(?:images\.unsplash\.com|picsum\.photos)\//.test(updated)) {
      throw new Error(`Unbundled external image in ${file}`);
    }
  }
  const manifestPath = join(site, "game-image-manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  manifest.local = [...new Set([...manifest.local, ...replacements.map(item => item.local.slice(1))])];
  manifest.remote = [];
  manifest.count = manifest.local.length;
  for (const asset of manifest.local) await readFile(join(site, asset));
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  return replacements;
}

async function runtime(target, checksums) {
  const archive = `node-v${nodeVersion}-${target}.tar.gz`;
  const artifact = target === "win-x64" ? "win-x64/node.exe" : archive;
  const cached = join(cache, "node", artifact);
  let data;
  try { data = await readFile(cached); } catch { data = await download(nodeBase + artifact, cached); }
  const expected = checksums.split("\n").map(line => line.trim().split(/\s+/)).find(([, name]) => name === artifact)?.[0];
  if (!expected || hash(data) !== expected) throw new Error(`Node checksum mismatch: ${artifact}`);
  if (target === "win-x64") return { binary: cached, checksum: expected };
  const directory = join(cache, "node", target);
  await mkdir(directory, { recursive: true });
  run("tar", ["-xzf", cached, "-C", directory, "--strip-components=1", `node-v${nodeVersion}-${target}/bin/node`]);
  return { binary: join(directory, "bin", "node"), checksum: expected };
}

function readme(platform) {
  return `《嫁》离线版 — ${platform}\n\n` +
    `1. 完整解压 ZIP 到普通文件夹。不要直接在压缩包里启动，也不要单独移动启动文件。\n` +
    (platform === "Windows x64" ? `2. 双击“开始游戏.bat”。\n` : `2. 双击“开始游戏.command”。自动选择 Apple 芯片或 Intel 运行环境。\n`) +
    `3. 浏览器会自动打开游戏，整个游玩过程无需联网。启动窗口请保持打开。\n` +
    `4. 结束后关闭浏览器游戏标签，再关闭启动窗口（或按 Ctrl+C）。\n\n` +
    `如果浏览器没有自动打开，请访问 http://127.0.0.1:41739/ 。\n` +
    `请使用较新的 Chrome、Edge 或 Safari。程序不需要安装 Node.js 或 Python。\n` +
    `端口被占用时，请关闭此前的游戏启动窗口再试；不要更换地址或端口，以免切换存档。\n\n` +
    `存档说明\n` +
    `进度保存在当前浏览器的本地数据中，不在 ZIP 文件夹内。请始终使用同一浏览器和用户配置。\n` +
    `不要使用无痕模式或清除网站数据。在线版与离线版的存档相互独立，不会自动迁移。\n` +
    `更新时解压新版本、关闭旧版启动窗口，再启动新版即可沿用同一浏览器的离线存档。\n\n` +
    (platform === "macOS" ? `macOS 下载保护\n首次打开从网络下载的脚本时，系统可能要求确认。确认包来自可信来源后，可通过系统设置中的“隐私与安全性”处理对应提示。无需关闭系统保护。\n如提示没有执行权限，在终端输入 chmod +x 并将“开始游戏.command”拖入终端，回车后重试。\n\n` : "") +
    `其他\n游戏中的音乐署名、明星微博等外部链接需要联网；剧情、线索、图片和音乐均已包含在包内。\n音乐署名见 game/site/audio/bgm/ATTRIBUTION.md；运行环境授权见 game/NODE-LICENSE.txt。\n`;
}

await mkdir(cache, { recursive: true });
await mkdir(output, { recursive: true });
run(process.execPath, ["scripts/generate-image-preload-manifest.mjs"]);
run(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  env: { ...process.env, OFFLINE_BUILD: "true", GITHUB_PAGES: "false", NEXT_TELEMETRY_DISABLED: "1" },
});
const stage = join(cache, "site");
await rm(stage, { recursive: true, force: true });
await cp(join(root, "out"), stage, { recursive: true, filter: path => ![".DS_Store", ".nojekyll"].includes(path.split(/[\\/]/).at(-1)) });
const images = await localizeImages(stage);
const checksums = (await download(nodeBase + "SHASUMS256.txt", join(cache, "node", "SHASUMS256.txt"))).toString();
const license = await download(`https://raw.githubusercontent.com/nodejs/node/v${nodeVersion}/LICENSE`, join(cache, "node", "LICENSE"));
const revision = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
const dirty = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim().length > 0;
const packages = [];
for (const platform of ["Windows x64", "macOS"]) {
  const name = platform === "macOS" ? "JIA-Offline-macOS" : "JIA-Offline-Windows-x64";
  const folder = join(output, name);
  await rm(folder, { recursive: true, force: true });
  const game = join(folder, "game");
  await mkdir(join(game, "runtime"), { recursive: true });
  await cp(stage, join(game, "site"), { recursive: true });
  await cp(join(root, "scripts", "offline", "server.mjs"), join(game, "server.mjs"));
  await writeFile(join(game, "NODE-LICENSE.txt"), license);
  const runtimes = [];
  for (const target of platform === "macOS" ? ["darwin-arm64", "darwin-x64"] : ["win-x64"]) {
    const { binary, checksum } = await runtime(target, checksums);
    const destination = join(game, "runtime", target === "win-x64" ? "node.exe" : `node-${target}`);
    await cp(binary, destination);
    await chmod(destination, 0o755);
    runtimes.push({ target, version: nodeVersion, sha256: checksum });
  }
  if (platform === "macOS") {
    const launcher = join(folder, "开始游戏.command");
    await writeFile(launcher, `#!/bin/bash\ncd -- "$(dirname -- "$0")" || exit 1\ncase "$(uname -m)" in\n  arm64) runtime="node-darwin-arm64" ;;\n  x86_64) runtime="node-darwin-x64" ;;\n  *) echo "Unsupported Mac architecture"; read -r; exit 1 ;;\nesac\n./game/runtime/"$runtime" ./game/server.mjs\nstatus=$?\nif [ "$status" -ne 0 ]; then\n  echo "启动失败，请查看上方信息。Press Enter to close."\n  read -r\nfi\nexit "$status"\n`);
    await chmod(launcher, 0o755);
  } else {
    await writeFile(join(folder, "开始游戏.bat"), '@echo off\r\nsetlocal\r\ncd /d "%~dp0"\r\n"game\\runtime\\node.exe" "game\\server.mjs"\r\nif errorlevel 1 pause\r\n');
  }
  await writeFile(join(folder, "游玩说明.txt"), "\uFEFF" + readme(platform));
  await writeFile(join(game, "build-info.json"), JSON.stringify({ builtAt: new Date().toISOString(), revision, workingTreeModified: dirty, platform, runtimes, images }, null, 2) + "\n");
  const zip = join(output, `${name}.zip`);
  await rm(zip, { force: true });
  run("zip", ["-q", "-r", "-9", zip, name], { cwd: output });
  const data = await readFile(zip);
  packages.push({ file: `${name}.zip`, bytes: data.length, sha256: hash(data) });
  console.log(`Created ${name}.zip (${(data.length / 1024 / 1024).toFixed(1)} MiB)`);
}
await writeFile(join(output, "SHA256SUMS.txt"), packages.map(item => `${item.sha256}  ${item.file}`).join("\n") + "\n");
console.log(`Offline packages ready: ${output}`);
