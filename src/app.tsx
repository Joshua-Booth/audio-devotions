import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  StopIcon,
} from "@phosphor-icons/react";
import ReactPlayer from "react-player";

import { useAudioPlayer } from "./use-audio-player";
import { toggleColour } from "./utils";

export function App() {
  const {
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
  } = useAudioPlayer();

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

      <h1 className="absolute text-center top-50 left-0 right-0 text-[60px] font-[arial] m-0 lg:text-[500%] dark:text-white">
        {title}
      </h1>

      <p className="text-gray-500 text-[300%] font-normal text-center m-0 dark:text-gray-400">
        {dateTitle}
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
