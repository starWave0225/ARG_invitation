export const DEFAULT_MASTER_VOLUME = 0.45;
export const MUSIC_KEYS = ["arg-music-volume", "arg-music-muted", "arg-music-last-volume"];
type MusicStorage = Pick<Storage, "getItem" | "setItem">;

export function readMusicSettings(storage: MusicStorage) {
  const parse = (key: string, fallback: number) => {
    const raw = storage.getItem(key);
    const value = raw === null || raw.trim() === "" ? NaN : Number(raw);
    return Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : fallback;
  };
  const volume = parse(MUSIC_KEYS[0], DEFAULT_MASTER_VOLUME);
  const lastVolume = parse(MUSIC_KEYS[2], DEFAULT_MASTER_VOLUME) || DEFAULT_MASTER_VOLUME;
  return { volume, muted: storage.getItem(MUSIC_KEYS[1]) === "true", lastVolume };
}

export function changeMusicVolume(storage: MusicStorage, value: number) {
  const previous = readMusicSettings(storage);
  const volume = Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : previous.volume;
  if (previous.volume > 0) storage.setItem(MUSIC_KEYS[2], String(previous.volume));
  if (volume > 0) storage.setItem(MUSIC_KEYS[2], String(volume));
  storage.setItem(MUSIC_KEYS[0], String(volume));
  storage.setItem(MUSIC_KEYS[1], String(volume === 0));
  return readMusicSettings(storage);
}

export function toggleMusicMuted(storage: MusicStorage) {
  const settings = readMusicSettings(storage);
  if (settings.muted || settings.volume === 0) {
    return changeMusicVolume(storage, settings.volume || settings.lastVolume);
  }
  storage.setItem(MUSIC_KEYS[2], String(settings.volume));
  storage.setItem(MUSIC_KEYS[1], "true");
  return readMusicSettings(storage);
}
