"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "horizontal" | "vertical";
  theme?: "light" | "dark";
  className?: string;
  href?: string;
  showTagline?: boolean;
}

const logoSrc = {
  "horizontal-light": {
    src: "/images/logo-horizontal-white.png",
    width: 1800,
    height: 563,
  },
  "horizontal-dark": {
    src: "/images/logo-horizontal-dark.png",
    width: 1800,
    height: 563,
  },
  "vertical-light": {
    src: "/images/logo-vertical-white.png",
    width: 1418,
    height: 1898,
  },
  "vertical-dark": {
    src: "/images/logo-vertical-dark.png",
    width: 1418,
    height: 1898,
  },
} as const;

export default function Logo({
  variant = "horizontal",
  theme = "light",
  className = "",
  href,
  showTagline = false,
}: LogoProps) {
  const logo = logoSrc[`${variant}-${theme}`];

  const sizeClass =
    variant === "horizontal" ? "h-10 w-auto" : "h-28 w-auto";

  const img = (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <Image
        src={logo.src}
        width={logo.width}
        height={logo.height}
        alt="Reciprocal Wealth"
        className={`${sizeClass} object-contain`}
      />
      {showTagline && (
        <span
          className={`mt-1 text-xs italic tracking-wide ${
            theme === "dark" ? "text-forest-50" : "text-forest"
          }`}
        >
          Invested Together
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {img}
      </Link>
    );
  }

  return img;
}
