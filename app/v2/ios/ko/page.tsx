import styles from "../../../page.module.css";
import PhoneFrame from "../../../components/PhoneFrame";
import V2Screen from "../../V2Screen";
import V2AutoplayCursor from "../../V2AutoplayCursor";
import { V2AutoplayProvider } from "../../V2AutoplayContext";
import { PlatformProvider } from "../../../lib/PlatformContext";

export default function V2IOSKorean() {
  return (
    <main className={styles.stage}>
      <PhoneFrame width={450}>
        <PlatformProvider value="ios">
          <V2AutoplayProvider>
            <V2Screen locale="ko" />
            <V2AutoplayCursor />
          </V2AutoplayProvider>
        </PlatformProvider>
      </PhoneFrame>
    </main>
  );
}
