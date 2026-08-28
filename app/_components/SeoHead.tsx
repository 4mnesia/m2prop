"use client";

import { useEffect } from "react";

type Props = {
  title: string;
  description: string;
  imagen?: string;
  url?: string;
};

function setMeta(key: "name" | "property", value: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${value}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(key, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function SeoHead({ title, description, imagen, url }: Props) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    if (imagen) setMeta("property", "og:image", imagen);
    if (url) setMeta("property", "og:url", url);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    if (imagen) setMeta("name", "twitter:image", imagen);
    return () => {
      document.title = prevTitle;
    };
  }, [title, description, imagen, url]);

  return null;
}
