# Kassandra’s Website Manager

## Sign in

Open `/admin`. Access is controlled by Payload email-and-password administrator authentication. The website does
not contain a hardcoded password. Only authorised CMS editors can open the dashboard or unpublished
draft previews.

## Everyday workflow

1. Choose a section from the dashboard.
2. Select an existing item or choose **Create New**.
3. Make the change. Editorial content autosaves as a draft.
4. Use **Preview** to view the saved draft in the public website design.
5. Choose **Publish** only when the change is ready.

Published films, awards, news, homepage content, biography, and contact settings are persistent
Payload records. Refreshing the browser or signing out does not remove them.

## Add a film

1. Choose **My Films**.
2. Choose **Create New**.
3. Add the title first, then any poster, description, year, trailer, stills, credits, and optional
   information.
4. Save a draft, preview it, and publish it.

The public film page and URL are created automatically.

## Add an award

1. Choose **Festivals & Awards**.
2. Add the festival or recognition name and any optional details.
3. Choose a related film only when the award belongs to that film.
4. Use **Show this on the related film page** to control whether it also appears there.
5. Preview and publish.

## Add news

1. Choose **News**.
2. Add a headline, optional image, introduction, main text, date, and optional related film.
3. Save a draft, preview it, and publish it.

The News list and public article URL are created automatically.

## Contact messages

The public form is off until **Contact Details → Allow visitors to send me a message** is published.
When enabled, submissions are validated, rate-limited, and saved privately under **Messages**. No
email delivery service is configured, so the site states only that a message was saved. Check the
Messages section regularly and delete personal information when it is no longer needed.

## Media

Use **Photos & Videos** to upload supported images and videos. Public portfolio media uses the
Railway volume-backed Payload storage configured by `UPLOADS_DIR`. Do not upload confidential files to the public media library.

Use **Private Films & Materials** for unpublished films, scripts, PDFs, and production files. That
separate library requires an administrator session and sends `private, no-store` file responses.
Existing files under **Photos & Videos** remain public so published posters, stills, and playback do
not break. Remote URL paste is disabled, and new public or private uploads are limited to supported
image, video, and PDF types as applicable and a maximum of 500 MB.

## Legal and rights pages

Privacy, cookies, terms, copyright, and accessibility pages have editable records under
**Legal & Rights Pages**. Five cautious drafts are provided, but they are intentionally unpublished
and marked **Professional legal review required**. Public pages use cautious fallback text until an
editor deliberately publishes a reviewed replacement. Publishing a legal page refreshes its public
route.

## Website translation

The public flag selector supports English, French, Russian, Spanish, German, Italian, Japanese,
Korean, and Simplified Chinese. English is the original and default language. Selecting another
language loads Google Website Translator and sends the visible page text to Google for automatic
translation; no translation API key or recurring translation subscription is required. The
visitor’s choice is remembered in local storage and a `googtrans` cookie.

Film titles, Kassandra’s name, credit names, photographs, videos, and artwork remain in their
original form. Newly published CMS descriptions, awards, news, and legal text are translated when
they appear on a page. Automatic output may be inaccurate and should not be treated as an
authoritative legal translation. Google controls service availability and processing terms.

## Backup and recovery

- Payload keeps version history for Films, Awards, News, Legal & Rights Pages, Home Page, About Me,
  Contact Details, and Website Settings.
- Restore a previous content version from its Versions view when needed.
- Code version history and Payload content history are separate. Restoring code does not restore
  content records or uploaded files.
- Before a major content migration or bulk deletion, publish current drafts and export or otherwise
  record the affected content through the platform’s available backup facilities.
- The website cannot verify a managed backup timestamp or a successful restore test. Confirm both
  with the hosting platform before relying on them.

## Security and privacy notes

- `/admin`, private previews, and administrative APIs are server-protected and marked no-index.
- The **Security & Recovery** dashboard reports only controls the application can verify. Figma
  account MFA/passkeys, account sign-in history, hosting logs, WAF/CDN controls, TLS, encryption at
  rest, and managed backups remain platform/account responsibilities.
- `robots.txt` asks named AI-training crawlers not to crawl the public site. This is a request, not a
  security boundary. `noai`, `noimageai`, and `TDM-Reservation` response headers are also preference
  signals, not technical prevention or guaranteed enforcement.
- Publicly accessible films, photographs, and text cannot be made impossible to copy.
- Optional analytics loads only after a visitor accepts it when an analytics ID is configured.
  Essential administrator authentication is not consent-gated.
- New messages receive a deletion-review date using **Contact Details → Message retention review
  period**. No scheduler deletes them automatically, so review and delete messages manually.
- Payload login attempt limits and application contact-form rate limits are local controls, not a
  hosting-level WAF or distributed bot/credential-stuffing defence.
- The legal notices describe the current technical setup but require qualified review before launch,
  including US state/federal, UK, EU, accessibility, copyright, children’s privacy, transfers,
  processor, retention, and legal-contact obligations that actually apply.
- Password recovery email is not configured. Payload currently reports that it would write email to
  the server console; do not treat this as a usable recovery channel.

No additional paid service was introduced by this implementation. Railway hosting, PostgreSQL, volumes, and network usage remain subject to the selected Railway plan and terms.
