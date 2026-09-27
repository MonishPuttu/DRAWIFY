# /brag plan — DRAWIFY

**What it is:** An open-source, hand-drawn style whiteboard where people create or join a room and draw together in real time.
**Who it's for:** Teams, classmates and friends who want to sketch ideas together without installing anything.
**What sets it apart:** Live multi-user canvas — every stroke syncs to everyone in the room over WebSockets (`apps/ws-backend`).
**Most impressive claim:** Two browsers, one canvas, strokes appearing on both at once.
**Visual hook:** Alice and Bob's cursors drawing on the same canvas at the same time.
**Tone:** default — playful, clean, hand-drawn.
**Share caption:** "Draw together. Live."

## Visual identity (from the code)
- Fonts: Geist + Caveat handwritten (`apps/frontend/app/layout.tsx`)
- Accent `#6965db`, Bob's cursor `#e88e3c`, canvas `#F8F9FA` with the dotted `.canvas-grid` (`app/page.tsx`, `app/globals.css`, `draw/Game.ts`)
- Toolbar rebuilt from `components/Canvas.tsx` (Pencil, Rectangle, Circle, Eraser, theme, Share)
- Create-room flow from `app/create-room/page.tsx` (purple-50 page, "Create a New Room" modal)
- Share dialog copy from `components/ShareDialog.tsx`
- Hero copy "An open source virtual hand-drawn style whiteboard." from the landing page

## Storyboard (21s, 1920×1080 @ 30fps)
| # | Time | Scene | On screen |
|---|------|-------|-----------|
| 1 | 0.0–3.5 | **Hook** | Alice draws a rectangle + arrow while Bob draws a circle — "Draw together. Live." |
| 2 | 3.5–6.8 | **Reveal** | Drawify logo + "An open source virtual hand-drawn style whiteboard." |
| 3 | 6.8–10.4 | **Highlight: rooms** | Welcome to Drawify → Create a New Room → types "team-brainstorm" / "Alice" |
| 4 | 10.4–15.8 | **Highlight: sync** | Alice's and Bob's browsers side by side on the same room; each stroke appears in both. "Every stroke syncs instantly — over WebSockets." |
| 5 | 15.8–18.4 | **Highlight: share** | Share Drawing dialog → Copy → Copied! "Share a link. They're in." |
| 6 | 18.4–21.0 | **Outro** | "Sketch it together." + github.com/MonishPuttu/DRAWIFY |

## Sound
C major, 112 bpm, bright plucky arp; pen scratches under each stroke, pops for cards, click + chime on Copy, closing chime.

## Voice-over version (39s)
The final `brag.mp4` is the extended cut with narration. Voice: Kokoro TTS (`af_heart`), generated locally. Each scene's timeline was stretched to fit its line (entrances and transitions keep their original speed; only the hold in the middle of each scene slows down), the soundtrack was re-timed to match, and the music ducks under the voice. Some spellings below are written for the voice, e.g. "Ani-Talk", "R-x Check".

| # | Time | Narration |
|---|------|-----------|
| 1 | 0.0–4.0s | Two people. One whiteboard. Drawing at the same time. |
| 2 | 4.0–11.2s | Meet Drawify: an open source, hand-drawn style whiteboard, built for real-time collaboration. |
| 3 | 11.2–17.2s | Create a room, give it a name, and you're in. Or join an existing room with just its name. |
| 4 | 17.2–25.9s | Every rectangle, circle and pencil stroke is sent over WebSockets, so everyone in the room sees it instantly, on their own screen. |
| 5 | 25.9–32.8s | When you're ready, copy the room link and share it. Anyone who opens it joins the same canvas, live. |
| 6 | 32.8–39.0s | Drawify. Sketch it together. It's free and open source on GitHub. |
