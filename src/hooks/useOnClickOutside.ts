import React, { useEffect } from "react";

export const useOnClickOutside = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) => {
  const handler = (ev: MouseEvent): void => {
    if (ref.current && !ref.current.contains(ev.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, [ref, callback]);
};
