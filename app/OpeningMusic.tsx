"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MUSIC_CUT_AT_MS = 19600;
const MUSIC_CUT_TARGET_SECONDS = 70.06;
const DESKTOP_HOLD_MS = 4000;
const DESKTOP_FADE_MS = 8000;
const BGM_CROSSFADE_MS = 1800;
const DEFAULT_MASTER_VOLUME = 0.45;
const VOLUME_STORAGE_KEY = "arg-music-volume";
const MUTED_STORAGE_KEY = "arg-music-muted";
const PLAYBACK_CHANNEL = "arg-bgm-playback-owner";
const ENDING_PRIORITY_EVENT = "jia-ending-music-priority";

const tracks = {
  investigation: {
    title: "Intervention",
    context: "沈望电脑",
    src: "/audio/bgm/investigation.mp3",
    page: "https://www.scottbuckley.com.au/library/intervention/",
    gain: 0.4,
  },
  "second-chance": {
    title: "Signal to Noise",
    context: "刘涵电脑",
    src: "/audio/bgm/second-chance.mp3",
    page: "https://www.scottbuckley.com.au/library/signal-to-noise/",
    gain: 0.38,
  },
} as const;

type TrackKey = keyof typeof tracks;

function trackForPath(pathname: string): TrackKey | null {
  if (pathname.startsWith("/computer/liuhan")) return "second-chance";
  if (pathname.startsWith("/computer/shen")) return "investigation";
  return null;
}

