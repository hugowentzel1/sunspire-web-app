"use client";
import { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

type TinyLottieProps = {
  /** JSON animation data (imported object) */
  json: object;
  /** Size in pixels (square). Defaults to 20 */
  size?: number;
  /** aria-label for screen readers if conveying meaning; otherwise it will be hidden */
  ariaLabel?: string;
  /** When true, loop the animation (default: true) */
  loop?: boolean;
};

export default function TinyLottie({
  json,
  size = 20,
  ariaLabel,
  loop = true,
}: TinyLottieProps) {
  const ref = useRef<LottieRefCurrentProps>(null);
  const [prefersReduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLSpanElement | null>(null);

  // Reduced motion detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // In-view detection (play only when visible)
  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  // Play/pause control
  useEffect(() => {
    const inst = ref.current;
    if (!inst) return;

    if (prefersReduced || !inView) {
      inst.stop();
      return;
    }
    inst.setSpeed(1); // keep tiny animations subtle; do not increase
    inst.play();
  }, [prefersReduced, inView]);

  const dim = `${size}px`;

  return (
    <span
      ref={containerRef}
      style={{ width: dim, height: dim }}
      className="inline-flex items-center justify-center align-[-2px]"
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <Lottie
        lottieRef={ref}
        animationData={json}
        loop={loop && !prefersReduced}
        autoplay={false}   // we control play via effects
        style={{ width: dim, height: dim }}
        rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
      />
    </span>
  );
}
