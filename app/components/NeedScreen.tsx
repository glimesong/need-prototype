"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useNeedAutoplay } from "../lib/AutoplayContext";
import styles from "./NeedScreen.module.css";

const USER_QUESTION = "How can I prevent breast cancer?";
const AI_RESPONSE =
  "Great question. There are real, evidence-based ways to lower your risk. The biggest factors you can change day to day are staying physically active (about 150 minutes of moderate exercise a week), limiting alcohol to less than one drink per day, maintaining a healthy weight after menopause, and breastfeeding if you’ve had children. Regular screening is just as important for catching anything early. For most women that means a mammogram every 1 to 2 years starting around age 40, though your timing can vary based on family history and personal risk factors. I can help you put together a personalized prevention and screening plan that fits your age, your family history, and your lifestyle. Want to start with a quick risk assessment?";
const SUGGESTION_CHIPS = [
  { heading: "What’s", sub: "my risk?" },
  { heading: "When should", sub: "I get screened?" },
];
const TAPPED_INDEX = 0;

export default function NeedScreen() {
  const { step } = useNeedAutoplay();

  const showUser =
    step === "userQuestion" ||
    step === "aiResponse" ||
    step === "illustration" ||
    step === "chipIn" ||
    step === "cursorIn" ||
    step === "tapChip" ||
    step === "dwell";

  const showAi =
    step === "aiResponse" ||
    step === "illustration" ||
    step === "chipIn" ||
    step === "cursorIn" ||
    step === "tapChip" ||
    step === "dwell";

  const showChip =
    step === "chipIn" ||
    step === "cursorIn" ||
    step === "tapChip" ||
    step === "dwell";

  const isPressed = step === "tapChip";

  return (
    <div className={styles.screen}>
      <StatusBar />
      <TopAppBar />

      <div className={styles.body}>
        <AnimatePresence>
          {showUser && (
            <motion.div
              key="user"
              className={styles.userRow}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className={styles.userPill}>{USER_QUESTION}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAi && (
            <motion.p
              key="ai"
              className={styles.aiText}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {AI_RESPONSE}
            </motion.p>
          )}
        </AnimatePresence>

      </div>

      <div className={styles.chipLayer}>
        <AnimatePresence>
          {showChip && (
            <motion.div
              key="chips"
              className={styles.chipStack}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {SUGGESTION_CHIPS.map((chip, i) => {
                const tapped = i === TAPPED_INDEX;
                const isFirst = i === 0;
                return (
                  <motion.button
                    key={chip.heading}
                    type="button"
                    tabIndex={-1}
                    className={styles.chip}
                    data-pressed={tapped && isPressed}
                    data-first={isFirst}
                    animate={{ scale: tapped && isPressed ? 0.96 : 1 }}
                    transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <span className={styles.chipHeading}>{chip.heading}</span>
                    <span className={styles.chipSub}>{chip.sub}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.composerWrap}>
        <Composer />
        <div className={styles.navPillWrap} aria-hidden>
          <div className={styles.navPill} />
        </div>
      </div>
    </div>
  );
}

/* ── Material 3 status bar (Figma node 56576:11104) ────────
   52px tall, padded 24/10. Time left (Roboto Medium 14px / 20 line),
   24px camera cutout centered at top:18, right cluster contains
   wifi (17×17 at x=0) + signal (17×17 at x=16) + battery (8×15 at x=38, y=1).
   Exact SVG paths pulled from Figma assets. */
function StatusBar() {
  return (
    <div className={styles.statusBar}>
      <span className={styles.statusTime}>9:30</span>

      <div className={styles.cameraCutout} aria-hidden>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 0C5.37313 0 0 5.37313 0 12C0 18.6269 5.37313 24 12 24C18.6269 24 24 18.6269 24 12C24 5.37313 18.6269 0 12 0Z"
            fill="#1D1B20"
          />
        </svg>
      </div>

      <div className={styles.statusIcons} aria-hidden>
        {/* Wifi — faint triangle outline at 10% opacity */}
        <svg
          className={styles.iconWifi}
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
        >
          <path
            opacity="0.1"
            d="M8.5 1.41667C5.1 1.41667 2.125 2.90417 0 5.24167L8.5 15.5833L17 5.24167C14.875 2.90417 11.9 1.41667 8.5 1.41667Z"
            fill="#1D1B20"
          />
        </svg>

        {/* Signal — solid triangle */}
        <svg
          className={styles.iconSignal}
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
        >
          <path
            d="M15.5833 1.41667L1.41667 15.5833H15.5833V1.41667V1.41667Z"
            fill="#1D1B20"
          />
        </svg>

        {/* Battery — base + charge */}
        <svg
          className={styles.iconBattery}
          width="8"
          height="15"
          viewBox="0 0 8 15"
          fill="none"
        >
          <path
            opacity="0.3"
            d="M5.5 0H2.5V1.5H1C0.447715 1.5 0 2.00368 0 2.625V13.875C0 14.4963 0.447715 15 1 15H7C7.55228 15 8 14.4963 8 13.875V2.625C8 2.00368 7.55228 1.5 7 1.5H5.5V0Z"
            fill="#1D1B20"
          />
          <path
            d="M0 8C0 8.58333 0 13.3667 0 13.95C0 14.5299 0.447715 15 1 15H7C7.55228 15 8 14.5299 8 13.95C8 13.3667 8 8.58333 8 8H0Z"
            fill="#1D1B20"
          />
        </svg>
      </div>
    </div>
  );
}

/* ── Top app bar (Figma node 3686:37121) ─────────────────
   Back chevron on left, Need logo centered, empty slot on right. */
function TopAppBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.topBarLogo} aria-label="Need">
        <video
          className={styles.topBarLogoVideo}
          src="/need-logo.mov"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
        />
      </div>
    </div>
  );
}

function Composer() {
  return (
    <div className={styles.composer}>
      <div className={styles.composerInput}>
        <span className={styles.composerPlaceholder}>Talk to Need</span>
      </div>
      <button className={styles.composerIconBtn} aria-label="Voice" tabIndex={-1}>
        {/* Material Symbols: mic (filled) */}
        <svg
          width="24"
          height="24"
          viewBox="0 -960 960 960"
          fill="#18181b"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm-40 280v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Z" />
        </svg>
      </button>
      <button className={styles.composerIconBtn} aria-label="Add" tabIndex={-1}>
        {/* Material Symbols: add */}
        <svg
          width="24"
          height="24"
          viewBox="0 -960 960 960"
          fill="#18181b"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
      </button>
    </div>
  );
}
