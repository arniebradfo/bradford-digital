import {
  animate,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { mouseOffset } from "./mouseOffset";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useElementDOMRect } from "./useElementDOMRect";

export const useMagneticParallax = ({
  elementRef,
  offsetPx,
  duration,
  isScrollUpdated,
}: {
  elementRef: React.RefObject<HTMLElement | null>;
  offsetPx: number;
  duration: number;
  isScrollUpdated?: boolean;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const magneticOffset = useMotionValue(0);

  const translateX = useTransform(() => mouseX.get() * magneticOffset.get());
  const translateY = useTransform(() => mouseY.get() * magneticOffset.get());

  const { getElementDOMRect } = useElementDOMRect({ elementRef });

  const [isRunning, setIsRunning] = useState(false);

  const magneticParallax = useCallback(() => {
    if (!isRunning) setIsRunning(true);
    const elementDOMRect = getElementDOMRect(!isRunning);

    if (!magneticOffset.isAnimating() && magneticOffset.get() === 0) {
      const { width = 0, height = 0 } = elementDOMRect || {};
      const offsetX = offsetPx / width; // if width === 0 then offsetX === Infinity
      if (offsetX < Infinity)
        animate(magneticOffset, offsetX, { duration, ease });
    }

    const { centerOffsetX, centerOffsetY } = mouseOffset({ elementDOMRect });
    mouseX.set(centerOffsetX);
    mouseY.set(centerOffsetY);
  }, [
    isRunning,
    duration,
    getElementDOMRect,
    magneticOffset,
    mouseX,
    mouseY,
    offsetPx,
  ]);

  const endMagneticParallax = useCallback(() => {
    animate(magneticOffset, 0, { duration, ease });
    animate(mouseX, 0, { duration, ease });
    animate(mouseY, 0, { duration, ease });
    setIsRunning(false);
  }, [duration, magneticOffset, mouseX, mouseY]);

  const { scrollYProgress } = useScroll({
    target: elementRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isScrollUpdated) return;
    const elementDOMRect = getElementDOMRect(true);
    const { centerOffsetX, centerOffsetY } = mouseOffset({ elementDOMRect });
    mouseX.set(centerOffsetX);
    mouseY.set(centerOffsetY);
  });

  return {
    translateX,
    translateY,
    startMagneticParallax: magneticParallax,
    updateMagneticParallax: magneticParallax,
    endMagneticParallax,
  };
};

const ease = "easeInOut";
