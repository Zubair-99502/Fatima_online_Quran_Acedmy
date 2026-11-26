# Fatima Online Quran Academy — GitHub + Vercel Deployment

## 1. Project folder

Unzip the archive. The ZIP is flat: open the extracted folder directly. It already contains `package.json` at its root. Open your terminal here. Do not `cd` into another nested project folder.

## 2. Local production check

Install Node.js 22, then run:

```bash
npm install
npm run build
npm run start
```

Run `npm run dev` instead for local development. The site should open at `http://localhost:3000`.

Build and browser tests must be completed on a machine with working npm internet access. Do not deploy until build errors are resolved.

## 3. GitHub repository

Create a new **private** repository in GitHub named `fatima-online-quran-academy`. Do not initialize with README or a license because this project already contains files.

From the folder with `package.json`:

```bash
git init
git add .
git commit -m "Initial Fatima Academy website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/fatima-online-quran-academy.git
git push -u origin main
```

Replace `YOUR-USERNAME`. Alternatively use GitHub Desktop and publish this project directory.

**NEVER commit `.env`, `.env.local`, `.env.production`, passwords, database URIs, payment keys, or `node_modules`.** The `.gitignore` in this repo excludes these files.

## 4. Vercel deployment

1. Sign in at `https://vercel.com/new`.
2. Choose **Import Git Repository**, connect GitHub and select the academy repository.
3. Framework should be detected as **Next.js**. Root Directory must point to the directory with `package.json` (normally `/` when you upload the extracted root directory).
4. Build Command: `npm run build`. No custom output directory is needed.
5. Add environment variables listed below, then click **Deploy**.

Vercel redeploys the production branch when you push changes to GitHub.

## 5. Required Vercel environment variables

Add these in Vercel Project → Settings → Environment Variables (**Production**). Use fresh secrets, not credentials ever pasted in chats.

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string for a dedicated database user; use a database name in the URI |
| `AUTH_SECRET` | New cryptographically random secret, at least 32 characters |
| `ADMIN_EMAIL` | Academy admin email |
| `ADMIN_PASSWORD` | New unique strong admin password; a bcrypt hash also works |
| `NEXT_PUBLIC_SITE_URL` | Your exact deployed site URL, such as `https://your-project.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP` | `923030535615` |

Set the public URL once Vercel gives you your deployment domain, then redeploy. Never set `NEXT_PUBLIC_SITE_URL` to localhost for production.

### Optional Stripe payments

Only configure these after opening a **supported and verified** merchant account:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- One or more of `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_STANDARD`, `STRIPE_PRICE_PREMIUM`

Webhook URL: `https://YOUR-DOMAIN/api/payments/webhook`.
Use the events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`.
Test in Stripe test mode before live payments. Stripe availability depends on your business eligibility/location.

## 6. MongoDB Atlas

Ensure Atlas network rules allow your hosted Vercel functions to connect. Use a dedicated database user with only needed privileges, and rotate the previously shared credentials. MongoDB-backed forms and admin tables will not work until Vercel can access Atlas.

## 7. Deployment smoke-test checklist

- Homepage renders on desktop and phone
- Main menu and dropdown links work
- `/courses`, `/teachers`, `/about`, `/pricing`, `/contact`, `/free-trial` open
- Inquiry submission writes to MongoDB (test with dummy data)
- Footer Admin Login links to `/admin/login`
- Admin sign-in and sign-out work with the new credentials
- Dashboard shows actual student/teacher/inquiry data
- WhatsApp button opens the correct number
- No Next.js errors in Vercel deployment logs
- Stripe payments and signed webhooks work in test mode (only if configured)

**Security:** The previous database/admin passwords appeared in a chat; rotate them before deploying. Do not send secret values in chat messages. Use Vercel's private environment variable controls.
