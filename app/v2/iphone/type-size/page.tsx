import styles from "../../../page.module.css";
import PhoneFrame from "../../../components/PhoneFrame";
import { PlatformProvider } from "../../../lib/PlatformContext";

export const dynamic = "force-dynamic";

/**
 * Static screen embed — renders the type-need.png screenshot inside
 * the same PhoneFrame the live /v2/iphone route uses. Lets the portfolio
 * embed this as an iframe so the rendering pipeline is pixel-identical
 * to the live prototype next to it (no overlay-bezel mismatch).
 */
export default function V2IPhoneTypeSize() {
  return (
    <main className={styles.stage}>
      <PhoneFrame width={450}>
        <PlatformProvider value="ios">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/type-need.png"
            alt="Type size tuned for accessibility"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </PlatformProvider>
      </PhoneFrame>
    </main>
  );
}
