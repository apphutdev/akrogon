# Independent acceptance protocol

Acceptance evidence must be derived from the approved contract and original intent, independently from implementation reasoning.

The acceptance agent receives:
- approved contract/spec-critic evidence;
- public interfaces and repository test conventions;
- the candidate diff only after the acceptance oracle/criteria have been defined.

It should:
1. define observable acceptance assertions before adapting to implementation details;
2. add or run tests at the highest useful boundary;
3. include negative/error-path cases;
4. run deterministic repository checks;
5. record commands and results.

A passing implementation-authored unit suite is supporting evidence, not a substitute for independent acceptance evidence.
