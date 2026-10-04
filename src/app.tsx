import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  StopIcon,
} from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef } from "react";
import ReactPlayer from "react-player";

import { formatClock, formatLongDate, formatShortDate } from "./format";
import { SeekSlider } from "./seek-slider";
import { focusRing, visuallyHidden } from "./styles/shared";
import { colors, screens, textSize } from "./styles/tokens.stylex";
import { toggleColour } from "./theme";
import { TransportButton } from "./transport-button";
import { useAudioPlayer } from "./use-audio-player";

export function App() {
  const {
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
  } = useAudioPlayer();
  const showPause = !errored && playing;
  const backRef = useRef<HTMLButtonElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const focused = document.activeElement;
    const focusedButtonHid =
      (!hasPrevious && focused === backRef.current) ||
      (!hasNext && focused === nextRef.current);
    if (focusedButtonHid) playRef.current?.focus();
  }, [hasPrevious, hasNext]);

  return (
    <div {...stylex.props(styles.page)}>
      <div hidden>
        <ReactPlayer
          ref={attachPlayer}
          {...playerProps}
          width="100%"
          height="100%"
        />
      </div>

      <main {...stylex.props(styles.main)}>
        <div {...stylex.props(styles.nowPlaying)}>
          <h1 {...stylex.props(styles.title)}>{title}</h1>
          <p {...stylex.props(styles.date)}>
            <span {...stylex.props(styles.shortDate)}>
              {formatShortDate(date)}
            </span>
            <span {...stylex.props(styles.longDate)}>
              {formatLongDate(date)}
            </span>
          </p>
          {errored && (
            <p {...stylex.props(styles.alert)}>
              {`Not available yet. Press ${hasNext ? "Next" : "Back"}.`}
            </p>
          )}
          <p aria-live="polite" {...stylex.props(visuallyHidden.base)}>
            {errored
              ? `${title} isn't available yet. Press ${hasNext ? "Next" : "Back"}.`
              : `${title}, ${formatLongDate(date)}`}
          </p>
        </div>

        <section aria-label="Player" {...stylex.props(styles.player)}>
          <div>
            <SeekSlider
              currentTime={currentTime}
              duration={duration}
              disabled={errored}
              onSeek={seekTo}
              onSkip={skipBy}
            />
            <p aria-hidden {...stylex.props(styles.times)}>
              <span>{formatClock(currentTime)}</span>
              <span>{formatClock(duration)}</span>
            </p>
          </div>

          <div {...stylex.props(styles.buttons)}>
            <TransportButton
              control="back"
              icon={SkipBackIcon}
              label="Back"
              onClick={previous}
              invisible={!hasPrevious}
              ref={backRef}
            />
            <TransportButton
              control="stop"
              icon={StopIcon}
              label="Stop"
              onClick={stop}
              disabled={errored}
            />
            <TransportButton
              control="play"
              icon={showPause ? PauseIcon : PlayIcon}
              label={showPause ? "Pause" : "Play"}
              onClick={togglePlay}
              disabled={errored}
              ref={playRef}
            />
            <TransportButton
              control="next"
              icon={SkipForwardIcon}
              label="Next"
              onClick={next}
              invisible={!hasNext}
              ref={nextRef}
            />
          </div>
        </section>
      </main>

      <div {...stylex.props(styles.aboveUnlessCramped)}>
        <button
          onClick={toggleColour}
          {...stylex.props(styles.changeColour, focusRing.base)}
        >
          Change Colour
        </button>
      </div>
    </div>
  );
}

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100dvh",
    gap: { default: "0.75rem", [screens.large]: "1.5rem" },
    paddingLeft: {
      default: "max(env(safe-area-inset-left), 0.75rem)",
      [screens.wide]: "max(env(safe-area-inset-left), 2rem)",
    },
    paddingRight: {
      default: "max(env(safe-area-inset-right), 0.75rem)",
      [screens.wide]: "max(env(safe-area-inset-right), 2rem)",
    },
    paddingTop: {
      default: "max(env(safe-area-inset-top), 0.75rem)",
      [screens.large]: "max(env(safe-area-inset-top), 1rem)",
    },
    paddingBottom: {
      default: "max(env(safe-area-inset-bottom), 1rem)",
      [screens.large]: "max(env(safe-area-inset-bottom), 1.5rem)",
    },
    backgroundColor: colors.page,
    color: colors.ink,
  },
  aboveUnlessCramped: {
    order: { default: -1, [screens.cramped]: 0 },
  },
  changeColour: {
    minHeight: "3.5rem",
    paddingInline: "1rem",
    borderRadius: "1.25rem",
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: colors.keyEdge,
    backgroundColor: { default: colors.key, ":hover": colors.keyHover },
    color: colors.keyInk,
    fontSize: textSize.secondary,
    lineHeight: 1,
    fontWeight: 700,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: { default: "0.75rem", [screens.large]: "1.5rem" },
  },
  nowPlaying: {
    marginBlock: "auto",
    textAlign: "center",
  },
  title: {
    fontSize: {
      default: textSize.primary,
      [screens.roomyPhone]: "3.5rem",
      [screens.large]: "6rem",
    },
    lineHeight: 1,
    fontWeight: 800,
    textWrap: "balance",
    overflowWrap: "anywhere",
    hyphens: "auto",
  },
  date: {
    marginTop: { default: "0.75rem", [screens.wide]: "1rem" },
    fontSize: textSize.primary,
    lineHeight: 1.25,
    fontWeight: 700,
  },
  shortDate: {
    display: { default: "inline", [screens.wide]: "none" },
  },
  longDate: {
    display: { default: "none", [screens.wide]: "inline" },
  },
  alert: {
    maxWidth: "20em",
    marginInline: "auto",
    marginTop: { default: "1rem", [screens.wide]: "1.5rem" },
    paddingInline: { default: "1rem", [screens.wide]: "1.5rem" },
    paddingBlock: { default: "0.75rem", [screens.wide]: "1rem" },
    borderRadius: "2rem",
    borderWidth: 5,
    borderStyle: "solid",
    borderColor: colors.alertEdge,
    backgroundColor: colors.alert,
    color: colors.alertInk,
    fontSize: textSize.primary,
    lineHeight: 1.25,
    fontWeight: 700,
  },
  player: {
    display: "flex",
    flexDirection: "column",
    gap: { default: "0.75rem", [screens.large]: "1.5rem" },
  },
  times: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: { default: "0.25rem", [screens.wide]: "0.5rem" },
    fontSize: textSize.primary,
    lineHeight: 1.25,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
  },
  buttons: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(2, minmax(0, 1fr))",
      [screens.sideways]: "repeat(4, minmax(0, 1fr))",
      [screens.large]: "repeat(4, minmax(0, 1fr))",
    },
    gridTemplateAreas: {
      default: "'stop play' 'back next'",
      [screens.sideways]: "'back stop play next'",
      [screens.large]: "'back stop play next'",
    },
    gap: { default: "0.75rem", [screens.large]: "1rem" },
  },
});
