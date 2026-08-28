"use client";

import { IconPlay } from "./Icon";

function embedUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtube.com") || url.hostname === "youtu.be") {
      const id = url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}

export default function VideoEmbed({ url }: { url: string }) {
  const src = embedUrl(url);

  if (!src) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 bg-[var(--m2-ink)] hover:bg-[var(--m2-muted)] text-[var(--m2-bg)] font-semibold text-xs px-4 py-3 rounded-sm transition-colors"
      >
        <IconPlay size={14} />
        Ver video / tour 360
      </a>
    );
  }

  return (
    <div className="rounded-sm overflow-hidden border border-[var(--m2-line)] aspect-video bg-black">
      <iframe
        src={src}
        title="Video de la propiedad"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
}
