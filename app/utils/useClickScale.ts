import {
  animate,
  useMotionValue,
} from "framer-motion";
import { useCallback, useState } from "react";

export const useClickScale = ({
  elementRef,
  scalePx,
  duration,
  clickDuration,
}: {
  elementRef: React.RefObject<HTMLElement | null>;
  scalePx: number;
  duration: number;
  clickDuration: number;
}) => {
  const scale = useMotionValue(1);

  const [clickScale, setClickScale] = useState(0);

  const startClickScale = useCallback(() => {
    // cache the element dimensions on start
    const { width = 1 } = elementRef.current?.getBoundingClientRect() || {};
    const _clickScale = scalePx / width;
    setClickScale(_clickScale);
    animate(scale, 1 + _clickScale, { duration });
  }, [duration, elementRef, scale, scalePx]);

  const endClickScale = useCallback(() => {
    animate(scale, 1, { duration });
  }, [duration, scale]);

  const onPointerDown = useCallback(() => {
    animate(scale, 1 - clickScale, { duration: clickDuration });
  }, [clickDuration, clickScale, scale]);

  const onPointerUp = useCallback(() => {
    animate(scale, 1 + clickScale, { duration: clickDuration });
  }, [clickDuration, clickScale, scale]);

  return {
    scale,
    startClickScale,
    endClickScale,
    onPointerDown,
    onPointerUp,
  };
};

// const opacityDuration = 0.05;
