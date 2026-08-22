import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [layout, toggle, translations, styles] = await Promise.all([
  readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/TranslationToggle.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/translation-map.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

test("root layout exposes the translation control on every route", () => {
  assert.match(layout, /<TranslationToggle\s*\/>/);
  assert.match(toggle, /翻译中文/);
  assert.match(toggle, /查看英文/);
  assert.match(toggle, /MutationObserver/);
  assert.match(toggle, /placeholder/);
  assert.match(toggle, /data-no-translate/);
});

test("hides the translation control throughout the opening presentation", () => {
  assert.match(styles, /body:has\(\.opening-gate\) \.global-translation-toggle/);
  assert.match(styles, /body:has\(\.opening-sequence\) \.global-translation-toggle\s*\{\s*display:none;/);
});

test("translation map covers every major English content surface", () => {
  const representativePhrases = [
    "CLICK TO BEGIN",
    "ENDING LOCKED",
    "Temporary Leave of Absence",
    "Verify your record",
    "A global research university where ideas cross disciplines, communities and borders.",
    "Dear Gu Pan, your request has been received.",
    "PRIVATE VIDEO INDEX",
    "Use the referral ID or bank draft number printed on the matching record.",
    "HENGMU FAMILY SERVICES",
    "Registered Student Organization · Privacy · Safeguarding · Contact",
  ];

  for (const phrase of representativePhrases) {
    assert.ok(translations.includes(JSON.stringify(phrase).slice(1, -1)), `missing translation for: ${phrase}`);
  }
});

test("case identifiers and account addresses are not rewritten", () => {
  for (const protectedValue of ["HM-2217", "YF-HQ-0214", "GP-221109", "safeguarding@yuanfan.example"]) {
    assert.doesNotMatch(translations, new RegExp(`^[ \\t]*${protectedValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*:`, "m"));
  }
});
