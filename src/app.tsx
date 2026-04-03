import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  StopIcon,
} from "@phosphor-icons/react";
import ReactPlayer from "react-player";

import { useAudioPlayer } from "./use-audio-player";
import { toggleColour } from "./theme";

export function App() {
  const {
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
  } = useAudioPlayer();

  return (
    <main className="flex flex-col h-dvh">
      <header>
        <button
          className="bg-white hover:bg-gray-500 rounded-lg px-6 py-2.5 font-bold ml-2.5 mt-2.5 border border-black dark:bg-gray-800 dark:hover:bg-gray-600"
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
          loop={errored}
          onTimeUpdate={handleTimeUpdate}
          onError={handleError}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-center text-[clamp(36px,10vw,60px)] font-[arial] m-0 lg:text-[500%] dark:text-white">
          {title}
        </h1>

        <p className="text-gray-500 text-[clamp(18px,5vw,30px)] font-normal text-center m-0 dark:text-gray-400">
          {dateTitle}
        </p>
      </div>

      <div className="text-center pb-[max(env(safe-area-inset-bottom),5vh)] flex flex-col gap-16 sm:gap-20">
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

          <button
            className="btn-media"
            onClick={handleStop}
            disabled={errored}
            aria-label="Stop"
          >
            <StopIcon weight="fill" color="red" />
          </button>

          <button
            className="btn-media"
            onClick={handlePlayPause}
            disabled={errored}
            aria-label={!errored && playing ? "Pause" : "Play"}
          >
            {!errored && playing ? (
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
