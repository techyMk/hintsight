import { clerkMiddleware } from "@clerk/nextjs/server";

// IMPORTANT: this MUST live as `middleware.ts`, NOT `proxy.ts`.
//
// Next.js 16 deprecated middleware in favour of proxy, but proxy.ts is
// Node.js-runtime-only and refuses any `export const runtime = 'edge'`
// override. Clerk's `clerkMiddleware()` needs the Edge runtime to attach
// the auth context — without it, server-side `auth()` returns null even
// when the user has a valid Clerk session, and protected layouts fall
// into a redirect loop with /sign-in.
//
// We accept the deprecation warning at startup and keep middleware.ts
// until Clerk officially supports Next.js 16's Node-runtime proxy.
//
// We also deliberately do NOT call `auth.protect()` here — it races
// Clerk's post-sign-in cookie propagation. Server-side auth checks live
// in (app)/layout.tsx where the cookie has settled.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
