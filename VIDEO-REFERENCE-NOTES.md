# Fatima Online Quran Academy — Video-reference redesign

Reference provided: screen recording of Quraanic Academy, 2026-11-21, ~122 seconds.

## Matched layout direction

- Compact dark sticky navigation with gold accents and course/teacher dropdowns
- Dark violet/black centered hero, Arabic verse, serif headline, gold trial CTA and outlined course CTA
- Highlight / trust row, dark gold-bordered statistics chips without unverifiable student counts
- Dark dotted section backgrounds, premium learning cards, 3 course cards on homepage
- Three-step trial workflow and teacher matching section
- Testimonials destination, internal course page, teacher page, pricing and about pages
- Four-column footer, existing floating WhatsApp button
- Mobile responsive navigation / grids
- Existing dark-sidebar violet admin dashboard preserved separately

## Important data integrity choices

- Academy name and phone number retained from the user's project.
- No copied Quraanic Academy trademarks, reviews, student counts, institutional credentials or copyrighted photos.
- No invented verified teacher identities or student testimonials. Teacher photos are clearly labelled illustrative.
- Payments require actual Stripe merchant configuration before going live.

## Setup

1. Install Node.js 22.
2. In the extracted `fatima-online-quran-academy` project folder run `npm install` (internet required once).
3. Copy `.env.example` to `.env.local` and configure valid secrets / database credentials.
4. Run `npm run dev`.
5. Open http://localhost:3000.

## Validation performed

- Checked syntax of 53 JS/JSX files using the TypeScript parser.
- Checked local image asset paths and all custom images were found.
- Full Next.js compilation and browser testing could not run here because npm registry DNS failed (EAI_AGAIN).
