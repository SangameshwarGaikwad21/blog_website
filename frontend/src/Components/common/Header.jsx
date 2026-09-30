"use client";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { Typewriter, Cursor } from "react-simple-typewriter";
import { PenLine, ArrowRight, ChevronDown, Zap, Globe2 } from "lucide-react";

const ACCENT = "#ff6b0a";

const headline = [
  { text: "Share" },
  { text: "your" },
  { text: "stories", accent: true },
  { text: "with" },
  { text: "the" },
  { text: "world" },
];

const perks = [
  { icon: PenLine, title: "Write freely", text: "A clean editor with no clutter." },
  { icon: Zap, title: "Publish instantly", text: "Go live the moment you're ready." },
  { icon: Globe2, title: "Get discovered", text: "Reach readers everywhere." },
];

const scrollToBlogs = (e) => {
  e.preventDefault();
  document.getElementById("blogs")?.scrollIntoView({ behavior: "smooth" });
};

// eslint-disable-next-line no-unused-vars
function Header({ searchQuery, setSearchQuery }) {
  const reduceMotion = useReducedMotion();
  const fade = (delay) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  return (
    <header
      className="relative flex min-h-[calc(100dvh-7rem)] w-full flex-col items-center justify-center overflow-hidden bg-[#08080a] px-4 pb-20 pt-14 text-white sm:px-6 lg:min-h-[calc(100dvh-3.75rem)]"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 65% at 50% 40%, #000 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 40%, #000 30%, transparent 78%)",
        }}
      />

      {/* breathing orange glow */}
      <Motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-120px] h-[420px] w-[120%] max-w-[980px] -translate-x-1/2 rounded-full blur-3xl sm:h-[540px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,107,10,0.36), rgba(255,107,10,0.09) 60%, transparent)",
        }}
        animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* faint bottom fade into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#08080a] to-transparent"
      />

      <div className="relative w-full max-w-5xl text-center">
        {/* badge */}
        <Motion.div
          {...fade(0)}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-zinc-300 backdrop-blur sm:mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
              style={{ backgroundColor: ACCENT }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
          </span>
          A home for writers and readers
        </Motion.div>

        {/* headline: words rise into place one after another */}
        <h1
          aria-label={headline.map((w) => w.text).join(" ")}
          className="text-4xl font-extrabold leading-[1.08] tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl"
        >
          {headline.map((word, i) => (
            <Fragment key={i}>
              <span aria-hidden className="relative inline-block overflow-hidden pb-[0.12em] align-bottom">
                <Motion.span
                  className="inline-block"
                  style={
                    word.accent
                      ? {
                          backgroundImage: "linear-gradient(90deg, #ff8a3d, #ff6b0a 55%, #ff4d00)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }
                      : undefined
                  }
                  initial={reduceMotion ? false : { y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word.text}
                </Motion.span>

                {word.accent && (
                  <Motion.span
                    className="absolute bottom-0 left-0 h-[3px] w-full origin-left rounded-full"
                    style={{ backgroundColor: ACCENT, boxShadow: "0 0 14px rgba(255,107,10,0.7)" }}
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </span>
              {i < headline.length - 1 && <span className="inline-block w-[0.28em]" />}
            </Fragment>
          ))}
        </h1>

        {/* typing line */}
        <Motion.p
          {...fade(0.85)}
          className="mt-5 min-h-[1.75rem] text-lg font-medium text-zinc-300 sm:mt-7 sm:text-2xl"
        >
          Write about{" "}
          <span className="font-semibold text-orange-400">
            {reduceMotion ? (
              "anything"
            ) : (
              <>
                <Typewriter
                  words={["technology", "travel", "design", "your life", "anything"]}
                  loop={0}
                  cursor={false}
                  typeSpeed={70}
                  deleteSpeed={45}
                  delaySpeed={1400}
                />
                <Cursor cursorStyle="|" cursorColor={ACCENT} />
              </>
            )}
          </span>
        </Motion.p>

        <Motion.p
          {...fade(1)}
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base"
        >
          Write, publish, and explore stories from creators everywhere. Your next
          post is one click away.
        </Motion.p>

        {/* calls to action */}
        <Motion.div
          {...fade(1.15)}
          className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <Link
            to="/createblog"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
            style={{ backgroundColor: ACCENT, boxShadow: "0 0 28px rgba(255,107,10,0.3)" }}
          >
            <PenLine size={16} />
            Start writing
          </Link>
          <a
            href="#blogs"
            onClick={scrollToBlogs}
            className="group inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          >
            Explore blogs
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </Motion.div>

        {/* value points */}
        <Motion.ul
          {...fade(1.3)}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 text-left sm:mt-16 sm:grid-cols-3"
        >
          {perks.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#0e0e10]/80 p-4 backdrop-blur"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                <Icon size={16} aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{text}</p>
              </div>
            </li>
          ))}
        </Motion.ul>
      </div>

      {/* scroll cue */}
      <a
        href="#blogs"
        onClick={scrollToBlogs}
        aria-label="Scroll to blogs"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-zinc-500 transition hover:text-orange-500 sm:block"
      >
        <Motion.span
          className="block"
          animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={22} />
        </Motion.span>
      </a>
    </header>
  );
}

export default Header;