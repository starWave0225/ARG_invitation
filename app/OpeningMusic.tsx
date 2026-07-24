"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const OPENING_VOLUME = 0.62;
const MENU_VOLUME = 0.28;
const MUSIC_CUT_AT_MS = 19600;
const MUSIC_CUT_TARGET_SECONDS = 70.06;
const DESKTOP_HOLD_MS = 4000;
const DESKTOP_FADE_MS = 8000;

export default function OpeningMusic() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimer = useRef<number | null>(null);
  const cueTimer = useRef<number | null>(null);

  useEffect(() => {
    const clearFade = () => {
      if (fadeTimer.current !== null) {
        window.clearInterval(fadeTimer.current);
        fadeTimer.current = null;
      }
    };
    const clearCue = () => {
      if (cueTimer.current !== null) {
        window.clearTimeout(cueTimer.current);
        cueTimer.current = null;
      }
    };
    const fadeTo = (audio: HTMLAudioElement, target: number, duration: number) => {
      clearFade();
      const startedAt = performance.now();
      const startingVolume = audio.volume;
      fadeTimer.current = window.setInterval(() => {
        const progress = Math.min((performance.now() - startedAt) / duration, 1);
        audio.volume = startingVolume + (target - startingVolume) * progress;
        if (progress >= 1) clearFade();
      }, 25);
    };

    const playOpening = () => {
      const audio = audioRef.current;
      if (!audio) return;
      clearCue();
      clearFade();
      audio.currentTime = 0;
      audio.volume = OPENING_VOLUME;
      void audio.play().catch(() => {});
      cueTimer.current = window.setTimeout(() => {
        cueTimer.current = null;
        fadeTo(audio, 0, 400);
        cueTimer.current = window.setTimeout(() => {
          cueTimer.current = null;
          audio.currentTime = MUSIC_CUT_TARGET_SECONDS;
          fadeTo(audio, OPENING_VOLUME, 450);
        }, 400);
      }, MUSIC_CUT_AT_MS);
    };

    const enterMenu = () => {
      const audio = audioRef.current;
      if (!audio || audio.paused) return;
      clearCue();
      fadeTo(audio, MENU_VOLUME, 1200);
    };

    window.addEventListener("jia-opening-music-play", playOpening);
    window.addEventListener("jia-opening-music-menu", enterMenu);
    return () => {
      window.removeEventListener("jia-opening-music-play", playOpening);
      window.removeEventListener("jia-opening-music-menu", enterMenu);
      clearCue();
      clearFade();
    };
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/computer/")) return;
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    const holdTimer = window.setTimeout(() => {
      const startedAt = performance.now();
      const startingVolume = audio.volume;
      fadeTimer.current = window.setInterval(() => {
        const progress = Math.min((performance.now() - startedAt) / DESKTOP_FADE_MS, 1);
        audio.volume = startingVolume * (1 - progress);
        if (progress >= 1) {
          if (fadeTimer.current !== null) window.clearInterval(fadeTimer.current);
          fadeTimer.current = null;
          audio.pause();
          audio.currentTime = 0;
          audio.volume = OPENING_VOLUME;
        }
      }, 100);
    }, DESKTOP_HOLD_MS);

    return () => {
      window.clearTimeout(holdTimer);
      if (fadeTimer.current !== null) {
        window.clearInterval(fadeTimer.current);
        fadeTimer.current = null;
      }
    };
  }, [pathname]);

  return <audio ref={audioRef} src="/audio/opening-theme.mp3" preload="auto" />;
}
