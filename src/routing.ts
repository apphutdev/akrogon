import { z } from 'zod';
export const phaseSchema = z.enum([
  'plan.positions',
  'plan.rebuttal',
  'plan.synthesis',
  'implement',
  'check.review',
  'check.fix',
  'merge',
  'merged',
  'failed',
]);

export const slotSchema = z.enum(['A', 'B']);
export const verdictSchema = z.enum(['ready', 'nits', 'fix']);
export const prioritySchema = z.enum(['low', 'normal', 'high', 'critical']);
export const riskSchema = z.enum(['low', 'medium', 'high']);
export const taskKindSchema = z.enum(['frontend', 'backend', 'database', 'security', 'refactor', 'test', 'docs', 'general']);

export type Phase = z.infer<typeof phaseSchema>;
export type Slot = z.infer<typeof slotSchema>;
export type Verdict = z.infer<typeof verdictSchema>;
export type Priority = z.infer<typeof prioritySchema>;
export type Risk = z.infer<typeof riskSchema>;
export type TaskKind = z.infer<typeof taskKindSchema>;

type Route = { skill: string | null; slots: readonly Slot[]; next: readonly Phase[] };

export const routing: Record<Phase, Route> = {
  'plan.positions': { skill: 'plan-issue', slots: ['A', 'B'], next: ['plan.rebuttal', 'plan.synthesis', 'failed'] },
  'plan.rebuttal': { skill: 'plan-issue', slots: ['A', 'B'], next: ['plan.synthesis', 'failed'] },
  'plan.synthesis': { skill: 'plan-issue', slots: ['B'], next: ['implement', 'failed'] },
  implement: { skill: 'implement-issue', slots: ['B'], next: ['check.review', 'failed'] },
  'check.review': { skill: 'check-issue', slots: ['A', 'B'], next: ['merge', 'check.fix', 'failed'] },
  'check.fix': { skill: 'implement-issue', slots: ['B'], next: ['check.review', 'failed'] },
  merge: { skill: 'merge-issue', slots: ['A'], next: ['merged', 'check.fix', 'failed'] },
  merged: { skill: null, slots: [], next: [] },
  failed: {
    skill: null,
    slots: [],
    next: ['plan.positions', 'plan.rebuttal', 'plan.synthesis', 'implement', 'check.review', 'check.fix', 'merge'],
  },
};

export function requiredSlots(phase: Phase, rounds: number): readonly Slot[] {
  return phase === 'check.review' && rounds > 0 ? ['A'] : routing[phase].slots;
}
