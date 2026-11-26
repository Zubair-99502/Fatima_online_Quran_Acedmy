# Fatima Academy Admin Panel — Reference Implementation

Reference: user-provided Maxton dark eCommerce dashboard screenshot (visual style only).

## Implemented
- Charcoal sidebar and full-width dark topbar
- Responsive navigation with academy data tabs: Overview, Inquiries, Teachers, Students, Payments
- Search/filter controls and record management panels
- Overview welcome card and four database-driven metric cards
- Donut chart: existing inquiry status distribution (New / Contacted / Trial Scheduled / Enrolled / Closed)
- Monthly inquiry and enrollment bar chart (nine-month window)
- Verified payment count and inquiry conversion summary
- Existing real API calls and existing add/update/delete forms preserved

## Deliberate adjustments
- Screenshot's eCommerce products/orders/revenue demo numbers are **not** used. All numbers are derived from fetched academy records.
- Dashboard uses academy branding, not the Maxton logo.
- No fictitious notifications, sales records or student details.

## Run
1. `npm install`
2. Create `.env.local` using `.env.example` with newly generated admin secrets and MongoDB connection values.
3. `npm run dev`
4. Visit `http://localhost:3000/admin/login`

## Build and live integration
- Next.js syntax checked using TypeScript JSX parser/transpiler.
- Complete `next build` and browser rendering could not be verified in this environment because npm registry networking was unavailable.
- Stripe payment operation requires merchant credentials and webhook configuration. No live payment processing is guaranteed without those.
