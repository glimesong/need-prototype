"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useV2Autoplay } from "./V2AutoplayContext";
import styles from "../components/AutoplayCursor.module.css";

/* Logical 412 × 892 phone-screen coordinate space. Cursor enters from
   the bottom-right corner, then targets are computed at runtime from
   refs on the composer input and the first suggested-prompt bubble. */
const CURSOR_START = { x: 360, y: 870 };

export default function V2AutoplayCursor() {
  const {
    step,
    userTakeover,
    composerRef,
    firstPromptRef,
    scrollDownRef,
    screenRef,
  } = useV2Autoplay();
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let el: HTMLElement | null = null;
      if (step === "cursorToComposer" || step === "tapComposer") {
        el = composerRef.current;
      } else if (step === "cursorToPrompt" || step === "tapPrompt") {
        el = firstPromptRef.current;
      } else if (step === "cursorToScroll" || step === "tapScroll") {
        el = scrollDownRef.current;
      }
      if (!el || !screenRef.current) {
        setTarget(null);
        return;
      }
      const r = el.getBoundingClientRect();
      const sr = screenRef.current.getBoundingClientRect();
      if (sr.width === 0) return;
      const sx = 412 / sr.width;
      const sy = 892 / sr.height;
      setTarget({
        x: (r.left + r.width / 2 - sr.left) * sx,
        y: (r.top + r.height / 2 - sr.top) * sy,
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [step, composerRef, firstPromptRef, scrollDownRef, screenRef]);

  if (userTakeover) return null;

  const showCursor =
    step === "cursorToComposer" ||
    step === "tapComposer" ||
    step === "cursorToPrompt" ||
    step === "tapPrompt" ||
    step === "cursorToScroll" ||
    step === "tapScroll";
  const showRipple =
    step === "tapComposer" || step === "tapPrompt" || step === "tapScroll";

  const pos = target ?? CURSOR_START;

  return (
    <AnimatePresence>
      {showCursor && (
        <motion.div
          key="cursor"
          className={styles.cursor}
          initial={{
            opacity: 0,
            scale: 0.6,
            left: CURSOR_START.x,
            top: CURSOR_START.y,
          }}
          animate={{
            opacity: 0.95,
            scale: showRipple ? [1, 0.82, 1] : 1,
            left: pos.x,
            top: pos.y,
          }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{
            duration: showRipple ? 0.3 : 0.8,
            ease: showRipple ? "easeOut" : [0.4, 0, 0.2, 1],
          }}
        >
          {showRipple && (
            <motion.span
              className={styles.ripple}
              initial={{ scale: 1, opacity: 0.55 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
