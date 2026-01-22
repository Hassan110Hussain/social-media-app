"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Reel } from "@/types/api";

const reelSet: Reel[] = [
  {
    id: "reel-1",
    title: "Micro-interactions for onboarding",
    creator: "Motion Lab",
    category: "Product",
    coverUrl: "/placeholders/post-1.jpg",
    duration: "0:38",
    likes: 2100,
    comments: 86,
    saves: 320,
    views: 18000,
  },
  {
    id: "reel-2",
    title: "Glassmorphic pricing reveal",
    creator: "Studio North",
    category: "UI Motion",
    coverUrl: "/placeholders/post-2.jpg",
    duration: "0:52",
    likes: 1840,
    comments: 64,
    saves: 410,
    views: 15400,
  },
  {
    id: "reel-3",
    title: "Fintech card swipe animation",
    creator: "Finlab",
    category: "Fintech",
    coverUrl: "/placeholders/post-3.jpg",
    duration: "0:41",
    likes: 2320,
    comments: 92,
    saves: 530,
    views: 20100,
  },
  {
    id: "reel-4",
    title: "AI co-pilot chat pattern",
    creator: "Ship Fast",
    category: "AI",
    coverUrl: "/placeholders/post-1.jpg",
    duration: "0:47",
    likes: 1760,
    comments: 55,
    saves: 360,
    views: 14200,
  },
];

const Reels = () => {
  const [reels, setReels] = useState<Reel[]>(reelSet);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  const currentReel = useMemo(() => reels[activeIndex], [activeIndex, reels]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reels.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reels.length - 1 ? 0 : prev + 1));
  };

  const toggleLike = (id: string) => {
    setReels((current) =>
      current.map((reel) =>
        reel.id === id
          ? {
              ...reel,
              liked: !reel.liked,
              likes: reel.liked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel
      )
    );
  };

  const toggleSave = (id: string) => {
    setReels((current) =>
      current.map((reel) =>
        reel.id === id
          ? {
              ...reel,
              saved: !reel.saved,
              saves: reel.saved ? reel.saves - 1 : reel.saves + 1,
            }
          : reel
      )
    );
  };

  return (
    <div className="min-h-screen px-3 py-4 text-slate-900 transition-colors dark:text-white sm:px-4 sm:py-6 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:gap-6">
        <main className="min-w-0 flex-1 space-y-4 sm:space-y-5">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Reels</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Short, high-signal previews</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Swipe through product motion, micro-interactions, and quick showcases.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setMuted((prev) => !prev)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                {muted ? "Unmute" : "Mute"}
              </button>
              <button type="button" onClick={() => setAutoplay((prev) => !prev)} className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-blue-500 hover:shadow-md">
                {autoplay ? "Autoplay on" : "Autoplay off"}
              </button>
            </div>
          </header>

          {currentReel && (
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-xl shadow-slate-200/30 dark:border-slate-800">
              <Image src={currentReel.coverUrl} alt={currentReel.title} width={1080} height={1920} className="aspect-[9/16] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

              <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {currentReel.category}
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handlePrev} className="h-9 w-9 rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25">
                      ←
                    </button>
                    <button type="button" onClick={handleNext} className="h-9 w-9 rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25">
                      →
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">{currentReel.creator}</p>
                    <h2 className="text-xl font-bold sm:text-2xl">{currentReel.title}</h2>
                    <p className="text-sm text-white/80">Duration {currentReel.duration} · {currentReel.views.toLocaleString()} views</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <button type="button" onClick={() => toggleLike(currentReel.id)} className={`flex items-center gap-2 rounded-full px-3 py-2 transition ${
                      currentReel.liked ? "bg-rose-500 text-white shadow-sm shadow-rose-400/40" : "bg-white/15 text-white hover:bg-white/25"
                    }`}>
                      {currentReel.liked ? "♥" : "♡"} {currentReel.likes.toLocaleString()}
                    </button>
                    <span className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-white backdrop-blur">💬 {currentReel.comments}</span>
                    <button type="button" onClick={() => toggleSave(currentReel.id)} className={`flex items-center gap-2 rounded-full px-3 py-2 transition ${
                      currentReel.saved ? "bg-emerald-500 text-white shadow-sm shadow-emerald-400/40" : "bg-white/15 text-white hover:bg-white/25"
                    }`}>
                      {currentReel.saved ? "Saved" : "Save"} {currentReel.saves}
                    </button>
                    <button type="button" className="rounded-full bg-white/15 px-3 py-2 text-white backdrop-blur transition hover:bg-white/25">📤 Share</button>
                  </div>

                  <div className="flex items-center gap-2">
                    {reels.map((reel, index) => (
                      <button
                        key={reel.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`h-1.5 flex-1 rounded-full transition ${index === activeIndex ? "bg-white" : "bg-white/30 hover:bg-white/50"}`}
                        aria-label={`Go to ${reel.title}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <aside className="shrink-0 space-y-3 lg:w-72">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Up next</h3>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Queue</span>
            </div>
            <ul className="mt-3 space-y-3">
              {reels.map((reel, index) => (
                <li
                  key={reel.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 transition ${
                    index === activeIndex
                      ? "border-blue-100 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-800/60 dark:bg-blue-900/30 dark:text-blue-100"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-900/80">
                    <Image src={reel.coverUrl} alt={reel.title} fill className="object-cover" />
                    <span className="absolute bottom-1 left-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">{reel.duration}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{reel.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{reel.creator} · {reel.category}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm shadow-sm shadow-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
            <p className="font-semibold text-slate-900 dark:text-white">Publish a reel</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Share your motion study, keep it under 60 seconds, and add a concise caption.</p>
            <button type="button" className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-slate-800 dark:bg-white dark:text-slate-900">
              Upload reel
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Reels;
