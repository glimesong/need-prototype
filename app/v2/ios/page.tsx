import styles from "../../page.module.css";
import PhoneFrame from "../../components/PhoneFrame";
import V2Screen from "../V2Screen";
import V2AutoplayCursor from "../V2AutoplayCursor";
import { V2AutoplayProvider } from "../V2AutoplayContext";
import { PlatformProvider } from "../../lib/PlatformContext";

export default async function V2IOS({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const isStatic = params.static !== undefined && params.static !== "false";
  return (
    <main className={styles.stage}>
      <PhoneFrame width={450}>
        <PlatformProvider value="ios">
          <V2AutoplayProvider disabled={isStatic}>
            <V2Screen />
            <V2AutoplayCursor />
          </V2AutoplayProvider>
        </PlatformProvider>
      </PhoneFrame>
    </main>
  );
}
