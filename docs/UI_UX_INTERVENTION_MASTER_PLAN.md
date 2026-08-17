# Nova X AI — UI/UX Intervention Master Plan

Status: ACTIVE / UI-AUDIT BASELINE
Branch: `ui-audit`

## Purpose

This document is the working UI/UX intervention plan for Nova X AI. It complements the project SDS/Blueprint and must not replace or contradict the core architecture.

The goal is to evolve the current UI prototype into a polished, production-grade AI companion experience while preserving Nova Core, the existing engines, SDK/contracts, and domain boundaries.

## Non-Negotiable Rules

- UI changes must respect the existing SDS/Blueprint and architecture.
- UI must consume existing engine/client contracts; no business-logic bypasses.
- Do not rewrite engines to solve presentation problems.
- Every sprint must be small, focused, and independently validated.
- After each sprint: typecheck → build → preview → visual review.
- Do not start the next sprint until the current sprint is visually verified.
- Prefer minimal file changes over broad rewrites.
- Do not add dependencies unless genuinely required.
- Character identity/data consistency is P0 and must be resolved before large UI polish.

## Target Product Structure

```text
Home
Discover
Chats
Characters

Create
 ├ Character
 ├ Image
 ├ Story
 └ World

My Creations
 ├ Characters
 ├ Images
 ├ Stories
 └ Worlds

Favorites
Gallery
Settings
```

## Core UX Principle

Nova X AI should be character-centered, visual-first, and conversation-first.

The product should feel like a premium AI companion platform, not an administration form or a collection of disconnected demo pages.

## Execution Sequence

### Sprint A — Character Data Truth & Stability (P0)

Goal: one consistent source of character identity/data across Home, Profile, Chat, Gallery, favorites, recents, and counts.

Interventions:
- Reconcile Character Engine IDs with presentation/store IDs.
- Prevent duplicate characters during hydration/merge.
- Ensure Create Character uses the real engine-created character ID.
- Make character counts derive from one consistent data path.
- Verify create 3 → display 3 → reload → still 3.
- Verify character A opens A profile and A chat.

Do not touch:
- visual redesign
- Chat styling
- Gallery styling
- Story/World UI

Acceptance:
- Character count is consistent everywhere.
- No duplicate character identity after create/reload.
- Avatar/profile/chat refer to the same character ID.

### Sprint B — App Shell 2.0

Goal: establish a complete product navigation structure.

Interventions:
- Expand desktop navigation.
- Add mobile drawer/bottom navigation.
- Add first-class routes/surfaces for Chats, Characters, Settings and creation entry points.
- Keep navigation responsive and direction-aware.

### Sprint C — Discover/Home 2.0

Goal: make Home a companion dashboard and Discover a visual discovery marketplace.

Home priority:
- Continue Conversation
- Your Characters
- Discover
- Trending
- Stories/Worlds
- Recent Images

Discover priority:
- Search
- Filters
- Categories
- Language/tags where supported
- Sorting
- Image-first character grid

### Sprint D — Character Card + Profile

Character Card:
- Image-first
- Name + short title/tagline
- 2–3 personality signals
- Favorite
- Start Chat
- No raw internal trait scores
- Minimal metadata

Character Profile:
- Large hero image
- Identity
- Start Chat
- Voice
- Gallery
- Personality
- Mood
- Relationship
- Memories
- Story

Relationship and memory are presented as user-facing signals, not engine internals.

### Sprint E — Character Creator 3.0

Flow:

```text
Identity
  ↓
Appearance
  ↓
Personality
  ↓
Final Visual Description / Prompt
  ↓
Generate
  ↓
Candidates
  ↓
Choose
  ↓
Primary Avatar
  ↓
Save
```

Principles:
- User constructs the character first.
- Image generation happens after the final configuration/prompt is ready.
- Keep the form compact.
- Use visual selectors wherever practical: hair, eyes, outfit, body, style, etc.
- Advanced fields should use progressive disclosure.
- Show the final generated prompt/visual summary before generation.

### Sprint F — Image Experience

Goal: make images a platform-level capability.

Pipeline:

```text
Character
 ↓
Avatar
 ↓
Character Gallery
 ↓
Chat Image
 ↓
Story Scene
 ↓
World Scene
 ↓
Gallery
```

Candidate UI must support variable candidate counts and future 8–16 candidate targets subject to provider/cost constraints.

### Sprint G — Chat 3.0

Goal: make Chat the core repeat-use experience.

- Character-aware header
- Status/mood/relationship signal
- Clean message hierarchy
- Streaming as a real message bubble
- Composer with text/voice/image actions
- Contextual message actions
- Generated images integrated naturally into conversation

### Sprint H — Gallery + Voice

Gallery:
- All
- Characters
- Chat
- Stories
- Worlds
- Favorites
- Search/filter/fullscreen viewer
- Set avatar / regenerate / favorite / delete

Voice:
- Recording
- Processing
- Playback
- Live voice surface where supported
- Voice settings

### Sprint I — Story + World

Story:
- Chapter
- Scene
- Objective
- Progress
- Choices

World:
- Location
- Time
- Environment
- Present characters

Both integrate into Chat as contextual state rather than hidden icons only.

### Sprint J — Settings + Accessibility + Responsive

Settings sections:
- Account
- Appearance
- Language
- Chat
- Voice
- Images
- Memory
- Privacy
- AI Providers
- Advanced

Accessibility:
- Keyboard navigation
- Focus management
- Semantic controls
- Dialog semantics
- RTL/LTR
- Reduced motion
- Touch target sizing
- Meaningful image alt text

Responsive:
- Desktop
- Tablet
- Mobile

### Sprint K — Integration Checkpoint

Do not wait for every feature to finish before validating the core happy path.

```text
Welcome
 ↓
App Shell
 ↓
Create Character
 ↓
Generate Candidates
 ↓
Choose Avatar
 ↓
Save Character
 ↓
Character Profile
 ↓
Start Chat
 ↓
AI Response
 ↓
Voice
 ↓
Generate Image
 ↓
Gallery
```

### Sprint L — Final UI Audit

Validate:
- Visual hierarchy
- Navigation
- Responsive behavior
- Accessibility
- Functional interactions
- Loading/empty/error states
- Data consistency
- Architecture boundaries
- No UI bypasses

## Current Priority

**Sprint A — Character Data Truth & Stability** is the next implementation task.

Reason: the current UI can show inconsistent character counts/identity when engine state and presentation store state diverge. Fixing this first prevents rework across Home, Profile, Chat, Gallery, favorites, and creation.

## Required Agent Working Style

For each sprint, the implementation agent must:

1. Inspect only the relevant files first.
2. Make the smallest correct change set.
3. Do not explain at length before working.
4. Do not broaden scope.
5. Run typecheck and build.
6. Return only:

```text
DONE
Typecheck: PASS/FAIL
Build: PASS/FAIL
Files changed: ...
Blockers: ...
```

## Definition of Done

A sprint is done only when:
- Scope is complete.
- Typecheck passes.
- Build passes.
- No unrelated behavior regressed.
- Preview is visually checked.
- The next sprint can start without reopening the completed sprint.
