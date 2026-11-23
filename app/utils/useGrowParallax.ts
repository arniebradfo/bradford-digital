import {
  KeyframeOptions,
  animate,
  clamp,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { mouseOffset } from "./mouseOffset";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useElementDOMRect } from "./useElementDOMRect";

export const useGrowParallax = ({
  elementRef,
  offsetPx,
  duration,
}: {
  elementRef: React.RefObject<HTMLElement | null>;
  offsetPx: number;
  duration: number;
}) => {
  const translateX = useMotionValue(0);
  const translateY = useMotionValue(0);

  const scaleX = useMotionValue(0);
  const scaleY = useMotionValue(0);
  const scale = useMotionTemplate`${scaleX}, ${scaleY}`;

  const opacity = useMotionValue(0);

  const transformOriginX = useMotionValue(0);
  const transformOriginY = useMotionValue(0);
  const transformOrigin = useMotionTemplate`${transformOriginX}px ${transformOriginY}px`;

  const opacityDuration = useMemo(() => duration * 0.2, [duration]);

  const { getElementDOMRect } = useElementDOMRect({ elementRef });

  const [isRunning, setIsRunning] = useState(false);

  const startGrowParallax = useCallback(
    (elementDOMRect?: DOMRect) => {
      const { height = 1, width = 1 } = elementDOMRect || {};

      const scaleFromX = initialScaleSize / width;
      const scaleFromY = initialScaleSize / height;

      scaleX.set(scaleFromX);
      scaleY.set(scaleFromY);

      animate(scaleX, 1, { duration, ease });
      animate(scaleY, 1, { duration, ease });
      animate(opacity, 1, { duration: opacityDuration, ease });
    },
    [duration, opacity, opacityDuration, scaleX, scaleY]
  );

  const endGrowParallax = useCallback(
    (elementDOMRect?: DOMRect) => {
      const { height = 1, width = 1 } = elementDOMRect || {};

      const scaleFromX = initialScaleSize / width;
      const scaleFromY = initialScaleSize / height;

      const durationX = width > height ? duration * 0.9 : duration;
      const durationY = width < height ? duration * 0.9 : duration;

      animate(scaleX, scaleFromX, { duration: durationX, ease: easeReverse });
      animate(scaleY, scaleFromY, { duration: durationY, ease: easeReverse });
      animate(opacity, 0, {
        duration: opacityDuration,
        delay: duration - opacityDuration,
        ease: easeReverse,
      });
    },
    [duration, scaleX, scaleY, opacity, opacityDuration]
  );

  const growParallax = useCallback(
    (end = false) => {
      const elementDOMRect = getElementDOMRect(!isRunning);

      let {
        topLeftOffsetX, //
        topLeftOffsetY,
        centerOffsetX,
        centerOffsetY,
      } = mouseOffset({ elementDOMRect });

      const { height = 1, width = 1 } = elementDOMRect || {};
      topLeftOffsetX = clamp(0, width, topLeftOffsetX);
      topLeftOffsetY = clamp(0, height, topLeftOffsetY);
      transformOriginX.set(topLeftOffsetX);
      transformOriginY.set(topLeftOffsetY);

      const offsetX = offsetPx / width;
      translateX.set(centerOffsetX * offsetX);
      translateY.set(centerOffsetY * offsetX);

      if (end) {
        setIsRunning(false);
        endGrowParallax(elementDOMRect);
      } else if (!isRunning) {
        setIsRunning(true);
        startGrowParallax(elementDOMRect);
      }
    },
    [
      isRunning,
      startGrowParallax,
      endGrowParallax,
      getElementDOMRect,
      offsetPx,
      transformOriginX,
      transformOriginY,
      translateX,
      translateY,
    ]
  );

  return {
    translateX,
    translateY,
    transformOrigin,
    scale,
    opacity,
    startGrowParallax: growParallax,
    updateGrowParallax: growParallax,
    endGrowParallax: () => growParallax(true),
  };
};

const initialScaleSize = 12;
const ease: KeyframeOptions["ease"] = "easeOut";
const easeReverse: KeyframeOptions["ease"] = "easeIn";
// const ease: KeyframeOptions["ease"] = [0.0, 0.65, 0.65, 1];
// const ease: KeyframeOptions["ease"] = [0.0, 0.0, 0.0, 0.5];
// const easeReverse: KeyframeOptions["ease"] = [
//   ease[1],
//   ease[0],
//   ease[3],
//   ease[2],
// ];
