import { useCallback, useLayoutEffect, useState } from "react";

export const useElementDOMRect = ({
  elementRef,
}: {
  elementRef: React.RefObject<HTMLElement | null>;
}) => {
  const [elementDOMRect, setElementDOMRect] = useState<DOMRect>();

  useLayoutEffect(
    () => setElementDOMRect(elementRef.current?.getBoundingClientRect()),
    [elementRef]
  );

  const getElementDOMRect = useCallback(
    (getNew = false) => {
      if (getNew) {
        const _elementDOMRect = elementRef.current?.getBoundingClientRect();
        setElementDOMRect(_elementDOMRect);
        return _elementDOMRect;
      } else {
        return elementDOMRect;
      }
    },
    [elementDOMRect, elementRef]
  );

  return {
    getElementDOMRect,
    elementDOMRect: elementDOMRect,
    setElementDOMRect,
  };
};
