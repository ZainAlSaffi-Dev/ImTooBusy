# Ship the redesign

All your **files on disk are updated** — the refactor is done. The sandbox I ran in can't reach GitHub (the proxy blocks the push), and it also can't delete git's lockfile, so I couldn't finish the commit on your behalf. Two minutes of terminal work and you're live.

## Easiest path — re-commit and push from your machine

From the repo root (`~/.../ImTooBusy`):

```bash
# 1. Clear the stuck lockfile that the sandbox left behind
rm -f .git/index.lock

# 2. Stage all the redesigned files
git add carbon-calendar

# 3. Commit (use whatever message you like, or the one I drafted below)
git commit -F .git/MERGE_MSG_REDESIGN 2>/dev/null || git commit

# 4. Push — Vercel + Railway will rebuild automatically
git push origin main
```

If step 3 errors because the message file isn't there, just run `git commit` and paste this message:

> Redesign portfolio: warm-dark editorial theme, refresh credentials

(or copy the longer one from `redesign.patch` at the top of the file).

## Alternative — apply the prepared patch

I also saved a clean patch you can apply directly:

```bash
rm -f .git/index.lock
git checkout .                          # discard staged files first (optional)
git am redesign.patch                   # applies the commit verbatim
git push origin main
rm redesign.patch SHIP_ME.md            # cleanup
```

## What changed (so you know what to expect)

- New warm-dark theme (no more neon purple) — `tailwind.config.js`, `src/index.css`
- New Hero, About, Experience, Projects, Contact, Navbar, Footer
- Terminal Gate removed
- Booking modal restyled — **all API contracts preserved verbatim**, so the calendar still works
- Admin pages (`/login`, `/admin`) untouched; still use the `carbon-*` palette aliases I kept for backwards compatibility

## Verify before pushing (optional)

```bash
cd carbon-calendar
npm install
npm run dev   # smoke test in browser
```

Once you're happy, delete this file and `redesign.patch`.
