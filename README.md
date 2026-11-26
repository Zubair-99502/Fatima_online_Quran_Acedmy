# Fatima Online Quran Academy

Modern, responsive Next.js 15 + React 19 academy website with a dark/gold Quraanic-inspired storefront and a separate Maxton-inspired charcoal admin dashboard. Includes course pages, teacher preference filters, free-trial inquiries, a WhatsApp contact button, optional Stripe Checkout and MongoDB-backed academy management.

## Run on Windows

1. Extract this ZIP. **The project root already contains `package.json`**; you do not need to `cd` into a second nested folder.
2. Install Node.js 22 or newer.
3. Double-click `RUN-WINDOWS.bat`, or open a terminal in this folder and run `npm install` followed by `npm run dev`.
4. Copy `.env.example` to `.env.local` and configure `MONGODB_URI`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` before testing login and inquiry functionality.
5. Open `http://localhost:3000` (admin login: `http://localhost:3000/admin/login`).

Do not paste private credentials into public chats or commit them to Git. Rotate previously shared passwords before launching. If npm install fails, check internet/npm registry availability. The first install needs internet.

## Public site

- Dark/gold UI with desktop and mobile menus, interactive currency preference dropdown, course carousel and lightweight animations.
- Pages: Home, Courses, Teachers, Testimonials, Pricing, About, Blog, Contact and Free Trial.
- Currency selection is a **quote preference only**: it is persisted in localStorage and saved with an inquiry. It does NOT perform real-time exchange conversion or charge a customer in that currency.
- Teacher cards currently use illustrative visual examples and are not verified staff profiles. No fake reviews or fabricated fees are provided.
- Forms are backed by MongoDB when configured. Without MongoDB, the static pages may render but inquiries/admin data will not work.

## Admin

- `/admin/login` and protected `/admin/dashboard`; footer has a direct Admin Login link.
- Manage students, teachers, inquiries and read verified payment records using the existing API routes.
- The Maxton-style admin is visually independent from the public site and depends on a working MongoDB connection.

## Payments

Stripe Checkout is optional and **disabled** until you configure a supported, verified Stripe merchant account. Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and at least one `STRIPE_PRICE_*` value to `.env.local` / Vercel environment variables. Configure the signed webhook endpoint `/api/payments/webhook`; test with Stripe test-mode events and checkout before live use. A return to the success page is not proof of payment.

## GitHub + Vercel

See `DEPLOY-GITHUB-VERCEL.md` for detailed setup, environment variables, secrets guidance and smoke-test checklist. An example GitHub Actions build workflow is included in `.github/workflows/build.yml`.

## QA and limitations

See `QA-REPORT.md`. Source parsing, CSS parsing, local image checks and static layout preview passed. A full Next.js build, database integration, actual browser application and live deployment **have not been verified** because npm registry installation timed out in the coding environment. Final verification requires a working `npm install`, production build, browser testing and actual configured services.


## Homepage trust bar and gold statistic circles
The Quraanic-inspired strip and five 104px circular highlights on `/` can be edited
in `lib/homeTrustStats.js`. The reference site's student, teacher, country,
years and rating figures are **not** included by default because those values
are not yet verified for Fatima Online Quran Academy. Please replace only with
confirmed academy figures and guarantees before public use.
