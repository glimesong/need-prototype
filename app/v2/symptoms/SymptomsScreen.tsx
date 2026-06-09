"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./SymptomsScreen.module.css";
import { useSymptomsAutoplay } from "./SymptomsAutoplayContext";
import { getV2Strings, type V2Locale } from "../strings";

const UTILITY_ICONS: React.ReactNode[] = [
  <IconBookScreening key="book" />,
  <IconReport key="report" />,
  <IconSummarize key="summarize" />,
  <IconDiscover key="discover" />,
];

export default function SymptomsScreen({ locale = "en" }: { locale?: V2Locale } = {}) {
  const strings = useMemo(() => getV2Strings(locale), [locale]);
  const [modalOpen, setModalOpen] = useState(false);
  const [callActive, setCallActive] = useState(false);

  const {
    step: autoStep,
    userTakeover,
    takeOver,
    screenRef,
    reportRef,
    callRef,
  } = useSymptomsAutoplay();
  const prevAutoStepRef = useRef<string>(autoStep);

  // Drive modal/call state from autoplay timeline until user takes over.
  useEffect(() => {
    if (userTakeover) return;
    if (prevAutoStepRef.current === autoStep) return;
    prevAutoStepRef.current = autoStep;
    if (autoStep === "tapReport") {
      setModalOpen(true);
      setCallActive(false);
    } else if (autoStep === "tapCall") {
      setModalOpen(false);
      setCallActive(true);
    } else if (autoStep === "reset") {
      setModalOpen(false);
      setCallActive(false);
    }
  }, [autoStep, userTakeover]);

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    takeOver();
    setModalOpen(true);
  };
  const handleCallConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    takeOver();
    setModalOpen(false);
    setCallActive(true);
  };
  const handleModalCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    takeOver();
    setModalOpen(false);
  };
  const handleEndCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    takeOver();
    setCallActive(false);
  };

  return (
    <div className={styles.screen} ref={screenRef}>
      {/* Top: status bar + nav (gradient overlay) */}
      <div className={styles.top}>
        <StatusBarIOS />
        <NavBar chatLabel={strings.navTabs.chat} walletLabel={strings.navTabs.wallet} />
      </div>

      {/* Background aurora animation */}
      <div className={styles.bgAnimation} aria-hidden>
        <div className={`${styles.bgBlob} ${styles.bgBlobA}`} />
        <div className={`${styles.bgBlob} ${styles.bgBlobB}`} />
        <div className={`${styles.bgBlob} ${styles.bgBlobC}`} />
      </div>

      {/* Idle body — title + chips */}
      <div className={styles.body}>
        <div className={styles.bodyTitle}>{strings.bodyTitle}</div>
        <div className={styles.chips}>
          {strings.chips.map((c) => (
            <button key={c} className={styles.chip} tabIndex={-1}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area at bottom — utility row + composer */}
      <div className={styles.chatArea}>
        <div className={styles.gradientWrap}>
          <div className={styles.utilityRow}>
            {strings.utilityLabels.map((label, i) => {
              const isReport = i === 1;
              return (
                <button
                  key={label}
                  ref={isReport ? reportRef : undefined}
                  onClick={isReport ? handleReportClick : undefined}
                  className={styles.utilityBtn}
                  tabIndex={-1}
                >
                  {UTILITY_ICONS[i]}
                  <span className={styles.utilityBtnLabel}>{label}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.composerRow}>
            <button className={styles.composerAddBtn} tabIndex={-1} aria-label="Add">
              <IconAdd />
            </button>
            <div className={styles.composerInput} role="textbox">
              <div className={styles.composerInputInner}>
                <span className={styles.composerPlaceholder}>{strings.composerPlaceholder}</span>
              </div>
              <button className={styles.composerMicBtn} tabIndex={-1} aria-label="Voice">
                <IconMic />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom dock — home indicator */}
        <div className={styles.bottomDock}>
          <div className={`${styles.dockSlot} ${styles.homeIndicatorWrap} ${styles.homeIndicatorWrapIOS}`}>
            <div className={`${styles.homeIndicator} ${styles.homeIndicatorIOS}`} />
          </div>
        </div>
      </div>

      {/* iOS system alert modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="modalBackdrop"
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={handleModalCancel}
          >
            <motion.div
              className={styles.iosAlert}
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.iosAlertBody}>
                <div className={styles.iosAlertTitle}>Call Need Navigator?</div>
                <div className={styles.iosAlertText}>
                  Connects you with a Need Navigator who can guide you through
                  reporting symptoms and next steps for care.
                </div>
              </div>
              <div className={styles.iosAlertActions}>
                <button
                  type="button"
                  className={styles.iosAlertBtn}
                  onClick={handleModalCancel}
                  tabIndex={-1}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  ref={callRef}
                  className={`${styles.iosAlertBtn} ${styles.iosAlertBtnPrimary}`}
                  onClick={handleCallConfirm}
                  tabIndex={-1}
                >
                  Call
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active call screen */}
      <AnimatePresence>
        {callActive && <CallScreen onEnd={handleEndCall} />}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────── iOS Phone in-call screen ─────────────────
   Modeled on iOS 17/18 active outgoing call. Solid dark background,
   gray avatar w/ person glyph, 3×2 glass control grid, red end-call
   button. SF-Symbol-approximate icons drawn as inline SVG. */
function CallScreen({ onEnd }: { onEnd: (e: React.MouseEvent) => void }) {
  return (
    <motion.div
      className={styles.callScreen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <StatusBarIOSCall />

      <div className={styles.callIdentity}>
        <div className={styles.callName}>Need Navigator</div>
        <div className={styles.callStatus}>
          calling
          <span className={styles.thinkingDots} aria-hidden>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>

      <div className={styles.callAvatarWrap}>
        <div className={styles.callAvatar} aria-hidden>
          <SFPersonGlyph />
        </div>
      </div>

      <div className={styles.callControls}>
        <div className={styles.callControlsGrid}>
          <CallControl label="mute" icon={<SFMicSlash />} />
          <CallControl label="keypad" icon={<SFKeypad />} />
          <CallControl label="audio" icon={<SFSpeakerWaves />} />
          <CallControl label="add" icon={<SFPhonePlus />} />
          <CallControl label="FaceTime" icon={<SFVideo />} />
          <CallControl label="contacts" icon={<SFPersonInCircle />} />
        </div>
        <button
          type="button"
          className={styles.callEndBtn}
          onClick={onEnd}
          aria-label="End call"
          tabIndex={-1}
        >
          <SFPhoneDown />
        </button>
      </div>
    </motion.div>
  );
}

function CallControl({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className={styles.callControl}>
      <div className={styles.callControlBtn}>{icon}</div>
      <div className={styles.callControlLabel}>{label}</div>
    </div>
  );
}

/* ── SF-Symbol-approximate glyphs ── */
function SFPersonGlyph() {
  // person.fill — large white glyph used as avatar placeholder
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
      <circle cx="36" cy="26" r="11" fill="#fff" />
      <path
        d="M16 56 C16 46 24.5 41 36 41 C47.5 41 56 46 56 56 C56 58 54.5 59 53 59 H19 C17.5 59 16 58 16 56 Z"
        fill="#fff"
      />
    </svg>
  );
}

function SFMicSlash() {
  // mic.slash.fill — filled mic with diagonal slash
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <rect x="12" y="6" width="6" height="13" rx="3" fill="#fff" />
      <path
        d="M8 14 V15 C8 18.9 11.1 22 15 22 C18.9 22 22 18.9 22 15 V14"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M15 22 V26" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      <line
        x1="5"
        y1="5"
        x2="25"
        y2="25"
        stroke="#fff"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SFKeypad() {
  // square.grid.3x3.fill — 3×3 of filled dots
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={7 + col * 8}
            cy={7 + row * 8}
            r="1.9"
            fill="#fff"
          />
        ))
      )}
    </svg>
  );
}

function SFSpeakerWaves() {
  // speaker.wave.2.fill — solid speaker with two arcs
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <path
        d="M6 12 H9 L14 8 V22 L9 18 H6 C5.4 18 5 17.6 5 17 V13 C5 12.4 5.4 12 6 12 Z"
        fill="#fff"
      />
      <path
        d="M17 11.5 Q19.5 15 17 18.5"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 9 Q24 15 20 21"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function SFPhonePlus() {
  // phone.badge.plus — solid phone handset with + badge top-right
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <path
        d="M9 6 L11 6 L13.5 11 L11 13 Q12.5 16.5 15.5 18 L17.5 15.5 L22.5 17 L22.5 19.5 C22.5 22 20 23.5 17.5 23 C11.5 21.5 8 18 6.5 12 C6 9.5 7 7 9 6 Z"
        fill="#fff"
      />
      <circle cx="23" cy="8" r="5.5" fill="#fff" />
      <path
        d="M23 5.2 V10.8 M20.2 8 H25.8"
        stroke="#000"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SFVideo() {
  // video.fill — camera body + lens triangle
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <rect x="4" y="9" width="15" height="12" rx="2.5" fill="#fff" />
      <path d="M19 13 L26 9.5 V20.5 L19 17 Z" fill="#fff" />
    </svg>
  );
}

function SFPersonInCircle() {
  // person.crop.circle.fill
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <circle cx="15" cy="15" r="11.5" fill="#fff" />
      <circle cx="15" cy="13" r="3.6" fill="#1c1c1e" />
      <path
        d="M7.8 23.5 C8.9 20 11.7 18.2 15 18.2 C18.3 18.2 21.1 20 22.2 23.5"
        stroke="#1c1c1e"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function SFPhoneDown() {
  // phone.down.fill — handset rotated to hung-up position
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <g transform="rotate(135 16 16)">
        <path
          d="M9 8 L12 8 L14.5 13 L12 15 Q13.5 18.5 16.5 20 L18.5 17.5 L23.5 19 L23.5 21.5 C23.5 24 21 25.5 18.5 25 C12.5 23.5 9 20 7.5 14 C7 11.5 8 9 9 8 Z"
          fill="#fff"
        />
      </g>
    </svg>
  );
}

/* ───────────────── Status bars ───────────────── */
function StatusBarIOS() {
  return (
    <div className={`${styles.statusBar} ${styles.statusBarIOS}`}>
      <span className={`${styles.statusTime} ${styles.statusTimeIOS}`}>9:41</span>
      <div className={styles.statusIconsIOS} aria-hidden>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.8" fill="#1d1b20" />
          <rect x="5" y="5" width="3" height="7" rx="0.8" fill="#1d1b20" />
          <rect x="10" y="2" width="3" height="10" rx="0.8" fill="#1d1b20" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" fill="#1d1b20" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 2c-2.6 0-5 1-6.8 2.6L8 11.6l6.8-7C13 3 10.6 2 8 2z" fill="#1d1b20" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3" stroke="#1d1b20" fill="none" />
          <rect x="2" y="2" width="20" height="9" rx="1.5" fill="#1d1b20" />
          <rect x="24.5" y="4" width="2" height="5" rx="1" fill="#1d1b20" />
        </svg>
      </div>
    </div>
  );
}

function StatusBarIOSCall() {
  // Same shape as StatusBarIOS but white icons against dark call background.
  return (
    <div className={`${styles.statusBar} ${styles.statusBarIOS} ${styles.statusBarCall}`}>
      <span className={`${styles.statusTime} ${styles.statusTimeIOS}`} style={{ color: "#fff" }}>9:41</span>
      <div className={styles.statusIconsIOS} aria-hidden>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.8" fill="#fff" />
          <rect x="5" y="5" width="3" height="7" rx="0.8" fill="#fff" />
          <rect x="10" y="2" width="3" height="10" rx="0.8" fill="#fff" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" fill="#fff" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 2c-2.6 0-5 1-6.8 2.6L8 11.6l6.8-7C13 3 10.6 2 8 2z" fill="#fff" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3" stroke="#fff" fill="none" />
          <rect x="2" y="2" width="20" height="9" rx="1.5" fill="#fff" />
          <rect x="24.5" y="4" width="2" height="5" rx="1" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

function NavBar({ chatLabel, walletLabel }: { chatLabel: string; walletLabel: string }) {
  return (
    <div className={styles.navBar}>
      <div className={styles.navIconBtn} aria-label="Menu">
        <IconMenu />
      </div>
      <div className={styles.navTabs}>
        <div className={styles.navTab} data-active="true">
          <span>{chatLabel}</span>
          <div className={styles.navTabUnderline} />
        </div>
        <div className={styles.navTab}>
          <span>{walletLabel}</span>
        </div>
      </div>
      <div className={styles.navIconBtn} aria-label="Badge">
        <IconBadge />
      </div>
    </div>
  );
}

/* ───────────────── Home icons (shared with v2) ───────────────── */
const imgStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
};

function IconMenu() {
  return (
    <div style={{ position: "relative", width: 24, height: 24 }} aria-hidden>
      <div style={{ position: "absolute", inset: "33.33% 12.5% 66.67% 12.5%" }}>
        <div style={{ position: "absolute", inset: "-1px -5.56%" }}>
          <img src="/v2/icons/menu-top.svg" alt="" style={imgStyle} />
        </div>
      </div>
      <div style={{ position: "absolute", inset: "66.67% 37.5% 33.33% 12.5%" }}>
        <div style={{ position: "absolute", inset: "-1px -8.33%" }}>
          <img src="/v2/icons/menu-bot.svg" alt="" style={imgStyle} />
        </div>
      </div>
    </div>
  );
}

function IconBadge() {
  return (
    <div style={{ position: "relative", width: 24, height: 24 }} aria-hidden>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 22, height: 22, transform: "translate(-50%, -50%)" }}>
        <div style={{ position: "absolute", inset: "2.26% 6.7%" }}>
          <img src="/v2/icons/badge-outer.svg" alt="" style={imgStyle} />
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 18.333, height: 18.333, transform: "translate(-50%, -50%)" }}>
        <div style={{ position: "absolute", inset: "2.56% 6.7%" }}>
          <img src="/v2/icons/badge-inner.svg" alt="" style={imgStyle} />
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 10, height: 10, transform: "translate(-50%, -50%)" }}>
        <img src="/v2/icons/badge-mark.svg" alt="" style={imgStyle} />
      </div>
    </div>
  );
}

