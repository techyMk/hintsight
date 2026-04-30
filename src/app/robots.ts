import type { MetadataRoute } from "next";

function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    try {
      return new URL(explicit).origin;
    } catch {
      // fall through
    }
  }
  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) return `https://${vercelHost}`;
  return "http://localhost:3000";
}

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs", "/changelog"],
        disallow: [
          "/dashboard",
          "/log",
          "/reviews",
          "/memory",
          "/settings",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
