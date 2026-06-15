# Character Card Stage

Use this stage to design a character, extract a character from references, or prepare a stable identity for multi-shot generation.

## Input Template

### P0 Identity

```yaml
character:
  id: CHAR-01
  name:
  narrative_role:
  age_read:
  body_type_and_height:
  face_shape:
  hair:
  eyes:
  defining_marks:
  base_silhouette:
  primary_outfit:
  primary_palette:
  signature_prop_or_weapon:
  identity_references: []
```

### P1 Performance

```yaml
performance:
  core_personality:
  default_posture:
  movement_quality:
  expression_range:
  combat_or_task_style:
  voice_or_dialogue_style:
  relationship_to_camera:
```

### P1 Construction

```yaml
construction:
  clothing_layers:
  materials:
  accessories:
  footwear:
  equipment_mounting:
  front_side_back_differences:
  emblem_or_markings:
```

### Variants

```yaml
variants:
  - id: CHAR-01-V01
    name:
    purpose:
    inherited_from: CHAR-01
    changes:
    unchanged_identity_traits:
    scope: FLEXIBLE
```

## Reference Extraction

When a character card is supplied:

1. Record visible facts separately from inferred lore.
2. Extract front, side, back, expressions, equipment, palette, and material cues.
3. Mark uncertain details as `OPEN`.
4. Write a short identity lock of 5-10 traits for repeated prompts.
5. Do not infer personality solely from clothing unless the user accepts the inference.

## Character Card Deliverables

Choose only those needed:
- canonical text specification
- three-view turnaround
- expression sheet
- outfit and equipment breakdown
- palette and material guide
- pose and movement sheet
- variant sheet
- generation identity lock
- identity board or artbook-style board page

## Character Gate Checklist

- Face and hair are distinguishable in close-up and rear view.
- Silhouette remains recognizable without color.
- Outfit layers and attachments have clear placement.
- Signature prop has stable shape and mounting logic.
- Base identity is separated from temporary costume variants.
- Locked traits are concise enough to repeat in every relevant prompt.

## Prompt Input Block

```text
Character ID:
Identity reference:
Locked identity traits:
Allowed variants:
Current shot costume:
Current emotion:
Current action:
Must remain unchanged:
```
