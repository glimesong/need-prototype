"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

export type SymptomsStep =
  | "idle"
  | "cursorToReport"
  | "tapReport"
  | "modalDwell"
  | "cursorToCancel"
  | "tapCancel"
  | "reset";

interface StepDef {
  step: SymptomsStep;
  duration: number;
}

export const SYMPTOMS_TIMELINE: StepDef[] = [
  { step: "idle", duration: 1500 },
  { step: "cursorToReport", duration: 900 },
  { step: "tapReport", duration: 400 },
  { step: "modalDwell", duration: 1400 },
  { step: "cursorToCancel", duration: 800 },
  { step: "tapCancel", duration: 400 },
  { step: "reset", duration: 1200 },
];

const TOTAL = SYMPTOMS_TIMELINE.reduce((s, t) => s + t.duration, 0);

function getStepAt(elapsed: number) {
  let acc = 0;
  for (let i = 0; i < SYMPTOMS_TIMELINE.length; i++) {
    const d = SYMPTOMS_TIMELINE[i].duration;
    if (elapsed < acc + d) {
      return {
        step: SYMPTOMS_TIMELINE[i].step,
        stepIndex: i,
        t: (elapsed - acc) / d,
      };
    }
    acc += d;
  }
  return { step: "reset" as SymptomsStep, stepIndex: SYMPTOMS_TIMELINE.length - 1, t: 1 };
}

interface State {
  step: SymptomsStep;
  stepIndex: number;
  t: number;
  userTakeover: boolean;
  loopCount: number;
}

interface Ctx extends State {
  takeOver: () => void;
  screenRef: React.MutableRefObject<HTMLDivElement | null>;
  reportRef: React.MutableRefObject<HTMLButtonElement | null>;
  cancelRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const C = createContext<Ctx | null>(null);

export function useSymptomsAutoplay() {
  const v = useContext(C);
  if (!v)
    throw new Error("useSymptomsAutoplay must be used inside <SymptomsAutoplayProvider>");
  return v;
}

export function SymptomsAutoplayProvider({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [state, setState] = useState<State>({
    step: "idle",
    stepIndex: 0,
    t: 0,
    userTakeover: false,
    loopCount: 0,
  });

  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const loopRef = useRef<number>(0);
  const userTakeoverRef = useRef<boolean>(disabled);

  const screenRef = useRef<HTMLDivElement | null>(null);
  const reportRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const tick = useCallback((now: number) => {
    if (userTakeoverRef.current) return;
    if (!startRef.current) startRef.current = now;
    const elapsed = now - startRef.current;

    if (elapsed >= TOTAL) {
      loopRef.current += 1;
      startRef.current = now;
      setState((s) => ({
        ...s,
        loopCount: loopRef.current,
        step: "idle",
        stepIndex: 0,
        t: 0,
      }));
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
    setState((s) => ({ ...s, userTakeover: true }));
  }, []);

  return (
    <C.Provider
      value={{
        ...state,
        takeOver,
        screenRef,
        reportRef,
        cancelRef,
      }}
    >
      {children}
    </C.Provider>
  );
}
