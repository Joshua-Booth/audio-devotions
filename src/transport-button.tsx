import type { Icon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";

import { focusRing } from "./styles/shared";
import { colors, screens, textSize } from "./styles/tokens.stylex";

type Control = "back" | "stop" | "play" | "next";

interface TransportButtonProps {
  icon: Icon;
  label: string;
  control: Control;
  onClick: () => void;
  disabled?: boolean;
  invisible?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export function TransportButton({
  icon: IconComponent,
  label,
  control,
  onClick,
  disabled = false,
  invisible = false,
  ref,
}: TransportButtonProps) {
  const isMain = control === "stop" || control === "play";

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      {...stylex.props(
        styles.key,
        isMain ? styles.main : styles.side,
        tones[control],
        areas[control],
        focusRing.base,
        invisible && styles.invisible
      )}
    >
      <IconComponent
        weight="fill"
        aria-hidden
        {...stylex.props(isMain ? styles.mainIcon : styles.sideIcon)}
      />
      {label}
    </button>
  );
}

const styles = stylex.create({
  key: {
    display: "flex",
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingInline: "0.5rem",
    borderRadius: "2rem",
    borderWidth: 5,
    borderStyle: "solid",
    fontSize: textSize.primary,
    lineHeight: 1,
    fontWeight: 700,
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 },
    transform: { default: null, ":active": "scale(0.98)" },
  },
  main: {
    minHeight: {
      default: "9rem",
      [screens.sideways]: "5rem",
      [screens.large]: "13rem",
    },
    flexDirection: { default: "column", [screens.sideways]: "row" },
    gap: { default: "0.25rem", [screens.sideways]: "0.75rem" },
  },
  side: {
    minHeight: { default: "5rem", [screens.large]: "13rem" },
    flexDirection: { default: "row", [screens.large]: "column" },
    flexWrap: { default: null, [screens.narrow]: "wrap" },
    gap: { default: "0.5rem", [screens.large]: "0.25rem" },
  },
  mainIcon: {
    flexShrink: 0,
    width: {
      default: "4rem",
      [screens.sideways]: "2.5rem",
      [screens.large]: "6.5rem",
    },
    height: {
      default: "4rem",
      [screens.sideways]: "2.5rem",
      [screens.large]: "6.5rem",
    },
  },
  sideIcon: {
    flexShrink: 0,
    width: { default: "2.25rem", [screens.large]: "6.5rem" },
    height: { default: "2.25rem", [screens.large]: "6.5rem" },
  },
  invisible: {
    visibility: "hidden",
  },
});

const neutral = {
  borderColor: colors.keyEdge,
  backgroundColor: { default: colors.key, ":hover": colors.keyHover },
  color: colors.keyInk,
};

const tones = stylex.create({
  back: neutral,
  next: neutral,
  stop: {
    borderColor: colors.keyEdge,
    backgroundColor: colors.key,
    color: colors.stop,
  },
  play: {
    borderColor: colors.playEdge,
    backgroundColor: colors.play,
    color: colors.playInk,
  },
});

const areas = stylex.create({
  back: { gridArea: "back" },
  stop: { gridArea: "stop" },
  play: { gridArea: "play" },
  next: { gridArea: "next" },
});
