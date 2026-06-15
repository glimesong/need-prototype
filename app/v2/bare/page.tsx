import styles from "../../page.module.css";
import V2Screen from "../V2Screen";
import V2AutoplayCursor from "../V2AutoplayCursor";
import { V2AutoplayProvider } from "../V2AutoplayContext";
import { PlatformProvider } from "../../lib/PlatformContext";

export const dynamic = "force-dynamic";

/**
 * Bezel-less variant of /v2/iphone — renders the V2Screen content alone
 * (no PhoneFrame chrome).  Used by embeds where the host already provides
 * a phone frame, or where a clean screen is preferred (e.g. the gallery
 * card on the portfolio home page).
 *
 * Container preserves the iPhone 17 screen aspect (402:874) so V2Screen
 * renders without distortion.
 */
export default async function V2Bare({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const isStatic = params.static !== undefined && params.static !== "false";
  return (
    <main className={styles.stage}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "402px",
          aspectRatio: "402 / 874",
          background: "#ffffff",
          overflow: "hidden",
        }}
      >
        <PlatformProvider value="ios">
          <V2AutoplayProvider disabled={isStatic}>
            <V2Screen />
            <V2AutoplayCursor />
          </V2AutoplayProvider>
        </PlatformProvider>
      </div>
    </main>
  );
}
