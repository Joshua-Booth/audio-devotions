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
    <div role="main" className="app">
      <section className="section">
        <div className="player-wrapper">
          <ReactPlayer
            ref={playerRef}
            className="react-player"
            width="100%"
            height="100%"
            src={url ?? undefined}
            playing={playing}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>

        <button id="toggle-colour" onClick={toggleColour}>
          Change Colour
        </button>

        <h2 id="date" className="title">
          {getDateTitle()}
        </h2>

        <h1 id="reading" className="title">
          {getTitle()}
        </h1>

        <div id="media-controls">
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
          />

          <div>
            <button
              className={`button ${showBackward ? "" : "hide"}`}
              onClick={handleBackward}
              aria-label="Skip Backward"
            >
              <i className="fa fa-fast-backward"></i>
            </button>

            <button className="button" onClick={handleStop} aria-label="Stop">
              <i className="fa fa-stop"></i>
            </button>

            <button
              className="button"
              onClick={handlePlayPause}
              aria-label="Toggle Play/Pause"
            >
              {playing ? (
                <i className="fa fa-pause"></i>
              ) : (
                <i className="fa fa-play"></i>
              )}
            </button>

            <button
              className={`button ${showForward ? "" : "hide"}`}
              onClick={handleForward}
              aria-label="Skip Forward"
            >
              <i className="fa fa-fast-forward"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
