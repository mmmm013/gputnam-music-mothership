Goal: Initialize `lb` schema in Supabase project `lbzpfqarraegkghxwbah`.

Files created:
 - `supabase/init_lb.sql`  (run this SQL to create schema, tables, policies, functions)
 - `public/robots.txt`

Run options (pick one):

A) Supabase SQL Editor (web UI) - recommended
 1. Open https://app.supabase.com and select project `lbzpfqarraegkghxwbah`.
 2. Open "SQL Editor" → New query.
 3. Copy the contents of `supabase/init_lb.sql` and paste into the editor.
 4. Run the query. Confirm no errors.
 5. Verify: run `SELECT schema_name FROM information_schema.schemata WHERE schema_name='lb';`

B) Using psql (requires DB connection string)
 1. From Supabase Dashboard → Settings → Database, copy the "Connection string (URI)" (postgres://...)
 2. On your machine:

    psql "postgres://user:pass@host:port/dbname" -f supabase/init_lb.sql

C) Using Supabase CLI (if linked and working)
 1. Ensure `supabase link --project-ref lbzpfqarraegkghxwbah` succeeds.
 2. Run:

    supabase db remote set <name> "postgres://user:pass@host:port/dbname"
    psql "$(supabase db remote get <name>)" -f supabase/init_lb.sql

Security notes:
 - This SQL creates `lb` schema and RLS policies that rely on `request.jwt.claims` and `auth.uid()`; ensure your JWTs include `org_id` claim for org isolation.
 - Do NOT store audio binaries in `lb` schema; `file_path` is a reference only.

If you want me to run the SQL for you, paste either:
 - The Supabase Database connection string (postgres://...)
 - Or the SERVICE_ROLE_KEY + project ref and I will run using the CLI (I still need access to the DB URI or service role to execute SQL).

After running, paste the success output and I will verify the schema and follow up with tests (insert/select) and RLS checks.
