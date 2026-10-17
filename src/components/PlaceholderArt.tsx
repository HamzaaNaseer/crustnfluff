// Textured stand-in for real photography — gradient + subtle dot pattern +
// a simple line icon, so the layout reads as designed rather than broken
// while real photos aren't in yet. Swap for <Image> once photos land.
const icons: Record<string, React.ReactNode> = {
  cakes: (
    <path
      d="M8 34v-8a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v8M8 34h24M8 34a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4M14 22v-4c0-2 1.5-3 2-4s.5-2 0-3M20 11c-.5 1-.5 2 0 3s2 2 2 4v4M26 22v-4c0-2 1.5-3 2-4s.5-2 0-3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  brownies: (
    <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <rect x="9" y="14" width="22" height="18" rx="2" />
      <path d="M9 23h22M16 14v18M24 14v18" />
    </g>
  ),
  cupcakes: (
    <path
      d="M12 20h16l-2 14a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2l-2-14ZM10 20a10 10 0 0 1 20 0M20 10v-2M16.5 11l-1-2M23.5 11l1-2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
};

const gradients: Record<string, string> = {
  cakes: "from-blush via-rose/40 to-cream",
  brownies: "from-cocoa/25 via-blush to-cream",
  cupcakes: "from-rose/30 via-cream to-blush",
};

export function PlaceholderArt({
  category,
  className = "",
  style,
}: {
  category: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-linear-to-br ${
        gradients[category] ?? gradients.cakes
      } ${className}`}
      style={style}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          color: "var(--rose)",
        }}
      />
      <svg
        viewBox="0 0 40 40"
        className="relative h-14 w-14 text-cocoa/70 sm:h-20 sm:w-20"
        aria-hidden
      >
        {icons[category] ?? icons.cakes}
      </svg>
    </div>
  );
}
