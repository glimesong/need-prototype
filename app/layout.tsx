import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const need = localFont({
  src: [
    {
      path: "./fonts/NeedStandard-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NeedStandard-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-need",
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Inter", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Need — interactive prototype",
  description:
    "Need app prototype — an AI-first cancer protection conversation for Lime Song's Need case study (limesong.design)",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={need.variable}>
      <body>{children}</body>
    </html>
  );
}
