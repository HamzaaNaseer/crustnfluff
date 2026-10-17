"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import type { MouseEvent } from "react";
import { MarqueeRow } from "@/components/hero/MarqueeRow";
import { OrderButton } from "@/components/OrderButton";
import { site } from "@/lib/site";

type HeroCake = { url: string; title: string };

const headlineWords = ["Cakes", "that", "stop", "the", "scroll."];

const wordVariants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { delay: 0.5 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero({ cakes }: { cakes: HeroCake[] }) {
  const rowA = cakes.slice(0, 8);
  const rowB = cakes.slice(8, 16);
  const floatingA = cakes[0];
  const floatingB = cakes[1];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const parallaxA_X = useTransform(springX, [-0.5, 0.5], [-24, 24]);
  const parallaxA_Y = useTransform(springY, [-0.5, 0.5], [-16, 16]);
  const parallaxB_X = useTransform(springX, [-0.5, 0.5], [18, -18]);
  const parallaxB_Y = useTransform(springY, [-0.5, 0.5], [14, -14]);

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[94vh] flex-col overflow-hidden bg-cream"
    >
      {/* Drifting gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob-drift absolute -left-32 -top-24 h-112 w-md rounded-full bg-rose/30 blur-[90px]" />
        <div className="animate-blob-drift-slow absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-blush blur-[90px]" />
        <div className="animate-blob-drift absolute -bottom-24 left-1/3 h-88 w-88 rounded-full bg-rose/20 blur-[100px]" />
      </div>

      {/* Background marquee rows of real cakes, rotated, faded at the edges */}
      {(rowA.length > 0 || rowB.length > 0) && (
        <div className="pointer-events-none absolute inset-0 flex -rotate-3 scale-110 flex-col justify-center gap-5 opacity-[0.35] sm:opacity-45">
          <MarqueeRow images={rowA} direction="left" duration={46} />
          <MarqueeRow images={rowB} direction="right" duration={52} />
        </div>
      )}

      {/* Vignette so text stays legible over the marquee */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 42%, var(--cream) 35%, transparent 75%), linear-gradient(to bottom, var(--cream) 0%, transparent 16%, transparent 78%, var(--cream) 100%)",
        }}
      />
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-rose/30 bg-white/70 px-4 py-1.5 text-xs font-medium text-cocoa shadow-sm backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose" />
          </span>
          ★ {site.rating.value} rated · {site.rating.count} Google reviews
        </motion.p>

        <h1 className="mt-6 font-display text-6xl leading-[0.98] text-cocoa sm:text-8xl">
          {headlineWords.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                custom={i}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
                className="inline-block"
              >
                {word}
                {i < headlineWords.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-6 max-w-md text-lg text-ink/70"
        >
          Home-baked custom cakes, delivered fresh across Islamabad, Rawalpindi, Wah Cantt
          &amp; Taxila.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.6 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <OrderButton>Order on WhatsApp</OrderButton>
          <a
            href="#gallery"
            className="text-sm font-medium text-cocoa underline underline-offset-4 decoration-rose/50 hover:decoration-rose"
          >
            See our bakes
          </a>
        </motion.div>
      </div>

      {/* Floating real cake photos with mouse parallax (desktop) */}
      {floatingA && (
        <motion.div
          style={{ x: parallaxA_X, y: parallaxA_Y }}
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [-6, -3, -6],
            y: [0, -14, 0],
          }}
          transition={{
            opacity: { delay: 0.8, duration: 0.7 },
            scale: { delay: 0.8, duration: 0.7 },
            rotate: { delay: 1.5, duration: 7, repeat: Infinity, ease: "easeInOut" },
            y: { delay: 1.5, duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="pointer-events-none absolute left-[6%] top-[20%] hidden overflow-hidden rounded-3xl shadow-2xl shadow-ink/20 sm:block"
        >
          <Image src={floatingA.url} alt={floatingA.title} width={170} height={210} className="h-52.5 w-42.5 object-cover" />
        </motion.div>
      )}
      {floatingB && (
        <motion.div
          style={{ x: parallaxB_X, y: parallaxB_Y }}
          initial={{ opacity: 0, scale: 0.85, rotate: 8 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [6, 3, 6],
            y: [0, 16, 0],
          }}
          transition={{
            opacity: { delay: 0.95, duration: 0.7 },
            scale: { delay: 0.95, duration: 0.7 },
            rotate: { delay: 1.6, duration: 6.5, repeat: Infinity, ease: "easeInOut" },
            y: { delay: 1.6, duration: 5.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="pointer-events-none absolute right-[7%] top-[24%] hidden overflow-hidden rounded-3xl shadow-2xl shadow-ink/20 lg:block"
        >
          <Image src={floatingB.url} alt={floatingB.title} width={160} height={200} className="h-50 w-40 object-cover" />
        </motion.div>
      )}

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="relative z-10 mb-8 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5 text-ink/40"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Scroll</span>
          <div className="h-8 w-px bg-ink/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
