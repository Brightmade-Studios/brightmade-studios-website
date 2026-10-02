# brightmadestudios.com

The Brightmade Studios website: home, apps, support, privacy policy, terms of use and account deletion pages.

## How changes go live

1. Change files on a branch and open a pull request.
2. The **Check** workflow makes sure every link works, no page uses an en or em dash, and colors only come from `public/assets/theme.css`.
3. Merge the pull request. The **Deploy** workflow publishes the site to Firebase Hosting (project `brightmade-studios`) using Workload Identity Federation. There are no service account keys, and nothing is deployed by hand.

To re-run a deploy without a code change: **Actions > Deploy > Run workflow** on `main`.

## Layout

- `public/` is the site. Plain HTML and CSS, no build step.
- `public/assets/theme.css` is the only place colors are defined. Light and dark mode follow the device setting.
- `scripts/check-site.mjs` runs on every pull request.
- `scripts/deploy-hosting.mjs` publishes `public/` through the Firebase Hosting REST API with a short-lived token.
- `docs/keyless-setup.md` is the one-time Google Cloud setup that lets GitHub deploy.

## Fonts

Nunito is self-hosted under the SIL Open Font License (`public/assets/fonts/OFL.txt`), so the site makes no third-party requests.
