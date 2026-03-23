import { useCallback, useEffect, useRef, useState } from "react";

import {
  getDate,
  getDelayedSourceNames,
  getSourceNames,
  getSources,
} from "./sources";

const SILENT_AUDIO =
  "data:audio/wav;base64,UklGRiUAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQEAAACA";

export function useAudioPlayer() {
  const [urls] = useState<string[] | null>(getSources);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [url, setUrl] = useState<string | null>(urls?.[0] ?? null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [errored, setErrored] = useState(false);

  const seekingRef = useRef(false);
  const playerRef = useRef<HTMLVideoElement | null>(null);

  // Derived values
  const showForward = urls !== null && currentIndex < urls.length - 1;
  const showBackward = currentIndex > 0;
  const title = getSourceNames()[currentIndex] ?? "";

  const dateTitle = (() => {
    const { date, year, dayBehindMonth, dayBehindToday } = getDate();
    const sourceNames = getSourceNames();
    const delayedSourceNames = getDelayedSourceNames();

    const sourceName = sourceNames[currentIndex];
    if (sourceName && delayedSourceNames.includes(sourceName)) {
      return `${year}-${dayBehindMonth}-${dayBehindToday}`;
    }
    return date.toString();
  })();

  const load = (newUrl: string) => {
    setUrl(newUrl);
    setPlayed(0);
    setErrored(false);
  };

  const handlePlayPause = () => {
    setPlaying((prev) => !prev);
  };

  const handleStop = () => {
    setPlaying(false);
    if (playerRef.current) {
      playerRef.current.currentTime = 0;
    }
  };

  const handleSeekMouseDown = () => {
    seekingRef.current = true;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(Number.parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    seekingRef.current = false;
    const player = playerRef.current;
    if (player && Number.isFinite(player.duration)) {
      player.currentTime =
        Number.parseFloat((e.target as HTMLInputElement).value) *
        player.duration;
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (seekingRef.current || errored) return;
    const target = e.target as HTMLVideoElement;
    const playedFraction = target.currentTime / target.duration || 0;
    setPlayed(playedFraction);
  };

  const handleBackward = useCallback(() => {
    if (!urls) return;

    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newUrl = urls[newIndex];
      if (!newUrl) return;
      load(newUrl);
      setCurrentIndex(newIndex);
    }
  }, [urls, currentIndex]);

  const handleForward = useCallback(() => {
    if (!urls) return;

    if (currentIndex < urls.length - 1) {
      const newIndex = currentIndex + 1;
      const newUrl = urls[newIndex];
      if (!newUrl) return;
      load(newUrl);
      setCurrentIndex(newIndex);
    }
  }, [urls, currentIndex]);

  const handleError = useCallback(() => {
    console.warn(`[Audio Devotions] Failed to load: ${title}`, url);
    setErrored(true);
    setPlayed(0);
    setUrl(SILENT_AUDIO);
    setPlaying(true);
  }, [title, url]);

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
    navigator.mediaSession.setActionHandler(
      "nexttrack",
      showForward ? handleForward : null
    );
    navigator.mediaSession.setActionHandler(
      "previoustrack",
      showBackward ? handleBackward : null
    );

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
    };
  }, [title, errored, showForward, showBackward, handleForward, handleBackward]);

  return {
    playerRef,
    url,
    playing,
    played,
    errored,
    title,
    dateTitle,
    showForward,
    showBackward,
    handlePlayPause,
    handleStop,
    handleSeekMouseDown,
    handleSeekChange,
    handleSeekMouseUp,
    handleTimeUpdate,
    handleForward,
    handleBackward,
    handleError,
  };
}
