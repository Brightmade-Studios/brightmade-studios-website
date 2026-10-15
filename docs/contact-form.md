# Contact form

`/contact` is the "Start your custom app" form. `public/assets/contact.js` posts it to the mail Worker (`POST /contact`, defined in the brightmade-portal repo, see its `docs/email-worker.md`). The Worker emails contact@brightmadestudios.com through Resend, with Reply going to the visitor. No secrets live in this repo.

If the Worker's address ever changes, update `WORKER` in `public/assets/contact.js`. Spam: a hidden `company` field (people never fill it) and one message per email address per minute.

## Get Questly and referral form

`/questly#get` is the Get Questly form. `public/assets/questly-get.js` posts it to the same Worker `POST /contact`, with no Worker change: the Worker only takes `name`, `email` and `message`, so the phone number, the referral and any note are written into the message. The email therefore arrives with the Worker's usual subject, "New project inquiry from NAME", and its first line says "Questly order request", plus "REFERRAL (10% off)" when the family was referred.

A link with `?ref=` ticks "Someone referred us" and shows the $135 price. The printed QR code on `/questly-refer` (`public/assets/questly/refer-qr.svg`) opens `https://brightmadestudios.com/questly?ref=qr#get`; a family sharing their own link can put their first name in it instead of `qr`. To regenerate the QR code, encode that same URL with any QR generator, error correction M, dark `#12103a` on white.
