"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DESKTOP_QUERY = "(min-width: 768px)";
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

interface HeroMediaProps {
  poster: string;
  video: string;
}

export default function HeroMedia({ poster, video }: HeroMediaProps) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const motionOk = window.matchMedia(MOTION_QUERY);

    const update = () => setShowVideo(desktop.matches && motionOk.matches);
    update();

    desktop.addEventListener("change", update);
    motionOk.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      motionOk.removeEventListener("change", update);
    };
  }, []);

  return (
    <>
      {/* Always the initial paint on every device — never blocks on video. */}
      <Image
        src={poster}
        alt=""
        fill
        className="absolute inset-0 object-cover opacity-35 pointer-events-none"
        sizes="100vw"
        priority
        aria-hidden
      />
      {/* Mounted only after hydration, and only on desktop with motion allowed —
          mobile never requests this element or its source at all. */}
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
          poster={poster}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
    </>
  );
}
