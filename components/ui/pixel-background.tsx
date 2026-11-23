import type { CSSProperties } from "react";

const shapes = [
  [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]],
  [[0, 2], [1, 2], [2, 2], [3, 2], [1, 1], [2, 1], [3, 1], [3, 0]],
  [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2], [2, 2]],
] as const;

const clusters = [
  { position: "left-[7%] top-[20%]", color: "bg-[var(--brand-blue)]", shape: 0, delay: -3, duration: 18 },
  { position: "right-[10%] top-[16%]", color: "bg-[var(--brand-amber)]", shape: 1, delay: -10, duration: 20 },
  { position: "left-[16%] top-[53%]", color: "bg-[var(--brand-lime)]", shape: 2, delay: -7, duration: 22 },
  { position: "right-[6%] top-[57%]", color: "bg-[var(--brand-blue)]", shape: 0, delay: -13, duration: 19 },
  { position: "left-[5%] top-[83%] hidden sm:block", color: "bg-[var(--brand-amber)]", shape: 1, delay: -16, duration: 21 },
  { position: "right-[20%] top-[86%] hidden sm:block", color: "bg-[var(--brand-lime)]", shape: 2, delay: -5, duration: 18 },
] as const;

type PixelStyle = CSSProperties & {
  [key: `--pixel-${string}`]: string;
};

/** Decorative, CSS-only motion. Place inside a relative, isolated background. */
export function PixelBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden opacity-60 motion-reduce:hidden sm:opacity-80 [mask-image:linear-gradient(90deg,#000,rgba(0,0,0,0.2)_40%,rgba(0,0,0,0.2)_60%,#000)]"
    >
      {clusters.map((cluster, clusterIndex) => (
        <div key={clusterIndex} className={`absolute ${cluster.position}`}>
          {shapes[cluster.shape].map(([column, row], pixelIndex) => {
            // Fixed offsets keep server and client markup identical.
            const direction = pixelIndex % 2 === 0 ? 1 : -1;
            const style: PixelStyle = {
              left: `${column * 10}px`,
              top: `${row * 10}px`,
              animationDuration: `${cluster.duration}s`,
              animationDelay: `${cluster.delay - pixelIndex * 0.065}s`,
              "--pixel-x": `${direction * (30 + pixelIndex * 13)}px`,
              "--pixel-y": `${((pixelIndex * 37 + clusterIndex * 23) % 140) - 70}px`,
              "--pixel-exit-x": `${-direction * (25 + pixelIndex * 9)}px`,
              "--pixel-exit-y": `${-50 - pixelIndex * 10}px`,
            };

            return (
              <span
                key={pixelIndex}
                style={style}
                className={`absolute size-[6px] animate-pixel-build ${cluster.color} sm:size-[7px]`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
