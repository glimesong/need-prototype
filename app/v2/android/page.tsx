import styles from "../../page.module.css";
import AndroidPhoneFrame from "../../components/AndroidPhoneFrame";
import V2Screen from "../V2Screen";
import V2AutoplayCursor from "../V2AutoplayCursor";
import { V2AutoplayProvider } from "../V2AutoplayContext";
import { PlatformProvider } from "../../lib/PlatformContext";

export default async function V2({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  // `?static` (or `?static=true`) pins the prototype to the idle home chat
  // page — no cursor, no autoplay. Used for slides that want a calm,
  // non-looping preview.
  const isStatic = params.static !== undefined && params.static !== "false";
  return (
    <main className={styles.stage}>
      <AndroidPhoneFrame width={412}>
        <PlatformProvider value="android">
          <V2AutoplayProvider disabled={isStatic}>
            <V2Screen />
            <V2AutoplayCursor />
          </V2AutoplayProvider>
        </PlatformProvider>
      </AndroidPhoneFrame>
    </main>
  );
}
