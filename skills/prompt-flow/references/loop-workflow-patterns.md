# Loop Workflow Patterns

Use this reference when `prompt-flow` needs to decide whether a task should stay as a single prompt / direct execution, or upgrade into a loop-aware workflow with verification and stop conditions.

This is a lightweight orchestration layer. It is not a separate skill and should not make simple tasks heavy.

## Core Judgment

The key question is:

> Does this task need iteration, parallel work, independent verification, or a clear stop condition to be reliable?

If not, do not use a loop. Continue with the normal `prompt-flow` path.

## Loop Necessity Check

Use a loop when one or more of these are true:

- P0 cannot be completed reliably in one pass.
- The task needs multiple sources, files, candidates, or perspectives.
- The task needs generation followed by selection or ranking.
- The task needs code execution, tests, linting, screenshots, or other verification.
- The task has high factual, safety, legal, financial, technical, or reputational risk.
- The task is likely to suffer from self-preferential bias if the same pass both creates and judges the output.
- The task can drift over many turns or many files.
- The task is a repeated workflow that may later become a skill, script, automation, or wiki process.

Skip a loop when:

- The user needs a quick direct answer.
- The task is mechanical and low-risk.
- The task is already fully specified and has a clear one-pass output.
- A loop would add more overhead than reliability.

## Minimal Loop Decision Output

```text
Loop needed: yes/no
Reason:
Pattern:
Verification:
Stop condition:
Budget:
Persistence:
```

- `Pattern`: Choose one primary pattern below. Combine at most 2-3 patterns.
- `Verification`: How the output will be checked.
- `Stop condition`: When the loop must stop.
- `Budget`: Time, token, file, source, or iteration limit.
- `Persistence`: Whether to save the working workflow to outputs, wiki, skill, script, automation, or nowhere.

## Pattern Router

| Pattern | Use When | Avoid When |
|---|---|---|
| classify-and-act | First classify inputs, then route to different skills, tools, or templates | The input type is already obvious |
| fan-out-and-synthesize | Many independent files, articles, claims, competitors, code areas, or ideas can be processed in parallel | The subtasks depend heavily on each other |
| adversarial verification | High-risk or self-judging tasks need a separate review pass | The task is low-risk and already verifiable |
| generate-and-filter | Need many candidate titles, ideas, product concepts, prompts, or structures before choosing | The user already provided a final direction |
| tournament | Need comparative ranking where absolute scores are unreliable, especially taste/name/title decisions | There are only 2-3 obvious options |
| loop-until-done | The number of iterations is unknown and progress depends on test/fix/retest, source gathering, or repeated checks | There is no clear stop condition |

## Pattern Details

### classify-and-act

Use this when the first step is deciding the route.

Typical SPLLM uses:

- Decide which skill should own a request.
- Classify wiki material as source, concept, entity, product, or no promotion.
- Classify user text as writing, evaluation, research, code, or multimodal generation.

Minimum loop:

```text
classify -> route -> execute -> verify route was correct
```

### fan-out-and-synthesize

Use this when independent parts can be processed separately, then merged.

Typical SPLLM uses:

- Read 5 articles separately, then synthesize stable insights.
- Audit multiple wiki pages for the same schema issue.
- Compare multiple products or competitors.

Minimum loop:

```text
split -> process independently -> synthesize -> check coverage
```

### adversarial verification

Use this when the creator should not be the only judge.

Typical SPLLM uses:

- Claim checking.
- Code review after implementation.
- Checking whether a generated article matches the brief.
- Verifying a skill update did not break an existing rule.

Minimum loop:

```text
create -> independent review -> revise -> final check
```

### generate-and-filter

Use this when early commitment is risky.

Typical SPLLM uses:

- Article titles, hooks, product names, positioning lines.
- Multiple product concepts.
- Multiple prompt structures.

Minimum loop:

```text
generate many -> filter with rubric -> refine top candidates
```

### tournament

Use this when pairwise comparison is more reliable than absolute scoring.

Typical SPLLM uses:

- Select the best title from many options.
- Compare article openings by taste.
- Rank names, taglines, or visual concepts.

Minimum loop:

```text
pair -> compare -> advance winners -> final rationale
```

### loop-until-done

Use this when the number of iterations is unknown.

Typical SPLLM uses:

- Code fix until tests pass.
- Wiki health check until no P0 issues remain.
- Skill update until required checks pass.
- Research until source coverage is sufficient.

Minimum loop:

```text
attempt -> verify -> diagnose -> revise -> repeat until stop condition
```

## Verification Layer

Choose the cheapest layer that makes the task reliable:

| Level | Verification | Examples |
|---|---|---|
| L0 | User confirmation | Direction, taste, strategic choice |
| L1 | Format/schema check | Markdown structure, frontmatter, JSON, table fields |
| L2 | Source/evidence check | Web citations, wiki links, source coverage |
| L3 | Execution check | Tests, scripts, lint, screenshots, file existence |
| L4 | Independent review pass | Review generated writing, code, claim analysis, skill diff |
| L5 | Adversarial review pass | Try to disprove claims, attack assumptions, find hidden failures |

## Stop Conditions

Every loop needs a stop condition before it starts.

Use this template:

```text
Stop when:
- P0 is complete.
- Required verification passes.
- No unresolved P0 risk remains.
- Budget limit is reached.
- User confirmation is required.
```

Good stop conditions are observable:

- "All tests pass."
- "Each article has a summary and source URL."
- "No missing frontmatter remains in touched pages."
- "At least 3 independent sources support the claim."
- "The user has chosen one direction."

Bad stop conditions are vague:

- "When it feels good."
- "When the result is perfect."
- "When the agent thinks it is enough."

## Budget Rules

Before using a loop, set at least one budget:

- `iterations`: maximum number of cycles
- `sources`: maximum number of sources or pages
- `time`: rough time boundary
- `tokens`: rough token boundary
- `files`: maximum number of files touched
- `candidates`: maximum number of variants generated

If a loop hits budget before P0 is complete, stop and report the remaining blocker.

## Safety Rules

- Do not use the same pass as both creator and final verifier on high-risk work.
- Do not let untrusted content directly control an action-taking agent.
- Do not use loop-until-done without a stop condition.
- Do not run workflows for simple tasks just because the capability exists.
- If a workflow becomes repeatable, consider whether it should become a skill, script, or automation, but ask before changing durable rules.

## SPLLM Promotion Rule

After a loop runs successfully:

- Once: keep it as task-local process.
- Twice: consider documenting it in a reference or wiki concept.
- Repeated and stable: consider turning it into a skill or script.
- Periodic: consider automation, only after confirming schedule and stop conditions.

