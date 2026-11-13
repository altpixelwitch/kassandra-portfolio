# Deploy Kassandra's portfolio and CMS to Railway

This archive contains the complete Next.js website, Payload Admin panel, collection/global schemas,
security rules, and local upload configuration. It is independent of `@payloadcms/figma` and uses
Railway PostgreSQL plus a Railway persistent volume.

## What is not inside the ZIP

Figma Cloud database rows, administrator accounts, and uploaded files are hosted data, not source
code. They cannot be embedded in this archive. A first Railway deployment therefore starts with an
empty CMS. Existing content and files must be exported from the source platform and imported into
Railway separately. Keep the source project available until every migrated record and upload has
been verified.

## Railway setup

1. Extract this ZIP and push the extracted folder to a private Git repository.
2. In Railway, create a project from that repository.
3. Add a **PostgreSQL** service to the project and link it to the web service. Add reference
   variables for both the private `DATABASE_URL` and PostgreSQL service's `DATABASE_PUBLIC_URL`
   to the web service. The public URL is used only by Railway's isolated build environment; the
   running app uses the private URL. Do not paste either value into source control.
4. In the web service variables, also add:
   - `PAYLOAD_SECRET`: a long random value, for example from `openssl rand -base64 48`.
   - `NEXT_PUBLIC_SITE_URL`: the exact public origin, such as
     `https://your-app.up.railway.app`, with no trailing slash.
   - `UPLOADS_DIR=/app/uploads`.
5. Add a Railway volume to the web service and mount it at `/app/uploads`. This preserves public
   media, private media, and writing PDFs across deploys.
6. Generate a Railway domain, then update `NEXT_PUBLIC_SITE_URL` to that exact HTTPS origin if it
   changed. Redeploy after changing it.
7. Open `/admin` on the deployed domain. Payload's first-user screen creates the initial CMS
   administrator. Use a unique strong password and store it in a password manager.

The included `railway.toml` applies the included idempotent Payload migrations and runs `pnpm build` through `DATABASE_PUBLIC_URL`, because Railway private networking is unavailable during image builds. At runtime, `pnpm start` reapplies migrations safely through the private `DATABASE_URL`, starts Next.js, and checks `/` for health.
Keep the generated public database credentials secret. The public TCP endpoint is needed for Railway image builds because the app pre-renders CMS-backed pages; normal runtime traffic uses private networking.

## Local development

Requirements: Node.js 24, pnpm 10, and PostgreSQL.

```bash
cp .env.example .env
# Edit DATABASE_URL, PAYLOAD_SECRET, and NEXT_PUBLIC_SITE_URL.
pnpm install
pnpm dev
```

Open `http://localhost:3000/admin` to create the first local administrator.

## Upload storage

Payload stores files in three directories under `UPLOADS_DIR`:

- `media/` for public images and video
- `private-media/` for administrator-only files
- `writing-files/` for PDFs whose access is controlled by their CMS record

A Railway volume is required because a deployment filesystem is otherwise ephemeral. One running
web replica is the safe default for volume-backed uploads. If the app later needs multiple replicas,
move these collections to S3-compatible object storage before scaling horizontally.

## Content migration checklist

Migrate relationships in dependency order so IDs can be remapped safely:

1. folders and tags
2. media files and media documents
3. films/works
4. writing files and writings
5. awards and news
6. legal pages
7. homepage, biography, contact settings, and website settings globals
8. private media and contact messages only when their privacy/retention requirements permit it

After migration, verify every relationship, draft/published state, slug, image URL, and protected
file response. Do not copy password hashes or Figma administrator sessions; create Railway
administrators directly in the new deployment.

## Backups and operations

- Enable Railway PostgreSQL backups before entering production.
- Back up the `/app/uploads` volume separately; database backups do not contain file bytes.
- Test restoring both PostgreSQL and uploads before relying on the backup plan.
- Configure a transactional email provider before relying on password-reset email. Without one,
  Payload's default email behavior is not a production recovery channel.
- Keep `/admin`, `/api`, and `/preview` behind HTTPS. The app already sends no-index headers for
  these routes.
