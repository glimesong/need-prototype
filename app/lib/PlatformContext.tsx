"use client";

import { createContext, useContext } from "react";

export type Platform = "ios" | "android";

const Ctx = createContext<Platform>("ios");

export function usePlatform(): Platform {
  return useContext(Ctx);
}

export function PlatformProvider({
  value,
  children,
}: {
  value: Platform;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
