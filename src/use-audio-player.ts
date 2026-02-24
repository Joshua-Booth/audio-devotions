import { useRef, useState } from "react";

import {
  getDate,
  getDelayedSourceNames,
  getSourceNames,
  getSources,
} from "./utils";

export function useAudioPlayer() {
  const [urls] = useState<string[] | null>(getSources);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [url, setUrl] = useState<string | null>(urls?.[0] ?? null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);

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
    if (!seekingRef.current) {
      const target = e.target as HTMLVideoElement;
      const playedFraction = target.currentTime / target.duration || 0;
      setPlayed(playedFraction);
    }
  };

  const handleBackward = () => {
    if (!urls) return;

    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newUrl = urls[newIndex];
      if (!newUrl) return;
      load(newUrl);
      setCurrentIndex(newIndex);
    }
  };

  const handleForward = () => {
    if (!urls) return;

    if (currentIndex < urls.length - 1) {
      const newIndex = currentIndex + 1;
      const newUrl = urls[newIndex];
      if (!newUrl) return;
      load(newUrl);
      setCurrentIndex(newIndex);
    }
  };

  return {
    playerRef,
    url,
    playing,
    played,
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
  };
}
