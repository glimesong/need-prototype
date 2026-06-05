"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { NeedStep, TOTAL_DURATION, getStepAt } from "./autoplay";

interface AutoplayState {
  step: NeedStep;
  stepIndex: number;
  t: number;
  userTakeover: boolean;
  loopCount: number;
}

interface AutoplayCtx extends AutoplayState {
  takeOver: () => void;
}

const Ctx = createContext<AutoplayCtx | null>(null);

export function useNeedAutoplay() {
  const v = useContext(Ctx);
  if (!v)
    throw new Error(
      "useNeedAutoplay must be used inside <NeedAutoplayProvider>"
    );
  return v;
}

export function NeedAutoplayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AutoplayState>({
    step: "idle",
    stepIndex: 0,
    t: 0,
    userTakeover: false,
    loopCount: 0,
  });

  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const loopRef = useRef<number>(0);
  const userTakeoverRef = useRef<boolean>(false);

  const tick = useCallback((now: number) => {
    if (userTakeoverRef.current) return;
    if (!startRef.current) startRef.current = now;
    const elapsed = now - startRef.current;

    if (elapsed >= TOTAL_DURATION) {
      loopRef.current += 1;
      startRef.current = now;
      setState((s) => ({ ...s, loopCount: loopRef.current }));
    } else {
      const { step, stepIndex, t } = getStepAt(elapsed);
      setState((s) =>
        s.step === step && s.stepIndex === stepIndex && Math.abs(s.t - t) < 0.01
          ? s
          : { ...s, step, stepIndex, t }
      );
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const takeOver = useCallback(() => {
    userTakeoverRef.current = true;
    setState((s) => ({ ...s, userTakeover: true, step: "idle", t: 0 }));
  }, []);

  return (
    <Ctx.Provider value={{ ...state, takeOver }}>{children}</Ctx.Provider>
  );
}
