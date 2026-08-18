"use client";

import { useEffect, useRef, useState } from "react";
import { translateEnglishText } from "./translation-map";

const preferenceKey = "jia-translation-zh";
const blockedTags = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA"]);

export default function TranslationToggle() {
  const [translated, setTranslated] = useState(false);
  const originalText = useRef(new WeakMap<Text, string>()).current;
  const translatedText = useRef(new WeakMap<Text, string>()).current;
  const originalAttributes = useRef(new WeakMap<Element, Map<string, string>>()).current;
  const translatedAttributes = useRef(new WeakMap<Element, Map<string, string>>()).current;

  useEffect(() => {
    setTranslated(window.localStorage.getItem(preferenceKey) === "true");
  }, []);

  useEffect(() => {
    const root = document.body;

    const isBlocked = (node: Node) => {
      const parent = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
      return !parent || blockedTags.has(parent.tagName) || Boolean(parent.closest("[data-translation-control], [data-no-translate]"));
    };

    const translateNode = (node: Text) => {
      if (isBlocked(node)) return;
      const current = node.nodeValue ?? "";
      if (translatedText.get(node) === current) return;
      const next = translateEnglishText(current);
      if (next === current) return;
      originalText.set(node, current);
      translatedText.set(node, next);
      node.nodeValue = next;
    };

    const translateAttributes = (element: Element) => {
      if (isBlocked(element)) return;
      const originals = originalAttributes.get(element) ?? new Map<string, string>();
      const applied = translatedAttributes.get(element) ?? new Map<string, string>();
      for (const attribute of ["alt", "placeholder", "title", "aria-label"]) {
        const current = element.getAttribute(attribute);
        if (!current) continue;
        if (applied.get(attribute) === current) continue;
        const next = translateEnglishText(current);
        if (next === current) continue;
        originals.set(attribute, current);
        applied.set(attribute, next);
        element.setAttribute(attribute, next);
      }
      if (originals.size) originalAttributes.set(element, originals);
      if (applied.size) translatedAttributes.set(element, applied);
    };

    const visit = (scope: Node) => {
      if (scope.nodeType === Node.TEXT_NODE) {
        translateNode(scope as Text);
        return;
      }
      if (scope.nodeType !== Node.ELEMENT_NODE || isBlocked(scope)) return;
      translateAttributes(scope as Element);
      const walker = document.createTreeWalker(scope, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      let current = walker.nextNode();
      while (current) {
        if (current.nodeType === Node.TEXT_NODE) translateNode(current as Text);
        else translateAttributes(current as Element);
        current = walker.nextNode();
      }
    };

    const restore = () => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      let current: Node | null = root;
      while (current) {
        if (current.nodeType === Node.TEXT_NODE) {
          const text = current as Text;
          const original = originalText.get(text);
          if (original !== undefined && translatedText.get(text) === text.nodeValue) text.nodeValue = original;
        } else {
          const element = current as Element;
          const attributes = originalAttributes.get(element);
          const applied = translatedAttributes.get(element);
          attributes?.forEach((value, attribute) => {
            if (applied?.get(attribute) === element.getAttribute(attribute)) element.setAttribute(attribute, value);
          });
        }
        current = walker.nextNode();
      }
    };

    if (!translated) {
      window.localStorage.setItem(preferenceKey, "false");
      return restore;
    }

    window.localStorage.setItem(preferenceKey, "true");
    visit(root);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") translateNode(mutation.target as Text);
        if (mutation.type === "attributes") translateAttributes(mutation.target as Element);
        mutation.addedNodes.forEach(visit);
      }
    });
    observer.observe(root, {
      attributeFilter: ["alt", "placeholder", "title", "aria-label"],
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [originalAttributes, originalText, translated, translatedAttributes, translatedText]);

  return (
    <button
      type="button"
      className={`global-translation-toggle ${translated ? "active" : ""}`}
      aria-pressed={translated}
      onClick={() => setTranslated((value) => !value)}
      data-translation-control
    >
      <span aria-hidden="true">{translated ? "英" : "译"}</span>
      {translated ? "查看英文" : "翻译中文"}
    </button>
  );
}
