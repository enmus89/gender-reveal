# Baby Gender Reveal Quiz

Interactive 5-stage gender-reveal quiz (English / Albanian) for relatives, with a
live scoreboard and a parent-only roster of every guess. Static front-end hosted
on GitHub Pages; guesses are saved to a Google Sheet through a Google Apps Script
web app.

## How saving results works

- Each guest's guess is `POST`ed to a Google Apps Script web app.
- The script appends a row to a Google Sheet you own: name, relationship, guess,
  message, timestamp, correct?.
- **To see the results:** open that Google Sheet, or open the app and unlock the
  **Parents** panel with the PIN (default `1991`).

## One-time setup

### 1. Google Sheet backend

1. Create a new Google Sheet.
2. **Extensions → Apps Script**, delete the sample, paste
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs), save.
3. Optional: **Project Settings → Script Properties** → add `PARENT_PIN`
   (default `1991`) and `ACTUAL_GENDER` (`boy` or `girl`, default `boy`).
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment URL (ends in `/exec`).

> After editing `Code.gs` later, do **Manage deployments → edit → new version**,
> or the live site keeps using the old code.

### 2. GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Secrets and variables → Actions → Variables → New variable**
   - Name: `VITE_SHEET_API_URL`
   - Value: the `/exec` URL from step 1.
3. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Every push to `main` builds and publishes to
   `https://<user>.github.io/<repo>/` via `.github/workflows/deploy.yml`.

## Run locally

```bash
npm install
cp .env.example .env      # then paste your /exec URL into VITE_SHEET_API_URL
npm run dev
```

`npm run build` outputs the static site to `dist/`.

## Notes

- The Apps Script `/exec` URL and the parent PIN are not real secrets — anyone
  who has the link can submit a guess, and the PIN only gates the in-app roster.
  Fine for a family party; don't store anything sensitive in the sheet.
- If `VITE_SHEET_API_URL` is unset, the quiz still runs — guesses just aren't
  saved and the scoreboard stays empty.
