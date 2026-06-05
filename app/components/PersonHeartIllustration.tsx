"use client";

import { motion } from "framer-motion";
import styles from "./PersonHeartIllustration.module.css";

interface Props {
  /** When true, the line art draws itself in. */
  drawIn: boolean;
}

/**
 * Hand-drawn character hugging a bright green heart — approximation of the
 * Figma Need onboarding character (node 3687:37139). Strokes draw in via
 * pathLength animation; once drawn, the heart breathes with a subtle pulse.
 */
export default function PersonHeartIllustration({ drawIn }: Props) {
  const inkStroke = "#111";
  const heartStroke = "#34d76b";

  const drawTransition = (delay: number, duration = 1.2) =>
    ({
      duration,
      delay,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    } as const);

  const lineState = drawIn
    ? { pathLength: 1, opacity: 1 }
    : { pathLength: 0, opacity: 0 };

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        width="280"
        height="320"
        viewBox="0 0 280 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Hair tufts (4 short strokes on crown) ── */}
        <motion.path
          d="M132 12 L130 2 M144 11 L146 0 M156 13 L160 4 M168 17 L174 8"
          stroke={inkStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.0, 0.6)}
        />

        {/* ── Head (oval, slight rightward lean) ── */}
        <motion.path
          d="M178 50
             C 180 32  166 18  148 17
             C 128 16  114 30  114 50
             C 114 70  126 80  144 80
             C 162 80  176 70  178 50 Z"
          stroke={inkStroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.05)}
        />

        {/* ── Eyebrows (subtle, slightly raised) ── */}
        <motion.path
          d="M133 41 q4 -2 8 0 M156 41 q4 -2 8 0"
          stroke={inkStroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.55, 0.5)}
        />

        {/* ── Eyes (closed/relaxed arcs — content expression) ── */}
        <motion.path
          d="M133 49 q4 4 8 0"
          stroke={inkStroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.65, 0.4)}
        />
        <motion.path
          d="M156 49 q4 4 8 0"
          stroke={inkStroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.7, 0.4)}
        />

        {/* ── Mouth (small smile) ── */}
        <motion.path
          d="M141 63 q6 5 14 0"
          stroke={inkStroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.8, 0.4)}
        />

        {/* ── Neck ── */}
        <motion.path
          d="M134 80 L130 92 M165 80 L170 92"
          stroke={inkStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.1, 0.5)}
        />

        {/* ── Shoulders + body left (A-line robe outline) ── */}
        <motion.path
          d="M130 92
             C 116 96  98 108  86 130
             C 70 162  56 220  46 290
             C 44 300  46 308  56 310
             L 100 310
             L 120 250"
          stroke={inkStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.15, 1.4)}
        />

        {/* ── Shoulders + body right ── */}
        <motion.path
          d="M170 92
             C 184 96  202 108  214 130
             C 232 162  246 220  254 290
             C 256 300  254 308  244 310
             L 200 310
             L 180 250"
          stroke={inkStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.18, 1.4)}
        />

        {/* ── Inner leg / centerline ── */}
        <motion.path
          d="M150 250 L150 310"
          stroke={inkStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.25, 0.6)}
        />

        {/* ── Bottom hem ── */}
        <motion.path
          d="M100 310 L200 310"
          stroke={inkStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.3, 0.5)}
        />

        {/* ── HEART (bright green, hand-drawn) ──
             Drawn AFTER character outline; sits on top, wrapping the torso. */}
        <motion.g
          animate={
            drawIn
              ? { scale: [1, 1.025, 1] }
              : { scale: 1 }
          }
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8,
          }}
          style={{ transformOrigin: "150px 180px", transformBox: "fill-box" } as React.CSSProperties}
        >
          <motion.path
            d="M150 138
               C 122 110  70 122  64 168
               C 60 210  118 250  150 270
               C 182 250  240 210  236 168
               C 230 122  178 110  150 138 Z"
            stroke={heartStroke}
            strokeWidth="9"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              drawIn
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 1.6, delay: 0.7, ease: "easeOut" }}
          />
        </motion.g>

        {/* ── Right arm (visible, bent at chest level holding the heart) ── */}
        <motion.path
          d="M134 130
             C 134 150  138 168  146 180
             C 152 188  158 192  165 194"
          stroke={inkStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(0.4, 0.9)}
        />

        {/* ── Right hand: fingers curled, holding heart ── */}
        <motion.path
          d="M146 190
             c 0 -3 3 -6 7 -7
             c 4 -1 9 0 12 3
             c 2 2 3 4 2 6
             c -1 2 -3 3 -5 3
             c -3 0 -7 -1 -10 -2
             c -3 -1 -5 -2 -6 -3 Z"
          stroke={inkStroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(1.0, 0.8)}
        />

        {/* ── Finger details ── */}
        <motion.path
          d="M152 188 l-1 4 M158 187 l0 5 M163 188 l1 4"
          stroke={inkStroke}
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(1.5, 0.5)}
        />

        {/* ── Left arm wrap (visible emerging from behind heart, lower right) ── */}
        <motion.path
          d="M196 200
             c 4 4 8 6 12 6
             c 4 0 8 -1 12 -4"
          stroke={inkStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={lineState}
          transition={drawTransition(1.6, 0.7)}
        />
      </svg>
    </div>
  );
}
