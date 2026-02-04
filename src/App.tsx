import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  StopIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import {
  getDate,
  getDelayedSourceNames,
  getSourceNames,
  getSources,
  toggleColour,
} from "./utils";

function App() {
  const [url, setUrl] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [urls] = useState<string[] | null>(getSources);
  const [showForward, setShowForward] = useState(true);
  const [showBackward, setShowBackward] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const playerRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (urls) {
      setUrl(urls[0]);
      setPlayed(0);
    }
  }, [urls]);

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
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(Number.parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    const player = playerRef.current;
    if (player && Number.isFinite(player.duration)) {
      player.currentTime =
        Number.parseFloat((e.target as HTMLInputElement).value) *
        player.duration;
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    // Only update time slider if not currently seeking
    if (!seeking) {
      const target = e.target as HTMLVideoElement;
      const playedFraction = target.currentTime / target.duration || 0;
      setPlayed(playedFraction);
    }
  };

  const getDateTitle = () => {
    const { date, year, dayBehindMonth, dayBehindToday } = getDate();
    const sourceNames = getSourceNames();
    const delayedSourceNames = getDelayedSourceNames();

    let audioDate = date.toString();
    if (delayedSourceNames.includes(sourceNames[currentIndex])) {
      audioDate = `${year}-${dayBehindMonth}-${dayBehindToday}`;
    }

    return `${audioDate}`;
  };

  const getTitle = () => {
    const sourceNames = getSourceNames();
    return sourceNames[currentIndex];
  };

  const handleBackward = () => {
    if (!urls) return;

    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      load(urls[newIndex]);
      setCurrentIndex(newIndex);
      setShowBackward(newIndex > 0);
      setShowForward(true);
    }
  };

  const handleForward = () => {
    if (!urls) return;

    if (currentIndex < urls.length - 1) {
      const newIndex = currentIndex + 1;
      load(urls[newIndex]);
      setCurrentIndex(newIndex);
      setShowForward(newIndex < urls.length - 1);
      setShowBackward(true);
    }
  };

  return (
    <main>
      <header>
        <button
          className="bg-white hover:bg-gray-500 rounded-xl h-10 px-4 font-bold ml-2.5 mt-2.5 dark:bg-gray-800 dark:hover:bg-gray-600"
          onClick={toggleColour}
        >
          Change Colour
        </button>
      </header>

      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          width="100%"
          height="100%"
          src={url ?? undefined}
          playing={playing}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>

      <h1 className="absolute text-center top-[200px] left-0 right-0 text-[60px] font-[arial] m-0 lg:text-[500%] dark:text-white">
        {getTitle()}
      </h1>

      <p className="text-gray-500 text-[300%] font-normal text-center m-0 dark:text-gray-400">
        {getDateTitle()}
      </p>

      <div className="text-center h-[20vh] absolute bottom-[20%] mx-auto left-0 right-0 flex flex-col gap-20">
        <input
          type="range"
          min={0}
          max={0.999999}
          step="any"
          value={played}
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
          aria-label="Seeker"
          className="range-slider"
        />

        <div>
          <button
            className={`btn-media ${showBackward ? "" : "invisible"}`}
            onClick={handleBackward}
            aria-label="Skip Backward"
          >
            <SkipBackIcon weight="fill" />
          </button>

          <button className="btn-media" onClick={handleStop} aria-label="Stop">
            <StopIcon weight="fill" color="red" />
          </button>

          <button
            className="btn-media"
            onClick={handlePlayPause}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <PauseIcon weight="fill" />
            ) : (
              <PlayIcon weight="fill" color="green" />
            )}
          </button>

          <button
            className={`btn-media ${showForward ? "" : "invisible"}`}
            onClick={handleForward}
            aria-label="Skip Forward"
          >
            <SkipForwardIcon weight="fill" />
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
