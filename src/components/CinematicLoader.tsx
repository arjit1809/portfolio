import { useEffect, useRef } from "react";
import { animate, svg, stagger } from "animejs";

interface CinematicLoaderProps {
  onFinish: () => void;
}

export default function CinematicLoader({ onFinish }: CinematicLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const paths = document.querySelectorAll(".line") as NodeListOf<SVGPathElement>;

    console.log("Loader started, paths found:", paths.length);

    // DRAW ANIMATION
    animate(svg.createDrawable(".line"), {
      // @ts-ignore - Anime.js v4 types
      draw: ["0 0", "0 1"],
      ease: "inOutQuad",
      duration: 2200,
      delay: stagger(180),
      begin: () => console.log("Animation started"),
      complete: () => console.log("Animation complete")
    });

    // CANVAS
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;

      constructor(x: number, y: number, burstMode = false) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * (burstMode ? 6 : 1.5);
        this.vy = (Math.random() - 0.5) * (burstMode ? 6 : 1.5);
        this.life = burstMode ? 80 : 60;
        this.maxLife = this.life;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,100,255,${this.life / this.maxLife})`;
        ctx.fill();
      }
    }

    function getPoint(path: SVGPathElement, t: number) {
      const length = path.getTotalLength();
      return path.getPointAtLength(t * length);
    }

    let progress = 0;
    let animationFrameId: number;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      progress += 0.004;

      paths.forEach((path) => {
        const pt = getPoint(path, progress % 1);
        const rect = path.getBoundingClientRect();

        particles.push(
          new Particle(pt.x + rect.left, pt.y + rect.top, false)
        );
      });

      particles = particles.filter((p) => p.life > 0);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    // 💥 BURST EFFECT
    const burstTimeout = setTimeout(() => {
      paths.forEach((path) => {
        const rect = path.getBoundingClientRect();

        for (let i = 0; i < 80; i++) {
          particles.push(
            new Particle(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
              true
            )
          );
        }
      });
    }, 2400);

    // 🌫️ EXIT TRANSITION
    const exitTimeout = setTimeout(() => {
      animate("#loaderRoot", {
        opacity: [1, 0],
        scale: [1, 1.1],
        filter: ["blur(0px)", "blur(10px)"],
        duration: 900,
        ease: "easeInOutQuad",
        complete: () => {
          onFinish();
        },
      });
    }, 3000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(burstTimeout);
      clearTimeout(exitTimeout);
    };
  }, [onFinish]);

  return (
    <div id="loaderRoot" style={styles.loader as React.CSSProperties}>
      <canvas ref={canvasRef} style={styles.canvas as React.CSSProperties} />

      <svg viewBox="0 0 600 150" style={styles.svg as React.CSSProperties}>
        <defs>
          <linearGradient id="grad">
            <stop offset="0%" stopColor="purple" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
        </defs>

        <path className="line" d="M20 120 L50 30 L80 120 M35 80 L65 80" stroke="white" fill="none" strokeWidth="2" />
        <path className="line" d="M100 120 L100 60 Q100 40 120 40 Q140 40 140 60" stroke="white" fill="none" strokeWidth="2" />
        <path className="line" d="M170 40 L170 110 Q170 140 150 140" stroke="white" fill="none" strokeWidth="2" />
        <path className="line" d="M200 60 L200 120" stroke="white" fill="none" strokeWidth="2" />
        <path className="line" d="M240 40 L240 120 M220 60 L260 60" stroke="white" fill="none" strokeWidth="2" />
      </svg>
    </div>
  );
}

const styles = {
  loader: {
    position: "fixed",
    inset: 0,
    background: "#050505",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  svg: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(600px, 90vw)",
    height: "auto",
    zIndex: 10,
  },
};
