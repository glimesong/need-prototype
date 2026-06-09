import styles from "../../page.module.css";
import PhoneFrame from "../../components/PhoneFrame";
import SymptomsScreen from "./SymptomsScreen";
import SymptomsAutoplayCursor from "./SymptomsAutoplayCursor";
import { SymptomsAutoplayProvider } from "./SymptomsAutoplayContext";
import { PlatformProvider } from "../../lib/PlatformContext";

export const dynamic = "force-dynamic";

export default async function V2Symptoms({
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
          <SymptomsAutoplayProvider disabled={isStatic}>
            <SymptomsScreen />
            <SymptomsAutoplayCursor />
          </SymptomsAutoplayProvider>
        </PlatformProvider>
      </PhoneFrame>
    </main>
  );
}
