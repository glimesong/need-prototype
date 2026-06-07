import styles from "./V2Keyboard.module.css";

const ROW_1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ROW_2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ROW_3 = ["z", "x", "c", "v", "b", "n", "m"];

export default function V2Keyboard() {
  return (
    <div className={styles.wrap}>
      <div className={styles.keyboard}>
        {/* Suggestion strip — Gboard style, plain text suggestions */}
        <div className={styles.suggestStrip}>
          <div className={styles.suggestCell}>
            <span className={styles.suggestText}>I</span>
          </div>
          <div className={`${styles.suggestCell} ${styles.suggestCellActive}`}>
            <span className={`${styles.suggestText} ${styles.suggestTextBold}`}>The</span>
          </div>
          <div className={styles.suggestCell}>
            <span className={styles.suggestText}>What</span>
          </div>
        </div>

        <div className={styles.keys}>
          <div className={styles.row}>
            {ROW_1.map((l) => (
              <div key={l} className={styles.key}>
                {l}
              </div>
            ))}
          </div>
          <div className={`${styles.row} ${styles.row2}`}>
            {ROW_2.map((l) => (
              <div key={l} className={styles.key}>
                {l}
              </div>
            ))}
          </div>
          <div className={`${styles.row} ${styles.row3}`}>
            <div className={`${styles.key} ${styles.keyUtility}`} aria-label="Shift">
              <IconShift />
            </div>
            <div className={styles.row3LettersWrap}>
              {ROW_3.map((l) => (
                <div key={l} className={styles.key}>
                  {l}
                </div>
              ))}
            </div>
            <div className={`${styles.key} ${styles.keyDelete}`} aria-label="Delete">
              <IconDelete />
            </div>
          </div>
          <div className={`${styles.row} ${styles.row4}`}>
            <div className={`${styles.key} ${styles.key123}`}>?123</div>
            <div className={`${styles.key} ${styles.keyComma}`}>,</div>
            <div className={`${styles.key} ${styles.keySpace}`}>English</div>
            <div className={`${styles.key} ${styles.keyPeriod}`}>.</div>
            <div className={`${styles.key} ${styles.keyEnter}`} aria-label="Enter">
              <IconEnter />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.navPill} />
      </div>
    </div>
  );
}

/* ───────────── Gboard icons ───────────── */
function IconShift() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M11 4 L18 11 H14.5 V17 H7.5 V11 H4 Z"
        stroke="#1d1b20"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function IconDelete() {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" aria-hidden>
      <path
        d="M8 4 H19 C20 4 20.5 4.4 20.5 5.5 V14.5 C20.5 15.6 20 16 19 16 H8 L1.5 10 Z"
        stroke="#1d1b20"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M11 7.5 L16 12.5 M16 7.5 L11 12.5"
        stroke="#1d1b20"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEnter() {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" aria-hidden>
      <path
        d="M18 5 V9 C18 10.1 17.1 11 16 11 H5 M5 11 L9 7 M5 11 L9 15"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
