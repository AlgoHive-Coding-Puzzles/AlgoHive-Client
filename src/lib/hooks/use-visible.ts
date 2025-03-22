"use client";
import { useState, useEffect, useRef, RefObject } from "react";

interface UseVisibleOptions extends IntersectionObserverInit {
  delay?: number;
}

const useVisible = (
  options: UseVisibleOptions = { threshold: 0.1, delay: 0 }
): [RefObject<HTMLDivElement>, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentElement = elementRef.current;

    const observer = new IntersectionObserver((entries, observerInstance) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          setIsVisible(true);
          observerInstance.unobserve(entries[0].target);
        }, options.delay);
      }
    }, options);

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return [elementRef as RefObject<HTMLDivElement>, isVisible];
};

export default useVisible;
