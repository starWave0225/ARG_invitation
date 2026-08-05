const basePath = "/ARG_invitation";
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
  "game-image-manifest.json",
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
const htmlEscapedQuotedRootPath = new RegExp(
  `(&(?:quot|#34|#x22|apos|#39|#x27);)/(${escapedRoots})(?=[/?#&]|$)`,
  "gi",
);
const unquotedCssPath = new RegExp(`(url\\(\\s*)/(${escapedRoots})(?=[/)'"]|$)`, "g");
const rootNavigationAttribute = /(\b(?:href|action)=)(["'])\/\2/g;
const rootNavigationProperty = /(\b(?:href|action):)(["'])\/\2/g;
const rootLocationCall = /(\b(?:window\.)?location\.assign\()(["'])\/\2/g;
const rootLocationAssignment = /(\b(?:window\.)?location\.href=)(["'])\/\2/g;

export function rewriteGitHubPagesPaths(original) {
  return original
    .replace(quotedRootPath, `$1${basePath}/$2`)
    .replace(htmlEscapedQuotedRootPath, `$1${basePath}/$2`)
    .replace(unquotedCssPath, `$1${basePath}/$2`)
    .replace(rootNavigationAttribute, `$1$2${basePath}/$2`)
    .replace(rootNavigationProperty, `$1$2${basePath}/$2`)
    .replace(rootLocationCall, `$1$2${basePath}/$2`)
    .replace(rootLocationAssignment, `$1$2${basePath}/$2`);
}
