import styles from "../../../page.module.css";
import AndroidPhoneFrame from "../../../components/AndroidPhoneFrame";
import V2Screen from "../../V2Screen";
import V2AutoplayCursor from "../../V2AutoplayCursor";
import { V2AutoplayProvider } from "../../V2AutoplayContext";
import { PlatformProvider } from "../../../lib/PlatformContext";

export default function V2Japanese() {
  return (
    <main className={styles.stage}>
      <AndroidPhoneFrame width={412}>
        <PlatformProvider value="android">
          <V2AutoplayProvider>
            <V2Screen locale="ja" />
            <V2AutoplayCursor />
          </V2AutoplayProvider>
        </PlatformProvider>
      </AndroidPhoneFrame>
    </main>
  );
}
