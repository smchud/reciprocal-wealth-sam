"use client";

import Link from "next/link";

interface LogoProps {
  variant?: "horizontal" | "vertical";
  theme?: "light" | "dark";
  className?: string;
  href?: string;
  showTagline?: boolean;
}

const logoSrc = {
  "horizontal-light": "/images/logo-horizontal-white.png",
  "horizontal-dark": "/images/logo-horizontal-dark.png",
  "vertical-light": "/images/logo-vertical-white.png",
  "vertical-dark": "/images/logo-vertical-dark.png",
} as const;

export default function Logo({
  variant = "horizontal",
  theme = "light",
  className = "",
  href,
  showTagline = false,
}: LogoProps) {
  const src = logoSrc[`${variant}-${theme}`];

  const sizeClass =
    variant === "horizontal" ? "h-10 w-auto" : "h-28 w-auto";

  const img = (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <img
        src={src}
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
