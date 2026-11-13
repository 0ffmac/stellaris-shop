import { useEffect } from "react";
import siteMeta from "@/data/site-meta.json";

interface SeoEntry {
  title: string;
  description: string;
  ogImage: string;
}

const categories = siteMeta.categories as Record<string, SeoEntry>;
const defaultSeo: SeoEntry = siteMeta.default;

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export function useSeo(path: string, categoryId?: string, override?: SeoEntry) {
  useEffect(() => {
    const seo =
      override ?? (categoryId && categories[categoryId] ? categories[categoryId] : defaultSeo);
    const canonical = `${siteMeta.siteUrl}${path}`;
    const image = `${siteMeta.siteUrl}${seo.ogImage}`;

    document.title = seo.title;

    upsertMeta("name", "description", seo.description);
    upsertLink("canonical", canonical);

    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:secure_url", image);
    upsertMeta("property", "og:image:alt", seo.title);
    upsertMeta("property", "og:type", "website");

    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("name", "twitter:image:alt", seo.title);
  }, [path, categoryId, override?.title, override?.description, override?.ogImage]);
}
