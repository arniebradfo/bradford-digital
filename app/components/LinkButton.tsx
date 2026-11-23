"use client";
import { motion, MotionStyle } from "framer-motion";
import style from "./LinkButton.module.css";
import { useRef } from "react";
import { useMagneticParallax } from "../utils/useMagneticParallax";
import { useGrowParallax } from "../utils/useGrowParallax";
import Link from "next/link";
import { cx } from "../utils/joinClassNames";
import { useClickScale } from "../utils/useClickScale";
import { externalLinkAttributes } from "../utils/link";

const MotionLink = motion(Link);

export type LinkButtonProps = React.ComponentProps<typeof MotionLink> & {
  offsetPx?: number;
  duration?: number;
  classNameBg?: string;
  classNameInside?: string;
  type?: "minimal" | "outline" | "emphasis";
  external?: boolean;
};

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  className,
  offsetPx = 24,
  duration = 0.15, // match
  type = "minimal",
  classNameInside,
  classNameBg,
  external,
  ...props
}) => {
  const elementRef = useRef<HTMLAnchorElement>(null);

  const {
    translateX: magneticTranslateX,
    translateY: magneticTranslateY,
    startMagneticParallax,
    updateMagneticParallax,
    endMagneticParallax,
  } = useMagneticParallax({
    elementRef,
    offsetPx: offsetPx / 2,
    duration,
  });

  const {
    translateX: growTranslateX,
    translateY: growTranslateY,
    transformOrigin: growTransformOrigin,
    scale: growScale,
    opacity: growOpacity,
    startGrowParallax,
    updateGrowParallax,
    endGrowParallax,
  } = useGrowParallax({
    elementRef,
    offsetPx,
    duration,
  });

  const {
    scale: clickScale,
    startClickScale,
    endClickScale,
    onPointerDown: clickScalePointerDown,
    onPointerUp: clickScalePointerUp,
  } = useClickScale({
    elementRef,
    scalePx: 4,
    duration,
    clickDuration,
  });

  const customVar = {
    "--link-button-duration": duration + "s",
    "--link-button-click-duration": clickDuration + "s",
  } as MotionStyle;

  return (
    <MotionLink
      className={cx(
        className,
        style.LinkButton,
        type === "outline"
          ? style.LinkButtonOutline
          : type === "emphasis"
          ? style.LinkButtonEmphasis
          : undefined
      )}
      style={customVar}
      ref={elementRef}
      onHoverStart={() => {
        startMagneticParallax();
        startGrowParallax();
        startClickScale();
      }}
      onHoverEnd={() => {
        endMagneticParallax();
        endGrowParallax();
        endClickScale();
      }}
      onMouseMove={() => {
        updateMagneticParallax();
        updateGrowParallax();
      }}
      onPointerDown={() => {
        clickScalePointerDown();
      }}
      onPointerUp={() => {
        clickScalePointerUp();
      }}
      {...(external ? externalLinkAttributes : {})}
      {...props}
    >
      <motion.div
        className={cx(classNameBg, style.LinkButtonBg)}
        style={{
          x: growTranslateX,
          y: growTranslateY,
          transformOrigin: growTransformOrigin,
          scale: growScale,
          opacity: growOpacity,
        }}
      />
      <motion.div
        className={cx(classNameInside, style.LinkButtonInside)}
        style={{
          x: magneticTranslateX,
          y: magneticTranslateY,
          scale: clickScale,
          transformOrigin: "50% 50%",
        }}
      >
        {children}
      </motion.div>
    </MotionLink>
  );
};

const clickDuration = 0.1;