export default function OpeningMusic() {
  const pathname = usePathname();
  const openingRef = useRef<HTMLAudioElement | null>(null);
  const deckARef = useRef<HTMLAudioElement | null>(null);
  const deckBRef = useRef<HTMLAudioElement | null>(null);
  const activeDeckRef = useRef<0 | 1>(0);
  const currentTrackRef = useRef<TrackKey | null>(null);
  const desiredTrackRef = useRef<TrackKey | null>(null);
  const playheadRef = useRef<Partial<Record<TrackKey, number>>>({});
  const playbackChannelRef = useRef<BroadcastChannel | null>(null);
  const tabIdRef = useRef("");
  const openingFadeTimer = useRef<number | null>(null);
  const bgmFadeTimer = useRef<number | null>(null);
  const cueTimer = useRef<number | null>(null);
  const routeTimer = useRef<number | null>(null);
  const openingPhaseRef = useRef<"idle" | "opening" | "menu" | "fading">("idle");
  const [masterVolume, setMasterVolume] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_MASTER_VOLUME;
    const stored = window.localStorage.getItem(VOLUME_STORAGE_KEY);
    if (stored === null) return DEFAULT_MASTER_VOLUME;
    const saved = Number(stored);
    return Number.isFinite(saved) ? Math.min(Math.max(saved, 0), 1) : DEFAULT_MASTER_VOLUME;
  });
  const [muted, setMuted] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem(MUTED_STORAGE_KEY) === "true"
  );
  const masterVolumeRef = useRef(masterVolume);
  const mutedRef = useRef(muted);
  const [currentTrack, setCurrentTrack] = useState<TrackKey | null>(null);
  const [openingActive, setOpeningActive] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);

  const decks = useCallback(
    () => [deckARef.current, deckBRef.current] as const,
    []
  );

  const clearOpeningFade = useCallback(() => {
    if (openingFadeTimer.current !== null) {
      window.clearInterval(openingFadeTimer.current);
      openingFadeTimer.current = null;
    }
  }, []);

  const clearBgmFade = useCallback(() => {
    if (bgmFadeTimer.current !== null) {
      window.clearInterval(bgmFadeTimer.current);
      bgmFadeTimer.current = null;
    }
  }, []);

  const clearCue = useCallback(() => {
    if (cueTimer.current !== null) {
      window.clearTimeout(cueTimer.current);
      cueTimer.current = null;
    }
  }, []);

  const clearRouteTimer = useCallback(() => {
    if (routeTimer.current !== null) {
      window.clearTimeout(routeTimer.current);
      routeTimer.current = null;
    }
  }, []);

  const trackVolume = useCallback((key: TrackKey) => {
    if (mutedRef.current) return 0;
    return Math.min(masterVolumeRef.current * tracks[key].gain, 1);
  }, []);

  const openingVolume = useCallback((phase: "opening" | "menu") => {
    if (mutedRef.current) return 0;
    const gain = phase === "opening" ? 1.25 : 0.56;
    return Math.min(masterVolumeRef.current * gain, 1);
  }, []);

  const claimPlayback = useCallback(() => {
    if (!tabIdRef.current) return;
    playbackChannelRef.current?.postMessage({ type: "claim", tabId: tabIdRef.current });
  }, []);

  const fadeOpeningTo = useCallback(
    (target: number, duration: number, onDone?: () => void) => {
      const audio = openingRef.current;
      if (!audio) return;
      clearOpeningFade();
      const startedAt = performance.now();
      const startingVolume = audio.volume;
      openingFadeTimer.current = window.setInterval(() => {
        const progress = Math.min((performance.now() - startedAt) / duration, 1);
        audio.volume = startingVolume + (target - startingVolume) * progress;
        if (progress >= 1) {
          clearOpeningFade();
          onDone?.();
        }
      }, 40);
    },
    [clearOpeningFade]
  );

  const startTrack = useCallback(
    (key: TrackKey, instant = false) => {
      desiredTrackRef.current = key;
      setPlayerVisible(true);
      setOpeningActive(false);
      setCurrentTrack(key);
      claimPlayback();

      const deckList = decks();
      const currentKey = currentTrackRef.current;
      if (currentKey === key) {
        const active = deckList[activeDeckRef.current];
        if (!active) return;
        active.volume = trackVolume(key);
        void active.play().catch(() => {});
        return;
      }

      clearBgmFade();
      const outgoingIndex = activeDeckRef.current;
      const incomingIndex = currentKey === null ? outgoingIndex : outgoingIndex === 0 ? 1 : 0;
      const outgoing = currentKey === null ? null : deckList[outgoingIndex];
      const incoming = deckList[incomingIndex];
      if (!incoming) return;

      if (outgoing && currentKey) playheadRef.current[currentKey] = outgoing.currentTime;
      const outgoingStart = outgoing?.volume ?? 0;
      const target = trackVolume(key);
      const resumeAt = playheadRef.current[key] ?? 0;
      incoming.src = tracks[key].src;
      incoming.loop = true;
      incoming.volume = instant ? target : 0;
      incoming.load();
      const beginPlayback = () => {
        if (resumeAt > 0 && Number.isFinite(incoming.duration)) {
          incoming.currentTime = Math.min(resumeAt, Math.max(incoming.duration - 0.1, 0));
        }
        void incoming.play().catch(() => {});
      };
      if (incoming.readyState >= 1) beginPlayback();
      else incoming.addEventListener("loadedmetadata", beginPlayback, { once: true });

      activeDeckRef.current = incomingIndex;
      currentTrackRef.current = key;

      if (instant || !outgoing) {
        incoming.volume = target;
        if (outgoing && outgoing !== incoming) outgoing.pause();
        return;
      }

      const startedAt = performance.now();
      bgmFadeTimer.current = window.setInterval(() => {
        const progress = Math.min((performance.now() - startedAt) / BGM_CROSSFADE_MS, 1);
        incoming.volume = trackVolume(key) * progress;
        outgoing.volume = mutedRef.current ? 0 : outgoingStart * (1 - progress);
        if (progress >= 1) {
          clearBgmFade();
          outgoing.pause();
          outgoing.removeAttribute("src");
          outgoing.load();
        }
      }, 40);
    },
    [claimPlayback, clearBgmFade, decks, trackVolume]
  );

  const stopBgm = useCallback(
    (duration = 700) => {
      desiredTrackRef.current = null;
      clearRouteTimer();
      clearBgmFade();
      const active = decks()[activeDeckRef.current];
      const currentKey = currentTrackRef.current;
      if (active && currentKey) playheadRef.current[currentKey] = active.currentTime;
      currentTrackRef.current = null;
      setCurrentTrack(null);
      if (!active || active.paused) return;
      const startingVolume = active.volume;
      const startedAt = performance.now();
      bgmFadeTimer.current = window.setInterval(() => {
        const progress = Math.min((performance.now() - startedAt) / duration, 1);
        active.volume = startingVolume * (1 - progress);
        if (progress >= 1) {
          clearBgmFade();
          active.pause();
        }
      }, 40);
    },
    [clearBgmFade, clearRouteTimer, decks]
  );

  const queueTrack = useCallback(
    (key: TrackKey, delay = 0) => {
      desiredTrackRef.current = key;
      clearRouteTimer();
      if (delay <= 0) {
        startTrack(key);
        return;
      }
      setPlayerVisible(true);
      routeTimer.current = window.setTimeout(() => {
        routeTimer.current = null;
        startTrack(key);
      }, delay);
    },
    [clearRouteTimer, startTrack]
  );

  const suspendForEnding = useCallback(() => {
    clearCue();
    clearOpeningFade();
    clearBgmFade();
    clearRouteTimer();
    desiredTrackRef.current = null;

    const currentKey = currentTrackRef.current;
    const active = decks()[activeDeckRef.current];
    if (currentKey && active) playheadRef.current[currentKey] = active.currentTime;
    decks().forEach((deck) => deck?.pause());
    currentTrackRef.current = null;
    setCurrentTrack(null);

    const opening = openingRef.current;
    if (opening) opening.pause();
    openingPhaseRef.current = "idle";
    setOpeningActive(false);
    setPlayerVisible(false);
  }, [
    clearBgmFade,
    clearCue,
    clearOpeningFade,
    clearRouteTimer,
    decks,
  ]);

  useEffect(() => {
    tabIdRef.current = window.crypto.randomUUID();
    const channel = "BroadcastChannel" in window ? new BroadcastChannel(PLAYBACK_CHANNEL) : null;
    playbackChannelRef.current = channel;
    if (channel) {
      channel.onmessage = (event: MessageEvent<{ type?: string; tabId?: string }>) => {
        if (
          !["claim", "ending-claim"].includes(event.data?.type ?? "") ||
          event.data.tabId === tabIdRef.current
        ) return;
        clearBgmFade();
        const currentKey = currentTrackRef.current;
        const active = decks()[activeDeckRef.current];
        if (currentKey && active) playheadRef.current[currentKey] = active.currentTime;
        decks().forEach((deck) => deck?.pause());
        openingRef.current?.pause();
      };
    }

    const playOpening = () => {
      const audio = openingRef.current;
      if (!audio) return;
      stopBgm(250);
      clearCue();
      clearOpeningFade();
      openingPhaseRef.current = "opening";
      setOpeningActive(true);
      setPlayerVisible(true);
      audio.currentTime = 0;
      audio.volume = openingVolume("opening");
      void audio.play().catch(() => {});
      cueTimer.current = window.setTimeout(() => {
        cueTimer.current = null;
        fadeOpeningTo(0, 400, () => {
          audio.currentTime = MUSIC_CUT_TARGET_SECONDS;
          fadeOpeningTo(openingVolume("opening"), 450);
        });
      }, MUSIC_CUT_AT_MS);
    };

    const enterMenu = () => {
      const audio = openingRef.current;
      if (!audio || audio.paused) return;
      clearCue();
      openingPhaseRef.current = "menu";
      setOpeningActive(true);
      fadeOpeningTo(openingVolume("menu"), 1200);
    };

    const resumeAudio = () => {
      const desired = desiredTrackRef.current;
      if (desired) startTrack(desired);
    };

    window.addEventListener("jia-opening-music-play", playOpening);
    window.addEventListener("jia-opening-music-menu", enterMenu);
    window.addEventListener(ENDING_PRIORITY_EVENT, suspendForEnding);
    window.addEventListener("focus", resumeAudio);
    document.addEventListener("pointerdown", resumeAudio);
    document.addEventListener("keydown", resumeAudio);
    return () => {
      window.removeEventListener("jia-opening-music-play", playOpening);
      window.removeEventListener("jia-opening-music-menu", enterMenu);
      window.removeEventListener(ENDING_PRIORITY_EVENT, suspendForEnding);
      window.removeEventListener("focus", resumeAudio);
      document.removeEventListener("pointerdown", resumeAudio);
      document.removeEventListener("keydown", resumeAudio);
      channel?.close();
      playbackChannelRef.current = null;
      clearCue();
      clearOpeningFade();
      clearBgmFade();
      clearRouteTimer();
    };
  }, [
    clearBgmFade,
    clearCue,
    clearOpeningFade,
    clearRouteTimer,
    decks,
    fadeOpeningTo,
    openingVolume,
    startTrack,
    stopBgm,
    suspendForEnding,
  ]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (pathname.startsWith("/ending/")) {
        suspendForEnding();
        return;
      }
      const routeTrack = trackForPath(pathname);
      if (!routeTrack) {
        stopBgm();
        return;
      }
      const opening = openingRef.current;
      const delay = pathname.startsWith("/computer/") && opening && !opening.paused ? 5600 : 0;
      queueTrack(routeTrack, delay);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, queueTrack, stopBgm, suspendForEnding]);

  useEffect(() => {
    if (!pathname.startsWith("/computer/")) return;
    const audio = openingRef.current;
    if (!audio || audio.paused) return;
    const holdTimer = window.setTimeout(() => {
      openingPhaseRef.current = "fading";
      fadeOpeningTo(0, DESKTOP_FADE_MS, () => {
        audio.pause();
        audio.currentTime = 0;
        openingPhaseRef.current = "idle";
        setOpeningActive(false);
      });
    }, DESKTOP_HOLD_MS);
    return () => window.clearTimeout(holdTimer);
  }, [fadeOpeningTo, pathname]);

  const setVolume = (value: number) => {
    const next = Math.min(Math.max(value, 0), 1);
    masterVolumeRef.current = next;
    setMasterVolume(next);
    window.localStorage.setItem(VOLUME_STORAGE_KEY, String(next));
    const opening = openingRef.current;
    const phase = openingPhaseRef.current;
    if (opening && phase !== "idle" && phase !== "fading") {
      opening.volume = openingVolume(phase);
    }
    const key = currentTrackRef.current;
    const active = decks()[activeDeckRef.current];
    if (key && active) active.volume = trackVolume(key);
  };

  const toggleMuted = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    window.localStorage.setItem(MUTED_STORAGE_KEY, String(next));
    const opening = openingRef.current;
    const phase = openingPhaseRef.current;
    if (opening && phase !== "idle" && phase !== "fading") {
      opening.volume = openingVolume(phase);
    }
    const key = currentTrackRef.current;
    const active = decks()[activeDeckRef.current];
    if (key && active) active.volume = trackVolume(key);
  };

  const activeMeta = currentTrack ? tracks[currentTrack] : null;
  const displayTitle = activeMeta?.title ?? (openingActive ? "《嫁》片头主题" : "游戏配乐");
  const displayContext = activeMeta?.context ?? (openingActive ? "片头" : "待机");

  return (
    <>
      <audio ref={openingRef} src="/audio/opening-theme.mp3" preload="auto" />
      <audio ref={deckARef} preload="none" />
      <audio ref={deckBRef} preload="none" />
      {playerVisible && !pathname.startsWith("/ending/") && (
        <aside className={`bgm-player ${panelOpen ? "open" : ""}`} aria-label="背景音乐控制">
          {panelOpen && (
            <section className="bgm-panel">
              <small>NOW PLAYING · {displayContext}</small>
              <b>{displayTitle}</b>
              {activeMeta ? (
                <>
                  <span>Scott Buckley · CC BY 4.0</span>
                  <a href={activeMeta.page} target="_blank" rel="noopener noreferrer">
                    曲目与授权信息 ↗
                  </a>
                </>
              ) : (
                <span>为获得完整体验，建议使用耳机</span>
              )}
              <label>
                <span>音量</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(masterVolume * 100)}
                  onChange={(event) => setVolume(Number(event.target.value) / 100)}
                  aria-label="背景音乐音量"
                />
                <em>{Math.round(masterVolume * 100)}%</em>
              </label>
            </section>
          )}
          <div>
            <button
              type="button"
              className="bgm-mute"
              onClick={toggleMuted}
              aria-label={muted ? "恢复背景音乐" : "静音背景音乐"}
              title={muted ? "恢复背景音乐" : "静音背景音乐"}
            >
              {muted ? "×" : "♫"}
            </button>
            <button
              type="button"
              className="bgm-current"
              onClick={() => setPanelOpen((value) => !value)}
              aria-expanded={panelOpen}
            >
              <span>{displayContext}</span>
              <b>{displayTitle}</b>
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
