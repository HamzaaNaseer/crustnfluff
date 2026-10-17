import { whatsappLink } from "@/lib/site";

export function OrderButton({
  message,
  children = "Order on WhatsApp",
}: {
  message?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-cocoa px-6 py-3 text-sm font-medium text-cream transition hover:bg-ink"
    >
      {children}
    </a>
  );
}
