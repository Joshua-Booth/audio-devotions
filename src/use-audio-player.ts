import { useCallback, useEffect, useRef, useState } from "react";

import { type Devotion, getDevotions } from "./sources";

// A real .wav file, so ReactPlayer keeps rendering an <audio> element for it
const KEEP_ALIVE_SILENCE = "/silence.wav";

const isSameDay = (a?: Devotion, b?: Devotion) =>
  a?.date.toDateString() === b?.date.toDateString();

export function useAudioPlayer() {
  const [devotions, setDevotions] = useState(() => getDevotions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [url, setUrl] = useState(devotions[0]?.url);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(Number.NaN);
  const [errored, setErrored] = useState(false);

  const playerRef = useRef<HTMLVideoElement | null>(null);

  // Derived values
  const { name: title, date } = devotions[currentIndex]!;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < devotions.length - 1;

  const reset = useCallback((newUrl: string) => {
    setUrl(newUrl);
    setCurrentTime(0);
    setDuration(Number.NaN);
    setErrored(false);
  }, []);

  const load = useCallback(
    (index: number) => {
      const newUrl = devotions[index]?.url;
      if (!newUrl) return;
      setCurrentIndex(index);
      reset(newUrl);
    },
    [devotions, reset]
  );

  const handleError = useCallback(() => {
    setErrored(true);
    setCurrentTime(0);
    setDuration(Number.NaN);
    setUrl(KEEP_ALIVE_SILENCE);
  }, []);

  // ReactPlayer renders its <audio> inside Suspense, so it can start loading
  // (and fire loadedmetadata or error) before React is listening. Catch up
  // with the element once it's attached.
  const attachPlayer = useCallback(
    (node: HTMLVideoElement | null) => {
      playerRef.current = node;
      if (!node) return;
      if (node.error) {
        handleError();
      } else if (Number.isFinite(node.duration)) {
        setDuration(node.duration);
      }
    },
    [handleError]
  );

  useEffect(() => {
    const moveToNewDay = () => {
      if (document.visibilityState !== "visible" || playing) return;
      const today = getDevotions();
      if (isSameDay(today[0], devotions[0])) return;
      setDevotions(today);
      const newUrl = today[currentIndex]?.url;
      if (newUrl) reset(newUrl);
    };
    document.addEventListener("visibilitychange", moveToNewDay);
    return () => document.removeEventListener("visibilitychange", moveToNewDay);
  }, [playing, devotions, currentIndex, reset]);

  const togglePlay = () => {
    if (!errored) setPlaying((prev) => !prev);
  };

  const stop = () => {
    setPlaying(false);
    if (playerRef.current) playerRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const seekTo = useCallback((seconds: number) => {
    const player = playerRef.current;
    if (!player || !Number.isFinite(player.duration)) return;
    const clamped = Math.min(Math.max(seconds, 0), player.duration);
    player.currentTime = clamped;
    setCurrentTime(clamped);
  }, []);

  const skipBy = (delta: number) =>
    seekTo((playerRef.current?.currentTime ?? 0) + delta);

  const previous = useCallback(
    () => load(currentIndex - 1),
    [currentIndex, load]
  );
  const next = useCallback(() => load(currentIndex + 1), [currentIndex, load]);

  const readDuration = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const { duration } = e.target as HTMLVideoElement;
    if (!errored && Number.isFinite(duration)) setDuration(duration);
  };

  const keepingAlive = url === KEEP_ALIVE_SILENCE;

  const playerProps = {
    src: url,
    playing: keepingAlive || playing,
    loop: keepingAlive,
    preload: "metadata",
    onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (!errored) setCurrentTime((e.target as HTMLVideoElement).currentTime);
    },
    onDurationChange: readDuration,
    onLoadedMetadata: readDuration,
    // Follow the element, so a recording stops when it ends (instead of
    // ReactPlayer restarting it) and pausing from headphones sticks
    onPlay: () => {
      if (!errored) setPlaying(true);
    },
    onPause: () => {
      if (!errored) setPlaying(false);
    },
    onError: () => {
      if (keepingAlive) return;
      console.warn(`[Audio Devotions] Failed to load: ${title}`, url);
      handleError();
    },
  };

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: "Audio Devotions",
    });

    navigator.mediaSession.setActionHandler(
      "play",
      errored ? null : () => setPlaying(true)
    );
    navigator.mediaSession.setActionHandler(
      "pause",
      errored ? null : () => setPlaying(false)
    );
    navigator.mediaSession.setActionHandler("nexttrack", hasNext ? next : null);
    navigator.mediaSession.setActionHandler(
      "previoustrack",
      hasPrevious ? previous : null
    );

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
    };
  }, [title, errored, hasNext, hasPrevious, next, previous]);

  return {
    attachPlayer,
    playerProps,
    title,
    date,
    playing,
    currentTime,
    duration,
    errored,
    hasPrevious,
    hasNext,
    togglePlay,
    stop,
    previous,
    next,
    seekTo,
    skipBy,
  };
}
