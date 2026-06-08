import styles from "./PhoneFrame.module.css";

interface Props {
  children: React.ReactNode;
  width?: number;
}

export default function PhoneFrame({ children, width = 450 }: Props) {
  return (
    <div
      className={styles.outer}
      style={{ ["--phone-w" as string]: `${width}px` }}
    >
      <div className={styles.screen}>{children}</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/iphone-frame.png"
        alt=""
        className={styles.frame}
        draggable={false}
      />
    </div>
  );
}
