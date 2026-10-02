# One-time keyless deploy setup

Run these once in **Cloud Shell** (console.cloud.google.com, signed in with the Brightmade Gmail, then the `>_` button at the top right). Paste one block at a time.

They let this repository, and only this repository's `main` branch, deploy to Firebase Hosting in `brightmade-studios`. No keys are created.

## 0. Turn on Hosting once

In the Firebase console, open the `brightmade-studios` project, go to **Build > Hosting**, tap **Get started**, and click **Next** through the steps (skip the install commands). This creates the `brightmade-studios.web.app` site.

## 1. Pick the project and turn on the APIs

```
gcloud config set project brightmade-studios
gcloud services enable iam.googleapis.com iamcredentials.googleapis.com sts.googleapis.com firebasehosting.googleapis.com
```

## 2. Create the GitHub identity pool and provider

```
gcloud iam workload-identity-pools create github --location=global --display-name="GitHub"

gcloud iam workload-identity-pools providers create-oidc website \
  --location=global \
  --workload-identity-pool=github \
  --display-name="Website repo" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
  --attribute-condition="assertion.repository=='Brightmade-Studios/brightmade-studios-website' && assertion.ref=='refs/heads/main'"
```

## 3. Create the deployer account with only Hosting access

```
gcloud iam service-accounts create website-deployer --display-name="Website deployer"

gcloud projects add-iam-policy-binding brightmade-studios \
  --member="serviceAccount:website-deployer@brightmade-studios.iam.gserviceaccount.com" \
  --role="roles/firebasehosting.admin" \
  --condition=None
```

## 4. Let the repo act as the deployer

```
gcloud iam service-accounts add-iam-policy-binding website-deployer@brightmade-studios.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/328965318405/locations/global/workloadIdentityPools/github/attribute.repository/Brightmade-Studios/brightmade-studios-website"
```

## 5. Check it

```
gcloud iam workload-identity-pools providers describe website --location=global --workload-identity-pool=github --format="value(name,state)"
```

It should print a name ending in `providers/website` and `ACTIVE`.

## Deploying

Merge a pull request into `main`. To re-deploy without a change: **Actions > Deploy > Run workflow** on `main`.
