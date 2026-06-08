import styles from "./IOSKeyboard.module.css";

const ROW_1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ROW_2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ROW_3 = ["z", "x", "c", "v", "b", "n", "m"];

export default function IOSKeyboard() {
  return (
    <div className={styles.keyboard}>
      <div className={styles.predictiveBar}>
        <div className={styles.predictiveItem}>“The”</div>
        <span className={styles.predictiveDivider} />
        <div className={styles.predictiveItem}>the</div>
        <span className={styles.predictiveDivider} />
        <div className={styles.predictiveItem}>to</div>
      </div>
      <div className={styles.keys}>
        <div className={styles.row}>
          {ROW_1.map((k) => (
            <div key={k} className={styles.key}>{k}</div>
          ))}
        </div>
        <div className={`${styles.row} ${styles.row2}`}>
          {ROW_2.map((k) => (
            <div key={k} className={styles.key}>{k}</div>
          ))}
        </div>
        <div className={`${styles.row} ${styles.row3}`}>
          <div className={`${styles.key} ${styles.modKey}`}>⇧</div>
          <div className={styles.row3Inner}>
            {ROW_3.map((k) => (
              <div key={k} className={styles.key}>{k}</div>
            ))}
          </div>
          <div className={`${styles.key} ${styles.modKey}`}>⌫</div>
        </div>
        <div className={styles.row}>
          <div className={`${styles.key} ${styles.abcKey}`}>ABC</div>
          <div className={`${styles.key} ${styles.spaceKey}`}>&nbsp;</div>
          <div className={`${styles.key} ${styles.returnKey}`}>↵</div>
        </div>
      </div>
      <div className={styles.emojiMicBar}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kb-emoji.svg" alt="" width={27} height={27} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kb-mic.svg" alt="" width={19} height={28} />
      </div>
    </div>
  );
}
