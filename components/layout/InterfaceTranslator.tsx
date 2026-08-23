"use client";

import { useEffect } from "react";
import {
  interfaceTranslations,
  type InterfaceLanguage,
} from "@/content/interface-translations";

const originals = new WeakMap<Text, string>();
const appliedValues = new WeakMap<Text, string>();

function translateDocument(language: InterfaceLanguage) {
  const dictionary = language === "en" ? null : interfaceTranslations[language];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    const textNode = current as Text;
    const parent = textNode.parentElement;
    if (parent && !["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parent.tagName)) {
      const currentValue = textNode.nodeValue ?? "";
      const previousApplied = appliedValues.get(textNode);
      let stored = originals.get(textNode) ?? currentValue;

      if (
        originals.has(textNode) &&
        previousApplied !== undefined &&
        currentValue !== previousApplied
      ) {
        stored = currentValue;
        originals.set(textNode, currentValue);
      } else if (!originals.has(textNode)) {
        originals.set(textNode, stored);
      }
      const trimmed = stored.trim();
      const translated = dictionary?.[trimmed] ?? trimmed;
      const leading = stored.match(/^\s*/)?.[0] ?? "";
      const trailing = stored.match(/\s*$/)?.[0] ?? "";
      const nextValue = trimmed ? `${leading}${translated}${trailing}` : stored;
      if (textNode.nodeValue !== nextValue) textNode.nodeValue = nextValue;
      appliedValues.set(textNode, nextValue);
    }
    current = walker.nextNode();
  }

  for (const element of document.querySelectorAll<HTMLElement>("[placeholder]")) {
    const original = element.dataset.originalPlaceholder ?? element.getAttribute("placeholder") ?? "";
    element.dataset.originalPlaceholder = original;
    element.setAttribute("placeholder", dictionary?.[original] ?? original);
  }
}

export function InterfaceTranslator() {
  useEffect(() => {
    let language = (window.localStorage.getItem("umang-language") ?? "en") as InterfaceLanguage;
    if (!(["en", "hi", "kn"] as const).includes(language)) language = "en";

    const apply = () => {
      document.documentElement.lang = language;
      translateDocument(language);
    };
    const onLanguage = (event: Event) => {
      language = (event as CustomEvent<InterfaceLanguage>).detail;
      apply();
    };
    const observer = new MutationObserver(() => window.requestAnimationFrame(apply));

    apply();
    window.addEventListener("umang-language", onLanguage);
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("umang-language", onLanguage);
    };
  }, []);

  return null;
}
