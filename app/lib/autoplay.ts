export type NeedStep =
  | "idle"
  | "userQuestion"
  | "aiResponse"
  | "illustration"
  | "chipIn"
  | "cursorIn"
  | "tapChip"
  | "dwell"
  | "reset";

export interface StepDef {
  step: NeedStep;
  duration: number;
}

export const TIMELINE: StepDef[] = [
  { step: "idle", duration: 1000 },
  { step: "userQuestion", duration: 700 },
  { step: "aiResponse", duration: 1600 },
  { step: "illustration", duration: 1800 },
  { step: "chipIn", duration: 700 },
  { step: "cursorIn", duration: 1000 },
  { step: "tapChip", duration: 380 },
  { step: "dwell", duration: 2400 },
  { step: "reset", duration: 700 },
];

export const TOTAL_DURATION = TIMELINE.reduce((s, t) => s + t.duration, 0);

export function getStepAt(elapsedMs: number): {
  step: NeedStep;
  stepIndex: number;
  t: number;
} {
  let acc = 0;
  for (let i = 0; i < TIMELINE.length; i++) {
    const d = TIMELINE[i].duration;
    if (elapsedMs < acc + d) {
      return {
        step: TIMELINE[i].step,
        stepIndex: i,
        t: (elapsedMs - acc) / d,
      };
    }
    acc += d;
  }
  return { step: "reset", stepIndex: TIMELINE.length - 1, t: 1 };
}
