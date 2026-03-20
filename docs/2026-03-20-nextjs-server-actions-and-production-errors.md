# Next.js Server Actions And Production Errors

## Why This Feels Confusing

You can understand Next.js well and still hit production errors that feel strange.

That is normal.

The confusing part is that not all Next.js errors come from the same layer:

- some happen during server rendering
- some happen during client hydration
- some happen only after a deploy
- some come from component misuse, not from Next itself

This note separates the problems we hit in `thedrive.center` so they are easier to reason about.

## The Two Different Errors

We dealt with two different classes of errors:

1. `Failed to find Server Action`
2. `Application error: a server-side exception has occurred... Digest: ...`

These are not the same problem.

## 1. Why `Failed to find Server Action` Happens

Server Actions are not plain API endpoints with stable URLs.

At build time, Next generates internal references that connect:

- the client bundle
- the form or client component
- the server-side action implementation

That means the browser is not simply calling:

- `/api/update-something`

It is effectively calling:

- "the action reference generated for this build"

So after a deploy, this can happen:

1. a user still has an old tab open
2. you deploy a new build
3. that old tab submits a form using the old action reference
4. the new server no longer recognizes it

Then Next throws:

- `Failed to find Server Action`

This is not usually a bug in your form fields or validation.
It is a version mismatch between:

- old browser state
- new deployed server build

## Why We Did Not Keep The Recovery File

We briefly considered a client-side recovery helper that listened to:

- `window` errors
- `unhandledrejection`

and refreshed the page when this specific error appeared.

That idea is technically valid.
But it depends on:

- `window`
- `sessionStorage`
- global error listeners
- forced reload behavior

That is more of an operational workaround than clean application logic.

You said clearly that you do not want that style in your codebase.

That is a reasonable preference.

So we removed it.

## What We Kept Instead

We kept the cleaner mitigation:

- `no-store` cache headers on mutation-heavy pages

in:

- [next.config.ts](/mnt/hdd/projects/thedrive.center/next.config.ts)

Specifically for:

- `/admin/:path*`
- `/onboarding`

This does not guarantee that an old open tab can never hit a stale action.
But it reduces the chance and keeps the codebase cleaner.

## 2. Why The Showcase Edit Page Crashed

This was a different issue.

The error:

- `Application error: a server-side exception has occurred...`
- with a digest

means something threw during render, and production hid the exact message.

For the showcase edit page, the likely real bug was in:

- [MediaCard.tsx](/mnt/hdd/projects/thedrive.center/src/app/admin/showcase/new/_components/MediaCard.tsx)

That component rendered existing media with `next/image` like this:

- dynamic `src`
- but without `width` and `height`
- and without `fill`

That is invalid usage for `next/image`.

Why it only showed on edit:

- the new page has no existing media yet
- the edit page loads real saved images immediately
- so the broken `Image` usage only gets exercised there

## The Fix For The Edit Page

We fixed the image usage properly:

- cover image now uses `fill` and `sizes`
- gallery images now use `fill` and `sizes`

That fix lives in:

- [MediaCard.tsx](/mnt/hdd/projects/thedrive.center/src/app/admin/showcase/new/_components/MediaCard.tsx)

This is a normal component-level fix.
It has nothing to do with stale Server Action references.

## The Mental Model To Keep

Use this distinction:

### If the error happens after submit, especially after a deploy

Think:

- stale Server Action reference
- old browser tab vs new build
- deployment mismatch

### If the error happens while opening a page

Think:

- server render
- bad props
- bad DB data
- invalid component usage
- `next/image` misuse

That distinction is the key.

## Why This Does Not Mean You \"Don't Understand Next.js\"

These are not beginner mistakes.

They sit at different boundaries:

- deployment behavior
- server rendering behavior
- framework component contracts

Knowing Next.js well does not mean you never hit them.
It means you learn to classify them faster:

- deploy mismatch
- render-time bug
- data bug
- cache bug

That is the real senior-level skill.

## Final State In `thedrive.center`

What we ship now:

- cleaner `no-store` hardening for admin and onboarding routes
- fixed `next/image` usage in the showcase edit form
- no browser-global recovery helper

## Short Version

`Failed to find Server Action` is a deploy-version mismatch problem.

The showcase edit crash was a component bug.

We chose the cleaner production compromise:

- keep cache hardening
- fix the real page bug
- do not keep the browser-global recovery hack
