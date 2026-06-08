"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./V2Screen.module.css";
import V2Keyboard from "./V2Keyboard";
import { useV2Autoplay } from "./V2AutoplayContext";
import { getV2Strings, type V2Locale } from "./strings";

type Mode = "idle" | "focused" | "thinking" | "answer";

const UTILITY_ICONS: React.ReactNode[] = [
  <IconBookScreening key="book" />,
  <IconReport key="report" />,
  <IconSummarize key="summarize" />,
  <IconDiscover key="discover" />,
];

export default function V2Screen({ locale = "en" }: { locale?: V2Locale } = {}) {
  const strings = useMemo(() => getV2Strings(locale), [locale]);
  const [mode, setMode] = useState<Mode>("idle");
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [revealCount, setRevealCount] = useState(0);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const {
    step: autoStep,
    userTakeover,
    takeOver,
    screenRef,
    composerRef,
    firstPromptRef,
    scrollDownRef,
  } = useV2Autoplay();
  const prevAutoStepRef = useRef<string>(autoStep);

  // Drive mode from autoplay timeline until the user takes over.
  useEffect(() => {
    if (userTakeover) return;
    if (prevAutoStepRef.current === autoStep) return;
    prevAutoStepRef.current = autoStep;
    if (autoStep === "tapComposer") {
      setMode("focused");
    } else if (autoStep === "tapPrompt") {
      setUserMessage(strings.suggestedPrompts[0]);
      setMode("thinking");
      setRevealCount(0);
      setCanScrollDown(false);
      if (chatRef.current) chatRef.current.scrollTop = 0;
    } else if (autoStep === "tapScroll") {
      const el = chatRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else if (autoStep === "reset") {
      setMode("idle");
      setUserMessage(null);
      setRevealCount(0);
      setCanScrollDown(false);
    }
  }, [autoStep, userTakeover, strings]);

  const isChat = mode === "thinking" || mode === "answer";
  const answerComplete = mode === "answer" && revealCount >= 8;
  const endReached = !canScrollDown;

  // thinking → answer transition + staggered section reveal
  useEffect(() => {
    if (mode !== "thinking") return;
    const t = setTimeout(() => {
      setMode("answer");
      setRevealCount(1);
    }, 1400);
    return () => clearTimeout(t);
  }, [mode]);

  useEffect(() => {
    if (mode !== "answer") return;
    // total chunks: intro + 3 sections + outro heading + outro body + outro body2 + followup = 8
    const TOTAL = 8;
    if (revealCount >= TOTAL) return;
    const t = setTimeout(() => setRevealCount((n) => n + 1), 420);
    return () => clearTimeout(t);
  }, [mode, revealCount]);

  // Recompute scroll state whenever chat content grows during reveal
  // (also covers the initial mount and post-thinking transition).
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.clientHeight - el.scrollTop;
    setCanScrollDown(dist > 16);
  }, [mode, revealCount]);

  const handleChatScroll = useCallback(() => {
    const el = chatRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.clientHeight - el.scrollTop;
    setCanScrollDown(dist > 16);
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  const showScrollDown = isChat && canScrollDown;

  const sendPrompt = (text: string) => {
    setUserMessage(text);
    setMode("thinking");
    setRevealCount(0);
    setCanScrollDown(false);
    if (chatRef.current) chatRef.current.scrollTop = 0;
  };

  const sendPromptUser = (text: string) => {
    takeOver();
    sendPrompt(text);
  };

  const handleScreenClick = () => {
    takeOver();
    if (mode === "focused") setMode("idle");
  };

  return (
    <div className={styles.screen} onClick={handleScreenClick} ref={screenRef}>
      {/* Top: status bar + nav (gradient overlay) */}
      <div className={styles.top}>
        <StatusBar />
        <NavBar chatLabel={strings.navTabs.chat} walletLabel={strings.navTabs.wallet} />
      </div>

      {/* Background aurora animation (idle only) — Figma node 3185:18360 */}
      <AnimatePresence>
        {mode === "idle" && (
          <motion.div
            className={styles.bgAnimation}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            key="bgAnim"
            aria-hidden
          >
            <div className={`${styles.bgBlob} ${styles.bgBlobA}`} />
            <div className={`${styles.bgBlob} ${styles.bgBlobB}`} />
            <div className={`${styles.bgBlob} ${styles.bgBlobC}`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle body — title + chips */}
      <AnimatePresence>
        {mode === "idle" && (
          <motion.div
            className={styles.body}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
            key="idleBody"
          >
            <div className={styles.bodyTitle}>{strings.bodyTitle}</div>
            <div className={styles.chips}>
              {strings.chips.map((c) => (
                <button key={c} className={styles.chip} tabIndex={-1}>
                  {c}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat content (thinking + answer states) */}
      <AnimatePresence>
        {isChat && userMessage && (
          <motion.div
            className={styles.chat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="chat"
            ref={chatRef}
            onScroll={handleChatScroll}
            onClick={(e) => e.stopPropagation()}
          >
            {/* User message bubble */}
            <motion.div
              className={styles.userMsgRow}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className={styles.userMsgBubble}>{userMessage}</div>
            </motion.div>

            {/* Thinking */}
            {mode === "thinking" && (
              <motion.div
                className={styles.thinkingRow}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.18 }}
              >
                <video
                  className={styles.thinkingLogo}
                  src="/need-logo.mov"
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden
                />
                <div className={styles.thinkingText}>
                  {strings.thinking}
                  <span className={styles.thinkingDots} aria-hidden>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </div>
              </motion.div>
            )}

            {/* Streaming answer */}
            {mode === "answer" && (
              <>
                {revealCount >= 1 && (
                  <Reveal>
                    <p className={styles.answerIntro}>{strings.answerIntro}</p>
                  </Reveal>
                )}
                {revealCount >= 2 && (
                  <Reveal>
                    <div className={styles.answerDivider} />
                  </Reveal>
                )}
                {strings.answerSections.map((section, i) => {
                  const requiredCount = 2 + i + 1; // 3, 4, 5
                  if (revealCount < requiredCount) return null;
                  return (
                    <Reveal key={section.heading}>
                      <div className={styles.answerSection}>
                        <h2 className={styles.answerH2}>{section.heading}</h2>
                        <ul className={styles.answerBullets}>
                          {section.bullets.map((b) => (
                            <li key={b} className={styles.answerBullet}>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  );
                })}
                {revealCount >= 6 && (
                  <Reveal>
                    <div className={styles.answerDivider} />
                  </Reveal>
                )}
                {revealCount >= 6 && (
                  <Reveal>
                    <div className={styles.answerSection}>
                      <h2 className={styles.answerH2}>{strings.answerOutro.heading}</h2>
                      <p className={styles.answerBody}>{strings.answerOutro.body}</p>
                      <p className={styles.answerBody}>{strings.answerOutro.body2}</p>
                    </div>
                  </Reveal>
                )}
                {revealCount >= 7 && (
                  <Reveal>
                    <div className={styles.answerDivider} />
                  </Reveal>
                )}
                {revealCount >= 8 && (
                  <Reveal>
                    <div>
                      <p className={styles.followupPrompt}>{strings.followupQuestion}</p>
                      <div className={styles.answerActions} style={{ marginTop: 12 }}>
                        <div className={styles.answerIcons}>
                          <IconCopy />
                          <IconThumbUp />
                          <IconThumbDown />
                        </div>
                        <div className={styles.sourcesPill}>
                          <div className={styles.sourcesThumbs}>
                            <div className={styles.sourcesThumb} />
                            <div className={styles.sourcesThumb} />
                            <div className={styles.sourcesThumb} />
                          </div>
                          <span>{strings.sources}</span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )}

                {/* Follow-up suggested prompts — appear when user reaches end of chat */}
                <AnimatePresence>
                  {answerComplete && endReached && (
                    <motion.div
                      className={styles.followupList}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                      key="followups"
                    >
                      {strings.followupPrompts.map((p, i) => (
                        <motion.button
                          type="button"
                          key={p}
                          className={styles.followupBubble}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.24, delay: 0.08 * i }}
                          onClick={() => sendPromptUser(p)}
                        >
                          {p}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat area at bottom */}
      <div className={styles.chatArea} onClick={(e) => e.stopPropagation()}>
        {/* Focused: stacked suggested prompts above composer */}
        <AnimatePresence>
          {mode === "focused" && (
            <motion.div
              className={styles.prompts}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.28,
                delay: 0.2,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              key="prompts"
            >
              {strings.suggestedPrompts.map((p, i) => (
                <button
                  type="button"
                  key={p}
                  ref={i === 0 ? firstPromptRef : undefined}
                  className={styles.promptBubble}
                  onClick={(e) => {
                    e.stopPropagation();
                    sendPromptUser(p);
                  }}
                >
                  {p}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScrollDown && (
            <motion.div
              className={styles.scrollDownWrap}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              key="scrollDown"
            >
              <button
                type="button"
                ref={scrollDownRef}
                className={styles.scrollDownBtn}
                onClick={() => {
                  takeOver();
                  scrollToBottom();
                }}
                aria-label="Scroll to bottom"
                tabIndex={-1}
              >
                <IconChevronDown />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.gradientWrap}>
          <AnimatePresence>
            {mode === "idle" && (
              <motion.div
                className={styles.utilityRow}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                key="utilityRow"
              >
                {strings.utilityLabels.map((label, i) => (
                  <button key={label} className={styles.utilityBtn} tabIndex={-1}>
                    {UTILITY_ICONS[i]}
                    <span className={styles.utilityBtnLabel}>{label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.composerRow}>
            <button className={styles.composerAddBtn} tabIndex={-1} aria-label="Add">
              <IconAdd />
            </button>
            <div
              className={styles.composerInput}
              onClick={() => {
                takeOver();
                if (mode === "idle") setMode("focused");
              }}
              role="textbox"
              ref={composerRef}
            >
              <div className={styles.composerInputInner}>
                {mode === "focused" ? (
                  <span className={styles.cursor} aria-hidden />
                ) : (
                  <span className={styles.composerPlaceholder}>{strings.composerPlaceholder}</span>
                )}
              </div>
              <button className={styles.composerMicBtn} tabIndex={-1} aria-label="Voice">
                <IconMic />
              </button>
            </div>
          </div>
        </div>

        {/* idle/chat → nav pill; focused → keyboard */}
        <AnimatePresence mode="wait">
          {mode === "focused" ? (
            <motion.div
              key="kb"
              initial={{ y: 380 }}
              animate={{ y: 0 }}
              exit={{ y: 380 }}
              transition={{ type: "tween", duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <V2Keyboard />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              className={styles.homeIndicatorWrap}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className={styles.homeIndicator} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ───────────────── Status bar (Material 3) ───────────────── */
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
        {/* Wifi outline */}
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
        {/* Signal solid */}
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
        {/* Battery */}
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

/* ───────────────── Nav bar ───────────────── */
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

/* ───────────────── Icons (from Figma SVG assets) ─────────────────
   Each icon composes one or more SVG fragments using the exact insets
   from the Figma React export. Files live in /public/v2/icons/. */

const imgStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
};

function IconMenu() {
  // 24x24, two horizontal lines (top wider, bottom shorter)
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
  // 24x24, nested hexagons + center mark
  return (
    <div style={{ position: "relative", width: 24, height: 24 }} aria-hidden>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 22,
          height: 22,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div style={{ position: "absolute", inset: "2.26% 6.7%" }}>
          <img src="/v2/icons/badge-outer.svg" alt="" style={imgStyle} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 18.333,
          height: 18.333,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div style={{ position: "absolute", inset: "2.56% 6.7%" }}>
          <img src="/v2/icons/badge-inner.svg" alt="" style={imgStyle} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 10,
          height: 10,
          transform: "translate(-50%, -50%)",
        }}
      >
        <img src="/v2/icons/badge-mark.svg" alt="" style={imgStyle} />
      </div>
    </div>
  );
}

function IconAdd() {
  // 24x24, centered 15x15 plus
  return (
    <div style={{ position: "relative", width: 24, height: 24 }} aria-hidden>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 15,
          height: 15,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div style={{ position: "absolute", inset: "-6.67%" }}>
          <img src="/v2/icons/add.svg" alt="" style={imgStyle} />
        </div>
      </div>
    </div>
  );
}

function IconMic() {
  // 24x24, mic in 18x18 inner box at (3,3)
  return (
    <div style={{ position: "relative", width: 24, height: 24, overflow: "hidden" }} aria-hidden>
      <div style={{ position: "absolute", left: 3, top: 3, width: 18, height: 18 }}>
        {/* stem (vertical line) */}
        <div style={{ position: "absolute", left: 9, top: 15, width: 0, height: 3 }}>
          <div style={{ position: "absolute", inset: "-33.33% -1px" }}>
            <img src="/v2/icons/mic-stem.svg" alt="" style={imgStyle} />
          </div>
        </div>
        {/* head pill */}
        <div
          style={{
            position: "absolute",
            background: "#111212",
            left: 5,
            top: 0,
            width: 8,
            height: 12,
            borderRadius: 150,
          }}
        />
        {/* cup (bottom arc) */}
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
  // 16x16, calendar (Union)
  return (
    <div style={{ position: "relative", width: 16, height: 16 }} aria-hidden>
      <div style={{ position: "absolute", left: 0.5, top: 0.5, width: 15, height: 15 }}>
        <img src="/v2/icons/book.svg" alt="" style={imgStyle} />
      </div>
    </div>
  );
}

function IconReport() {
  // 16x16
  return (
    <div style={{ position: "relative", width: 16, height: 16 }} aria-hidden>
      <div style={{ position: "absolute", left: 0, top: 0.8, width: 16, height: 14.401 }}>
        <img src="/v2/icons/report.svg" alt="" style={imgStyle} />
      </div>
    </div>
  );
}

function IconSummarize() {
  // 16x16, centered 15.8x15.8
  return (
    <div style={{ position: "relative", width: 16, height: 16 }} aria-hidden>
      <div
        style={{
          position: "absolute",
          left: "1.25%",
          right: "1.25%",
          top: "50%",
          aspectRatio: "1",
          transform: "translateY(-50%)",
        }}
      >
        <img src="/v2/icons/summarize.svg" alt="" style={imgStyle} />
      </div>
    </div>
  );
}

function IconChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 5 L8 12 L14 5"
        stroke="#111212"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="6" y="6" width="11" height="11" rx="2" stroke="#5b5d63" strokeWidth="1.5" fill="none" />
      <path
        d="M14 6 V4 C14 3 13.3 2.5 12.5 2.5 H5 C4 2.5 3.5 3 3.5 4 V12 C3.5 13 4 13.5 5 13.5 H6"
        stroke="#5b5d63"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconThumbUp() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M7 9 L7 16 H4.5 V9 Z M7 9 L10 3 C10.5 2 11.5 2.2 11.7 3.2 L11.2 7 H15.5 C16.5 7 17 7.8 16.8 8.8 L15.5 14.5 C15.3 15.5 14.5 16 13.6 16 H7"
        stroke="#5b5d63"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function IconThumbDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M13 11 L13 4 H15.5 V11 Z M13 11 L10 17 C9.5 18 8.5 17.8 8.3 16.8 L8.8 13 H4.5 C3.5 13 3 12.2 3.2 11.2 L4.5 5.5 C4.7 4.5 5.5 4 6.4 4 H13"
        stroke="#5b5d63"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function IconDiscover() {
  // 16x16
  return (
    <div style={{ position: "relative", width: 16, height: 16 }} aria-hidden>
      <div style={{ position: "absolute", left: "3.13%", right: "3.13%", top: 0.5, height: 15 }}>
        <img src="/v2/icons/discover.svg" alt="" style={imgStyle} />
      </div>
    </div>
  );
}
