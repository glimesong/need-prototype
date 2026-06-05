"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useNeedAutoplay } from "../lib/AutoplayContext";
import styles from "./AutoplayCursor.module.css";

/* Coordinates inside the 412×892 Android phone screen.
   The first prompt chip ("Learn / how Need works") sits in the chipStack
   at outer x:16 padding, 12px chip padding, two 16/20 lines of text. */
const CHIP_TARGET = { x: 77, y: 720 };
const CURSOR_START = { x: 332, y: 830 };

export default function AutoplayCursor() {
  const { step, userTakeover } = useNeedAutoplay();
  if (userTakeover) return null;

  const showCursor = step === "cursorIn" || step === "tapChip";
  const showRipple = step === "tapChip";

  const pos = showCursor ? CHIP_TARGET : CURSOR_START;

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
