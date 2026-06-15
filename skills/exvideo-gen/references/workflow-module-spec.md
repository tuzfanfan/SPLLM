# Workflow Module Specification

Use modules to extend `exvideo-gen` without changing its stable production stages.

## Module Contract

Each new module must define:

```yaml
module:
  id:
  name:
  use_cases:
  trigger_phrases:
  required_intake_fields: []
  optional_intake_fields: []
  default_visual_rules:
  shot_grammar: []
  page_types: []
  asset_types: []
  continuity_checks: []
  platform_adapters: []
  example_projects: []
```

## What Belongs in Core

Keep these in `SKILL.md` and shared references:
- project intake
- reference-role labeling
- stable IDs
- inheritance
- change locks
- story/script, character, storyboard, page, prompt, and review stages

## What Belongs in a Module

Put these in a module:
- genre-specific shot patterns
- specialized UI or product-page layouts
- domain-specific continuity rules
- platform-specific generation syntax
- reusable prompt examples
- specialized deliverables

Examples:
- game demo: loadout screens, HUD, boss battle
- product ad: packshot, benefit demonstration, end card
- narrative short: dialogue coverage, reaction shots, emotional continuity
- music video: performance coverage, rhythm mapping, visual motifs
- explainer: information hierarchy, diagrams, voiceover sync
- social short: hook, retention beats, caption-safe framing

## Module File Pattern

Use one reference file per module:

```text
references/module-game-demo.md
references/module-product-ad.md
references/module-narrative-short.md
```

Existing Chinese example filenames may remain for readability, but every module should expose a unique `module.id`.

## Extension Rules

1. Do not duplicate shared templates inside a module.
2. Declare only additional or overridden fields.
3. State which core stages the module modifies.
4. Provide at least one compact example.
5. Define validation checks and stop conditions.
6. Avoid coupling the module to one generation provider unless it is explicitly a provider module.

## Module Evaluation

Before accepting a new module, verify:
- it covers a distinct video workflow
- its fields are not already core fields
- it can coexist with other modules
- its example does not silently become a universal default
- removing the module leaves the core workflow intact
