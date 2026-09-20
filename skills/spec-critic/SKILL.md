# Spec critic protocol

Purpose: challenge the contract before implementation. The critic is independent of the authoring/planning agent.

Inputs:
- original intake/seed and linked sources;
- chart/contract for the leaf;
- repository architecture and standing design constraints;
- dependency contracts.

The critic must produce a short evidence file containing:
- intent coverage: what user objective each acceptance criterion proves;
- missing or ambiguous requirements;
- assumptions that need evidence;
- edge cases and failure modes;
- security/data-migration/compatibility concerns where applicable;
- testable acceptance criteria;
- verdict: `approve` or `revise`.

Rules:
- Do not edit implementation code.
- Do not approve merely because the contract is internally consistent.
- Compare the contract to original intent and sources.
- Prefer deterministic acceptance criteria.
- A `revise` verdict returns work to chart/contract refinement.
