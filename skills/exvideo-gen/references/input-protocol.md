# Exvideo Gen Input Protocol

Use this protocol to turn incomplete user input into a durable video project state. Do not force the user to complete every field at once.

## 1. Intake Modes

### Quick Mode

Ask for or infer these minimum fields:

```yaml
project:
  title:
  intended_use:
  current_goal:
  target_duration_or_shot_count:
  aspect_ratio:
  core_subject:
  visual_direction:
  current_deliverable:
```

### Production Mode

Use for complex work:

```yaml
project:
  id: PROJECT-01
  title:
  workflow_module:
  intended_use:
  audience:
  distribution_platform:
  target_duration:
  aspect_ratio:
  resolution:
  frame_rate:
  language:
  current_stage:
  current_deliverable:
  deadline_or_budget:

story:
  premise:
  communication_goal:
  script_mode:
  target_script_format:
  reference_works: []
  protagonist_obsession:
  protagonist_inner_flaw:
  midpoint_reversal:
  climax_conflict:
  core_theme:
  causal_chain:
  beginning_state:
  turning_point:
  ending_state:
  required_beats: []
  prohibited_content: []

visual_bible:
  world_and_era:
  medium_and_rendering:
  art_direction:
  palette:
  lighting:
  camera_language:
  motion_language:
  preferred_shot_sizes: []
  preferred_compositions: []
  preferred_camera_angles: []
  preferred_lenses: []
  depth_of_field:
  edit_rhythm:
  typography_or_ui:
  references: []
  avoid: []

production:
  characters: []
  assets: []
  locations: []
  scenes: []
  shots: []
  pages: []
  target_platform_or_model:
  output_package:
```

## 2. Entry Routes

Choose the route that matches what the user already has.

### Idea First

Use when the user has only a concept:

```text
I want to make:
The audience should feel:
Approximate duration:
Reference works or visual direction:
What I need help producing first:
```

Help turn this into a brief before requesting detailed shot data.
Then read `references/script-writing-stage.md` and build the story or script before storyboard production.

### Script First

Use when the user has narration, dialogue, lyrics, or a screenplay:

```text
Source script:
Must-keep lines or beats:
Target duration:
Desired pacing:
Existing characters or assets:
```

Extract beats and propose scenes before building shots.
If the source needs structural rewriting, use `references/script-writing-stage.md` to separate abstract dramatic functions from role-specific surface details.

### Character First

Use when the user supplies a character card or reference:

```text
Character reference:
Reference role: identity / style / both
What must stay unchanged:
What may be redesigned:
Video role for this character:
```

Create the canonical character card, then ask what story or demonstration it must support.

### Reference First

Use when the user supplies images, videos, or prompt screenshots:

```text
Reference files:
What to learn from each:
What must not be copied:
Target subject or project:
Desired deliverable:
```

Build the material manifest before extracting prompt frameworks.

## 3. Input Assistance Rules

Let the user write these shorthand values:
- `UNKNOWN`: keep open and ask only when blocking
- `INHERIT`: inherit from the parent project, character, scene, or shot
- `AUTO`: propose a default and label it as assumed
- `LOCK`: preserve across downstream work
- `FLEX`: allow bounded variation
- `REFERENCE_ONLY`: learn structure or style; do not copy identity

When helping the user fill a field:

1. Explain the decision in plain language.
2. Offer 2-3 concrete options when taste or strategy matters.
3. Recommend one option and state the tradeoff.
4. Record the selected value and lock state.
5. Do not ask the same question again unless upstream requirements changed.

## 4. Material Manifest

Label every supplied item before using it:

| ID | File or item | Role | What to preserve | What may change |
|---|---|---|---|---|
| REF-01 | character card | identity-reference | face, hair, silhouette | pose, environment |
| REF-02 | screenshot | prompt-framework | layout and shot logic | depicted character |

Allowed roles:
- `identity-reference`: who or what the subject is
- `style-reference`: visual treatment only
- `composition-reference`: framing and spatial arrangement
- `motion-reference`: action timing or movement
- `prompt-framework`: reusable instruction structure
- `edit-target`: image that should actually be modified
- `content-source`: script, lore, product facts, dialogue, or requirements

If one reference has multiple roles, list each role separately. Never silently promote a composition reference into an identity reference.

## 5. Progressive Intake

At each stage:

1. Summarize what is already known.
2. Identify missing fields as:
   - `must ask`
   - `can infer`
   - `can defer`
3. Ask at most three high-impact questions.
4. Offer defaults for inferable fields.
5. Return the updated project state.

Do not ask about page-level effects while the story structure is still undecided unless the current task is explicitly a standalone page.

## 6. Stage Gates

### Brief Gate

Pass when purpose, format, scale, subject, and current deliverable are known.

### Script Gate

Pass when the requested script artifact, causal chain, protagonist arc, midpoint reversal, climax choice, ending state, and originality boundaries are approved.

### Bible Gate

Pass when the visual language has enough constraints to distinguish the project from generic output, including camera, lens, lighting, movement, and focus tendencies where relevant.

### Character Gate

Pass when identity invariants and permitted variants are explicit.

### Storyboard Gate

Pass when each shot has a purpose, duration, start state, end state, continuity links, and a compatible shot-language block.

### Page Gate

Pass when the page has all inherited references, local overrides, composition, and output intent.

### Generation Gate

Pass when the user has confirmed the relevant creative specification and the platform adapter is ready.

## 7. Output Contract

For each completed intake stage, output:

```text
Confirmed:
Assumed:
Open:
Locked:
Affected downstream IDs:
Next production artifact:
```

This keeps the conversation usable even when the project continues across multiple turns.

## 8. Conflict Resolution

When inputs conflict:

1. Prefer explicit current user instructions.
2. Prefer identity references for identity.
3. Prefer canonical project state over example prompts.
4. Prefer a local shot override only inside its declared scope.
5. Surface unresolved conflicts instead of blending incompatible traits.
