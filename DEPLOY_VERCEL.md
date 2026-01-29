# Deploying to Vercel (BIC - Best In Class for Next.js)

This project is Next.js and is best deployed to Vercel for minimal friction. Follow the steps below.

1) Prepare environment variables
- On your local machine, copy `.env.local.example` to `.env.local` and fill the values (do NOT commit `.env.local`).
  - `NEXT_PUBLIC_SUPABASE_URL` (e.g. https://<project>.supabase.co)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public anon key)
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only; set in Vercel only)
  - `STRIPE_SECRET_KEY` (server-only; set in Vercel only)
  - `STRIPE_WEBHOOK_SECRET` (server-only; set in Vercel only)

2) Quick local verification
```bash
npm install
npm run build
# optional: npm run start (runs a production server)
```
If `npm run build` succeeds, the app is ready for deployment.

3) Create or connect a Vercel project
- Sign in at https://vercel.com and import the repository (GitHub/GitLab/Bitbucket).
- During import, Vercel will detect `next` and use `npm run build` by default.

4) Add environment variables in Vercel
- Go to Project → Settings → Environment Variables and add the following (Preview + Production as appropriate):
  - `NEXT_PUBLIC_SUPABASE_URL` — public Supabase URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key
  - `SUPABASE_SERVICE_ROLE_KEY` — Supabase service-role key (server-only)
  - `STRIPE_SECRET_KEY` — Stripe secret (server-only)
  - `STRIPE_WEBHOOK_SECRET` — Stripe webhook secret (server-only)

5) Deploy
- Trigger a Deploy from Vercel UI (Import repo will create deployments automatically on pushes).

6) Add custom domain `gputnammusic.com`
- In Vercel Project → Domains add `gputnammusic.com`.
- Vercel will give DNS instructions. For the apex domain they recommend A records or using Vercel nameservers. For `www` use a CNAME to `cname.vercel-dns.com`.
- Example (if using your registrar DNS):
  - A records: add the A records Vercel shows for the apex
  - CNAME: `www` -> `cname.vercel-dns.com`

7) Verify TLS and site health
- Vercel will automatically provision TLS. Visit `https://gputnammusic.com` after DNS propagates.

Notes & security


Never commit .env.local or server-only keys (SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET) to the repo.


NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are publishable and will be exposed in the browser, but you should still keep them in env vars rather than hard-coding. Use `.env.local` locally and Vercel env vars in production.
- `NEXT_PUBLIC_*` keys are safe to be public (client-side), but `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` are server-only and must be set only in Vercel.
- If you prefer another host (Render/Fly/Cloudflare Pages), I can provide an alternative deployment guide.
