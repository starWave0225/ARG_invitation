"use client";

import { useEffect, useMemo, useState } from "react";

const MANIFEST_URL = "/game-image-manifest.json";
const PRELOAD_CONCURRENCY = 6;
const IMAGE_TIMEOUT_MS = 30_000;

type ImageManifest = {
  version: number;
  count: number;
  local: string[];
  remote: string[];
};

export type ImagePreloadState = {
  loaded: number;
  failed: number;
  total: number;
  ready: boolean;
  progress: number;
};

const initialState:ImagePreloadState = {
  loaded: 0,
  failed: 0,
  total: 0,
  ready: false,
  progress: 0,
};

function preloadImage(url:string) {
  return new Promise<boolean>(resolve => {
    const image = new Image();
    let settled = false;

    const finish = (success:boolean) => {
      if(settled)return;
      settled = true;
      window.clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      resolve(success);
    };
    const timeout = window.setTimeout(() => finish(false), IMAGE_TIMEOUT_MS);

    image.decoding = "async";
    image.onload = () => finish(true);
    image.onerror = () => finish(false);
    image.src = url;
  });
}

function resolveManifestAssets(manifest:ImageManifest) {
  const manifestUrl = new URL(MANIFEST_URL, window.location.origin);
  const assetRoot = new URL(".", manifestUrl);
  const local = manifest.local.map(path => new URL(path, assetRoot).href);
  return [...local, ...manifest.remote];
}

export function useGameImagePreloader():ImagePreloadState {
  const [state,setState] = useState<ImagePreloadState>(initialState);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      try {
        const response = await fetch(MANIFEST_URL, {
          cache: "force-cache",
          signal: controller.signal,
        });
        if(!response.ok)throw new Error(`Image manifest returned ${response.status}`);

        const manifest = await response.json() as ImageManifest;
        const assets = resolveManifestAssets(manifest);
        if(cancelled)return;
        setState({...initialState,total:assets.length});

        let cursor = 0;
        const worker = async () => {
          while(!cancelled) {
            const index = cursor;
            cursor += 1;
            if(index>=assets.length)return;

            const success = await preloadImage(assets[index]);
            if(cancelled)return;
            setState(previous => {
              const loaded = previous.loaded + (success?1:0);
              const failed = previous.failed + (success?0:1);
              const settled = loaded + failed;
              return {
                loaded,
                failed,
                total: assets.length,
                ready: settled>=assets.length,
                progress: assets.length?Math.round(settled/assets.length*100):100,
              };
            });
          }
        };

        if(!assets.length) {
          setState({...initialState,ready:true,progress:100});
          return;
        }

        await Promise.all(Array.from(
          {length:Math.min(PRELOAD_CONCURRENCY,assets.length)},
          () => worker(),
        ));
      } catch(error) {
        if(cancelled||controller.signal.aborted)return;
        console.warn("Game image preloading could not start.",error);
        setState({...initialState,failed:1,ready:true,progress:100});
      }
    };

    void run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  },[]);

  return useMemo(() => state,[state]);
}