function IconAdd() {
  return (
    <div style={{ position: "relative", width: 24, height: 24 }} aria-hidden>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 15, height: 15, transform: "translate(-50%, -50%)" }}>
        <div style={{ position: "absolute", inset: "-6.67%" }}>
          <img src="/v2/icons/add.svg" alt="" style={imgStyle} />
        </div>
      </div>
    </div>
  );
}

function IconMic() {
  return (
    <div style={{ position: "relative", width: 24, height: 24, overflow: "hidden" }} aria-hidden>
      <div style={{ position: "absolute", left: 3, top: 3, width: 18, height: 18 }}>
        <div style={{ position: "absolute", left: 9, top: 15, width: 0, height: 3 }}>
          <div style={{ position: "absolute", inset: "-33.33% -1px" }}>
            <img src="/v2/icons/mic-stem.svg" alt="" style={imgStyle} />
          </div>
        </div>
        <div style={{ position: "absolute", background: "#111212", left: 5, top: 0, width: 8, height: 12, borderRadius: 150 }} />
        <div style={{ position: "absolute", left: 2.5, top: 8.5, width: 13, height: 6 }}>
          <div style={{ position: "absolute", inset: "-16.67% -7.69%" }}>
            <img src="/v2/icons/mic-cup.svg" alt="" style={imgStyle} />
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBookScreening() {
  return (
    <div style={{ position: "relative", width: 16, height: 16 }} aria-hidden>
      <div style={{ position: "absolute", left: 0.5, top: 0.5, width: 15, height: 15 }}>
        <img src="/v2/icons/book.svg" alt="" style={imgStyle} />
      </div>
    </div>
  );
}

function IconReport() {
  return (
    <div style={{ position: "relative", width: 16, height: 16 }} aria-hidden>
      <div style={{ position: "absolute", left: 0, top: 0.8, width: 16, height: 14.401 }}>
        <img src="/v2/icons/report.svg" alt="" style={imgStyle} />
      </div>
    </div>
  );
}

function IconSummarize() {
  return (
    <div style={{ position: "relative", width: 16, height: 16 }} aria-hidden>
      <div style={{ position: "absolute", left: "1.25%", right: "1.25%", top: "50%", aspectRatio: "1", transform: "translateY(-50%)" }}>
        <img src="/v2/icons/summarize.svg" alt="" style={imgStyle} />
      </div>
    </div>
  );
}

function IconDiscover() {
  return (
    <div style={{ position: "relative", width: 16, height: 16 }} aria-hidden>
      <div style={{ position: "absolute", left: "3.13%", right: "3.13%", top: 0.5, height: 15 }}>
        <img src="/v2/icons/discover.svg" alt="" style={imgStyle} />
      </div>
    </div>
  );
}

