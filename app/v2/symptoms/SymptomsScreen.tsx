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

  const {
    step: autoStep,
    userTakeover,
    takeOver,
    screenRef,
    reportRef,
    cancelRef,
  } = useSymptomsAutoplay();
  const prevAutoStepRef = useRef<string>(autoStep);

  // Drive modal state from autoplay timeline until user takes over.
  useEffect(() => {
    if (userTakeover) return;
    if (prevAutoStepRef.current === autoStep) return;
    prevAutoStepRef.current = autoStep;
    if (autoStep === "tapReport") {
      setModalOpen(true);
    } else if (autoStep === "tapCancel" || autoStep === "reset") {
      setModalOpen(false);
    }
  }, [autoStep, userTakeover]);

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    takeOver();
    setModalOpen(true);
  };
  const handleModalCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    takeOver();
    setModalOpen(false);
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
                  ref={cancelRef}
                  className={styles.iosAlertBtn}
                  onClick={handleModalCancel}
                  tabIndex={-1}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`${styles.iosAlertBtn} ${styles.iosAlertBtnPrimary}`}
                  onClick={handleModalCancel}
                  tabIndex={-1}
                >
                  Call
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
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

