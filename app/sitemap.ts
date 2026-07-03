import type { MetadataRoute } from "next";
import { GREMIO_SLUGS } from "@/lib/gremios";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://curro-kappa.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const gremios: MetadataRoute.Sitemap = GREMIO_SLUGS.map((slug) => ({
    url: `${SITE_URL}/para/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...gremios,
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/aviso-legal`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/condiciones`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
