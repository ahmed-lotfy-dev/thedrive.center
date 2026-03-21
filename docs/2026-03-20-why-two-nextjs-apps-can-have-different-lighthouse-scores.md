# Why Two Next.js Apps Can Have Very Different Lighthouse Scores

## The Short Answer

Because Lighthouse does not score the framework name.

It scores what the browser actually pays for:

- how much JavaScript ships on first load
- how much hydrates immediately
- how much work runs on the main thread
- how heavy the above-the-fold UI is
- how many fonts, animations, analytics, and client components are involved

So two apps can both be:

- Next.js
- deployed the same way
- built by the same developer

and still perform very differently.

That is what is happening between:

- `thedrive.center`
- `my-portfolio`

## The Wrong Mental Model

The wrong model is:

- "both are Next.js, so they should score about the same"

That is not how performance works.

Next.js is only the runtime and build framework.
It does not guarantee equal performance across projects.

What matters is the actual page composition.

## Example 1: Homepage Composition Is Different

In `thedrive.center`, the homepage is comparatively focused:

- [page.tsx](/mnt/hdd/projects/thedrive.center/src/app/page.tsx)

It renders:

- `Hero`
- `Services`
- `Process`
- `FAQ`
- `CTA`
- `LocationSection`
- one delayed advice popup

That is a business landing page with a narrow job:

- explain service
- show trust
- get the user to book

In `my-portfolio`, the homepage is broader and more interactive:

- [page.tsx](/mnt/hdd/projects/my-portfolio/src/app/[locale]/page.tsx)

It renders:

- `Hero`
- `Services`
- `TechStack`
- `Experience`
- `Projects`
- `About`
- `Testimonials`
- `Contact`
- multiple structured-data blocks
- locale-aware metadata

That page is doing much more work as a first-load experience.

So even before optimization, the homepage in `my-portfolio` is simply a heavier product.

## Example 2: `my-portfolio` Needs More Client-Side Work

`my-portfolio` has more reasons to cost extra on mobile:

- i18n routing and locale-aware pages
- analytics and dashboard stack
- richer animated homepage sections
- more content sections on the same page
- more client-side section behavior

You can see the homepage already using dynamic imports there:

- [page.tsx](/mnt/hdd/projects/my-portfolio/src/app/[locale]/page.tsx)

Examples:

```ts
const Services = nextDynamic(() => import("@/src/components/features/homepage/Services"));
const Experience = nextDynamic(() => import("@/src/components/features/homepage/Experience"));
const TechStack = nextDynamic(() => import("@/src/components/features/homepage/TechStack"));
const About = nextDynamic(() => import("@/src/components/features/homepage/About"));
const Testimonials = nextDynamic(() => import("@/src/components/features/homepage/Testimonials"));
const Contact = nextDynamic(() => import("@/src/components/features/homepage/Contact"));
```

That is not because the codebase is wrong.
It is because the page has enough below-the-fold content that delaying some JS is worth it.

`thedrive.center` does not need the same level of aggressive splitting on the homepage because its landing page is more focused and operationally simpler.

## Example 3: Font Strategy Is Different

In `thedrive.center`, the app uses a local Cairo font in the root layout:

- [layout.tsx](/mnt/hdd/projects/thedrive.center/src/app/layout.tsx)

That means:

- no Google font network fetch at runtime
- one font family, aligned with the Arabic-first product
- more predictable loading behavior

In `my-portfolio`, the font setup is broader:

- [fonts.ts](/mnt/hdd/projects/my-portfolio/src/components/ui/fonts.ts)

It defines:

- `Inter`
- `Poppins`
- `Sora`
- `Tajawal`

Even with some preload tuning, this is still a more complex font strategy than a single local-family setup.

That does not make it bad.
It just means the page has more typography decisions and more possible performance cost.

## Example 4: The First Screen Has Different Goals

The first screen in `thedrive.center` is about:

- immediate service understanding
- booking intent
- local business trust

So the first fold can stay relatively direct.

The first screen in `my-portfolio` is about:

- branding
- personal presentation
- visual identity
- design expression

That usually means:

- more hero styling
- more motion
- more decorative layers
- more client-side polish

That extra polish is exactly the kind of thing Lighthouse mobile punishes if it increases:

- LCP
- JS execution time
- main-thread work

## Example 5: Same Framework, Different Bundle Shape

This is the real lesson.

Performance is shaped by the page’s real bundle and render work.

For `thedrive.center`, the homepage is closer to:

- a lean local-business landing page

For `my-portfolio`, the homepage is closer to:

- a richer personal brand experience

Those are different products.
So they naturally want different optimization strategies.

## Why `next/dynamic` Makes More Sense In `my-portfolio`

This was the part that felt unfair:

- "why does `my-portfolio` need dynamic section loading if both apps are Next.js?"

Because the section economics are different.

In `my-portfolio`, these sections are below the fold and not required for the first paint:

- `Services`
- `TechStack`
- `Experience`
- `About`
- `Testimonials`
- `Contact`

So loading them later is a smart tradeoff.

It reduces:

- initial bundle size
- initial hydration cost
- main-thread work

In `thedrive.center`, the homepage content is already closer to the core user path, so splitting every section the same way may add complexity without giving the same return.

## Why This Does Not Mean One Codebase Is Better

This is not:

- good code vs bad code

It is:

- different UX goals
- different content density
- different client-side cost

A portfolio often needs more visual richness.
A service booking site often benefits from restraint.

So the performance plan should match the product, not just the framework.

## Practical Rule

When comparing two Next.js apps, ask:

1. How much is above the fold?
2. How much of that is client-side?
3. How much of that is animated?
4. How much JS is required before the page feels usable?
5. How much can be delayed until after first paint?

That is the right performance lens.

Not:

- "Are both apps built in Next.js?"

## Final Summary

`my-portfolio` needs more aggressive performance optimization because its homepage is:

- broader
- more animated
- more content-rich
- more client-heavy

`thedrive.center` is lighter because its homepage is:

- more focused
- more transactional
- less visually complex on first load

So yes, two Next.js apps can behave very differently in Lighthouse.

The framework is the same.
The page cost is not.
