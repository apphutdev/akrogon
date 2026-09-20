# Autonomy hardening

This fork adds an evidence-first workflow design for autonomous coding. The goal is to reduce correlated agent error: two agents can agree while both are faithfully implementing the wrong contract.

## Target lifecycle

```text
intent -> chart -> contract -> spec critic -> plan -> implement
                                      |          |
                                      |          +-> implementation tests
                                      +------------> independent acceptance tests
                                                       |
                                                       v
                                               adversarial review
                                                       |
                                              fix <----+----> merge gate
                                               |
                                      retry budget exhausted
                                               |
                                             re-plan

merge -> CI/staging -> runtime evidence -> new seeds
```

## Design rules

1. **Spec critic before implementation.** A fresh critic checks the leaf contract against original intent, sources, assumptions, omitted edge cases, acceptance criteria, and architecture constraints. A rejection returns to contract/charting rather than being patched during implementation.
2. **Independent acceptance evidence.** Acceptance tests are authored from the contract and intent, not from implementation reasoning. Implementation tests and acceptance tests are separate evidence streams.
3. **Adversarial review.** Reviewers receive the contract, diff, acceptance evidence and deterministic checks. They should not rely on the implementer's chain of reasoning.
4. **Bounded repair.** Repair loops are finite. Exhaustion escalates to re-planning/root-cause analysis rather than terminally repeating patches.
5. **Risk-aware scheduling.** Leaves carry priority, risk and task-kind metadata. These are orchestration inputs, not correctness claims.
6. **Capability routing.** Task kind and risk can select deeper review or specialised execution profiles. The default two-seat topology remains supported.
7. **Architecture governance.** High-risk work and periodic batches should be reviewed for cross-leaf drift, duplicated abstractions, API inconsistency and dependency growth.
8. **Production feedback.** Deployment stays outside the merge authority boundary, but CI/staging/runtime evidence may create new seeds. Production evidence never silently rewrites an existing contract.

## Proposed state extensions

These are intentionally additive so existing leaves remain readable:

```yaml
priority: normal       # low | normal | high | critical
risk: medium           # low | medium | high
task_kind: backend     # frontend | backend | database | security | refactor | test | docs | general
spec_critic: required  # required | optional | off
acceptance: independent # independent | implementation | off
architecture_review: auto # auto | required | off
replan_rounds: 0
```

A follow-up implementation should introduce explicit phases such as `spec.review`, `check.acceptance`, and `replan` rather than overloading `check.review`.

## Merge invariant

A leaf is merge-eligible only when all evidence required by its policy exists and passes:

- approved specification/contract critique;
- implementation complete;
- deterministic repository checks pass;
- independent acceptance evidence passes when enabled;
- adversarial review passes;
- architecture review passes when required;
- repair/re-plan budgets are not exhausted.

No single agent's declaration of success is sufficient.

## Compatibility

Existing projects should retain today's behaviour unless the new gates are enabled in repository policy. This permits incremental adoption and makes it possible to compare hardened and baseline workflows on the same codebase.
