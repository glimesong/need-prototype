import styles from "./page.module.css";
import AndroidPhoneFrame from "./components/AndroidPhoneFrame";
import NeedScreen from "./components/NeedScreen";
import AutoplayCursor from "./components/AutoplayCursor";
import { NeedAutoplayProvider } from "./lib/AutoplayContext";

export default function Home() {
  return (
    <main className={styles.stage}>
      <AndroidPhoneFrame width={412}>
        <NeedAutoplayProvider>
          <NeedScreen />
          <AutoplayCursor />
        </NeedAutoplayProvider>
      </AndroidPhoneFrame>
    </main>
  );
}
