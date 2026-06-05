import styles from "./AndroidPhoneFrame.module.css";

interface Props {
  children: React.ReactNode;
  width?: number;
}

export default function AndroidPhoneFrame({ children, width = 412 }: Props) {
  return (
    <div
      className={styles.outer}
      style={{ ["--phone-w" as string]: `${width}px` }}
    >
      <div className={styles.screen}>{children}</div>
    </div>
  );
}
