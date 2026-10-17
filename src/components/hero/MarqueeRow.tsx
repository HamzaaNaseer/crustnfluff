type MarqueeImage = { url: string; title: string };

// Duplicates the image list once so the CSS translateX(-50%) loop is seamless.
export function MarqueeRow({
  images,
  direction = "left",
  duration = 40,
}: {
  images: MarqueeImage[];
  direction?: "left" | "right";
  duration?: number;
}) {
  if (images.length === 0) return null;
  const doubled = [...images, ...images];

  return (
    <div className="flex w-max gap-4">
      <div
        className={`flex gap-4 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={img.url}
            alt={img.title}
            loading="lazy"
            className="h-28 w-28 shrink-0 rounded-2xl object-cover shadow-md shadow-ink/10 sm:h-36 sm:w-36"
          />
        ))}
      </div>
    </div>
  );
}
