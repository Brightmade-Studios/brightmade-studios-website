# Contact form

`/contact` is the "Start your custom app" form. `public/assets/contact.js` posts it to the mail Worker (`POST /contact`, defined in the brightmade-portal repo, see its `docs/email-worker.md`). The Worker emails contact@brightmadestudios.com through Resend, with Reply going to the visitor. No secrets live in this repo.

If the Worker's address ever changes, update `WORKER` in `public/assets/contact.js`. Spam: a hidden `company` field (people never fill it) and one message per email address per minute.
