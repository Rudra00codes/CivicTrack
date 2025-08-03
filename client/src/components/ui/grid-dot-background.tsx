"use client";

import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

// Grid Background Component
export interface GridBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  gridSize?: number;
  gridColor?: string;
  darkGridColor?: string;
  showFade?: boolean;
  fadeIntensity?: number;
  children?: React.ReactNode;
}

export const GridBackground = ({
  className,
  children,
  gridSize = 20,
  gridColor = "#e4e4e7",
  darkGridColor = "#262626",
  showFade = true,
  fadeIntensity = 20,
  ...props
}: GridBackgroundProps) => {
  const [currentGridColor, setCurrentGridColor] = useState(gridColor);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkModeActive = document.documentElement.classList.contains('dark') || prefersDarkMode;
    setCurrentGridColor(isDarkModeActive ? darkGridColor : gridColor);

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          const updatedIsDarkModeActive = document.documentElement.classList.contains('dark');
          setCurrentGridColor(updatedIsDarkModeActive ? darkGridColor : gridColor);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return function () {
      return observer.disconnect();
    };
  }, [gridColor, darkGridColor]);

  return (
    <div
      className={cn(
        "min-h-screen w-full relative bg-white dark:bg-black",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundSize: gridSize + "px " + gridSize + "px",
          backgroundImage:
            "linear-gradient(to right, " + currentGridColor + " 1px, transparent 1px), " +
            "linear-gradient(to bottom, " + currentGridColor + " 1px, transparent 1px)",
        }}
      />

      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/50 dark:from-black/50 dark:to-black/50"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, transparent " + fadeIntensity + "%, black)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, transparent " + fadeIntensity + "%, black)",
          }}
        />
      )}

      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

// Dot Background Component
export interface DotBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  dotSize?: number;
  dotColor?: string;
  darkDotColor?: string;
  spacing?: number;
  showFade?: boolean;
  fadeIntensity?: number;
  children?: React.ReactNode;
}

export const DotBackground = ({
  className,
  children,
  dotSize = 1,
  dotColor = "#d4d4d4",
  darkDotColor = "#404040",
  spacing = 20,
  showFade = true,
  fadeIntensity = 20,
  ...props
}: DotBackgroundProps) => {
  const [currentDotColor, setCurrentDotColor] = useState(dotColor);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkModeActive = document.documentElement.classList.contains('dark') || prefersDarkMode;
    setCurrentDotColor(isDarkModeActive ? darkDotColor : dotColor);

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          const updatedIsDarkModeActive = document.documentElement.classList.contains('dark');
          setCurrentDotColor(updatedIsDarkModeActive ? darkDotColor : dotColor);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return function () {
      return observer.disconnect();
    };
  }, [dotColor, darkDotColor]);

  return (
    <div
      className={cn(
        "min-h-screen w-full relative bg-white dark:bg-black",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundSize: spacing + "px " + spacing + "px",
          backgroundImage:
            "radial-gradient(" + currentDotColor + " " + dotSize + "px, transparent " + dotSize + "px)",
        }}
      />

      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/30 dark:from-black/30 dark:to-black/30"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, transparent " + fadeIntensity + "%, black)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, transparent " + fadeIntensity + "%, black)",
          }}
        />
      )}

      <div className="relative z-20 pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

export default { GridBackground, DotBackground };
