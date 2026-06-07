import styles from "../page.module.css";
import AndroidPhoneFrame from "../components/AndroidPhoneFrame";
import V2Screen from "./V2Screen";

export default function V2() {
  return (
    <main className={styles.stage}>
      <AndroidPhoneFrame width={412}>
        <V2Screen />
      </AndroidPhoneFrame>
    </main>
  );
}
