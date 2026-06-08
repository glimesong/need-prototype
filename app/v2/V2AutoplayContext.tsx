"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

export type V2Step =
  | "idle"
  | "cursorToComposer"
  | "tapComposer"
  | "cursorToPrompt"
  | "tapPrompt"
  | "thinking"
  | "answer"
  | "postAnswerPause"
  | "cursorToScroll"
  | "tapScroll"
  | "dwell"
  | "reset";

interface StepDef {
  step: V2Step;
  duration: number;
}

export const V2_TIMELINE: StepDef[] = [
  { step: "idle", duration: 1500 },
  { step: "cursorToComposer", duration: 900 },
  { step: "tapComposer", duration: 400 },
  { step: "cursorToPrompt", duration: 1000 },
  { step: "tapPrompt", duration: 400 },
  { step: "thinking", duration: 1400 },
  { step: "answer", duration: 3500 },
  { step: "postAnswerPause", duration: 100 },
  { step: "cursorToScroll", duration: 600 },
  { step: "tapScroll", duration: 400 },
  { step: "dwell", duration: 3100 },
  { step: "reset", duration: 600 },
];

const TOTAL = V2_TIMELINE.reduce((s, t) => s + t.duration, 0);

function getStepAt(elapsed: number) {
  let acc = 0;
  for (let i = 0; i < V2_TIMELINE.length; i++) {
    const d = V2_TIMELINE[i].duration;
    if (elapsed < acc + d) {
      return {
        step: V2_TIMELINE[i].step,
        stepIndex: i,
        t: (elapsed - acc) / d,
      };
    }
    acc += d;
  }
  return { step: "reset" as V2Step, stepIndex: V2_TIMELINE.length - 1, t: 1 };
}

interface State {
  step: V2Step;
  stepIndex: number;
  t: number;
  userTakeover: boolean;
  loopCount: number;
}

interface Ctx extends State {
  takeOver: () => void;
  screenRef: React.MutableRefObject<HTMLDivElement | null>;
  composerRef: React.MutableRefObject<HTMLDivElement | null>;
  firstPromptRef: React.MutableRefObject<HTMLButtonElement | null>;
  scrollDownRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const C = createContext<Ctx | null>(null);

export function useV2Autoplay() {
  const v = useContext(C);
  if (!v)
    throw new Error("useV2Autoplay must be used inside <V2AutoplayProvider>");
  return v;
}

export function V2AutoplayProvider({
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
  // When `disabled`, behave as if the user took over from frame 0 so the
  // timeline never advances past the initial idle state (home chat page).
  const userTakeoverRef = useRef<boolean>(disabled);

  const screenRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const firstPromptRef = useRef<HTMLButtonElement | null>(null);
  const scrollDownRef = useRef<HTMLButtonElement | null>(null);

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
        composerRef,
        firstPromptRef,
        scrollDownRef,
      }}
    >
      {children}
    </C.Provider>
  );
}
