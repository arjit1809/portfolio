import { useEffect } from "react";
import { animate, svg, stagger } from "animejs";

interface CinematicLoaderProps {
  onFinish: () => void;
}

export default function CinematicLoader({ onFinish }: CinematicLoaderProps) {

  useEffect(() => {
    // Note: svg.createDrawable handles paths, circles, etc.
    animate(svg.createDrawable(".line"), {
      // @ts-ignore
      draw: ["0 0", "0 1", "1 1"],
      ease: "cubicBezier(0.65, 0, 0.35, 1)", // ✍️ natural hand motion
      duration: 4200,
      delay: stagger(300),
    });

    // subtle breathing glow
    const glowTimer = setTimeout(() => {
      animate(".line", {
        opacity: [0.7, 1],
        duration: 1500,
        direction: "alternate",
        loop: true,
        ease: "inOutSine",
      });
    }, 4300);

    // cinematic exit
    const exitTimer = setTimeout(() => {
      animate("#loaderRoot", {
        opacity: [1, 0],
        scale: [1, 1.04],
        filter: ["blur(0px)", "blur(5px)"],
        duration: 1000,
        ease: "easeInOutQuad",
        complete: () => onFinish(),
      });
    }, 6200);

    return () => {
      clearTimeout(glowTimer);
      clearTimeout(exitTimer);
    };

  }, [onFinish]);

  return (
    <div id="loaderRoot" style={styles.loader as React.CSSProperties}>
      
      <svg
        viewBox="0 0 420 150"
        preserveAspectRatio="xMidYMid meet"
        style={styles.svg as React.CSSProperties}
      >
        <defs>
          <linearGradient id="grad">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* A (clear triangular form) */}
        <path className="line" style={styles.path as React.CSSProperties}
          d="M20 120 L45 30 L70 120 
             M30 85 L60 85" />

        {/* r */}
        <path className="line" style={styles.path as React.CSSProperties}
          d="M90 120 L90 70 
             Q90 50 110 50 
             Q125 50 125 70" />

        {/* j */}
        <path className="line" style={styles.path as React.CSSProperties}
          d="M150 50 L150 110 
             Q150 140 120 140" />

        {/* i */}
        <path className="line" style={styles.path as React.CSSProperties}
          d="M180 70 L180 120" />
        <circle cx="180" cy="50" r="3" className="line" style={styles.path as React.CSSProperties} />

        {/* t */}
        <path className="line" style={styles.path as React.CSSProperties}
          d="M210 40 L210 120 
             M190 70 L235 70" />

        {/* dot */}
        <circle cx="260" cy="120" r="3" className="line" style={styles.path as React.CSSProperties} />
      </svg>

    </div>
  );
}

const styles = {
  loader: {
    position: "fixed",
    inset: 0,
    background: "#050505",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  svg: {
    width: "55vw",
    maxWidth: "480px",
  },
  path: {
    fill: "none",
    stroke: "url(#grad)",
    strokeWidth: 2.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    filter: "url(#glow)",
  },
};
