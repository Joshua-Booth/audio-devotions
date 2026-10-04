import * as stylex from "@stylexjs/stylex";

import { formatSpokenDuration } from "./format";
import { focusRing } from "./styles/shared";
import { colors } from "./styles/tokens.stylex";

const KEY_STEPS: Record<string, number> = {
  ArrowLeft: -5,
  ArrowDown: -5,
  ArrowRight: 5,
  ArrowUp: 5,
  PageDown: -30,
  PageUp: 30,
};

interface SeekSliderProps {
  currentTime: number;
  duration: number;
  disabled: boolean;
  onSeek: (seconds: number) => void;
  onSkip: (seconds: number) => void;
}

export function SeekSlider({
  currentTime,
  duration,
  disabled,
  onSeek,
  onSkip,
}: SeekSliderProps) {
  const known = Number.isFinite(duration) && duration > 0;
  const progress = known ? Math.min(100, (currentTime / duration) * 100) : 0;
  const inactive = disabled || !known;

  return (
    <input
      type="range"
      aria-label="Playback position"
      min={0}
      max={known ? duration : 1}
      step="any"
      value={known ? Math.min(currentTime, duration) : 0}
      disabled={inactive}
      aria-valuetext={
        known
          ? `${formatSpokenDuration(currentTime)} of ${formatSpokenDuration(duration)}`
          : "Loading"
      }
      onChange={(e) => onSeek(Number(e.target.value))}
      onKeyDown={(e) => {
        const step = KEY_STEPS[e.key];
        if (step === undefined) return;
        e.preventDefault();
        onSkip(step);
      }}
      {...stylex.props(
        styles.slider,
        focusRing.base,
        focusRing.pill,
        inactive && styles.inactive,
        styles.progress(`${progress}%`)
      )}
    />
  );
}

const TRACK = "24px";
const THUMB = "60px";

const track = {
  height: TRACK,
  borderRadius: 999,
  boxShadow: `inset 0 0 0 4px ${colors.trackRing}`,
};

const thumb = {
  boxSizing: "border-box",
  width: THUMB,
  height: THUMB,
  borderWidth: 6,
  borderStyle: "solid",
  borderColor: colors.thumbEdge,
  borderRadius: "50%",
  backgroundColor: colors.thumb,
} as const;

const styles = stylex.create({
  slider: {
    appearance: "none",
    display: "block",
    width: "100%",
    height: THUMB,
    margin: 0,
    backgroundColor: "transparent",
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    "::-webkit-slider-runnable-track": {
      ...track,
      backgroundImage: `linear-gradient(to right, ${colors.trackFill} var(--progress, 0%), ${colors.track} var(--progress, 0%))`,
    },
    "::-webkit-slider-thumb": {
      ...thumb,
      appearance: "none",
      marginTop: `calc((${TRACK} - ${THUMB}) / 2)`,
    },
    "::-moz-range-track": { ...track, backgroundColor: colors.track },
    "::-moz-range-progress": {
      height: TRACK,
      borderRadius: 999,
      backgroundColor: colors.trackFill,
    },
    "::-moz-range-thumb": thumb,
  },
  inactive: {
    "::-webkit-slider-thumb": { visibility: "hidden" },
    "::-moz-range-thumb": { visibility: "hidden" },
  },
  progress: (progress: string) => ({ "--progress": progress }),
});
