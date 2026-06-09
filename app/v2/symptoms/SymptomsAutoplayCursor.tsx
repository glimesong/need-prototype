"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSymptomsAutoplay } from "./SymptomsAutoplayContext";
import styles from "../../components/AutoplayCursor.module.css";

const CURSOR_START = { x: 360, y: 870 };

export default function SymptomsAutoplayCursor() {
  const { step, userTakeover, reportRef, callRef, screenRef } = useSymptomsAutoplay();
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let el: HTMLElement | null = null;
      if (step === "cursorToReport" || step === "tapReport") {
        el = reportRef.current;
      } else if (step === "cursorToCall" || step === "tapCall") {
        el = callRef.current;
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
  }, [step, reportRef, callRef, screenRef]);

  if (userTakeover) return null;

  const showCursor =
    step === "cursorToReport" ||
    step === "tapReport" ||
    step === "cursorToCall" ||
    step === "tapCall";
  const showRipple = step === "tapReport" || step === "tapCall";

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
