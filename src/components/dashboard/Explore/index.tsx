"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ExploreItem } from "@/types/api";

const exploreItems: ExploreItem[] = [
  {
    id: "exp-1",
    title: "Minimalist analytics dashboard",
    category: "Product",
    tags: ["ui", "analytics", "dashboard"],
    description: "Card layout with rich stats and soft gradients for SaaS teams.",
    coverUrl: "/placeholders/post-1.jpg",
    gradient: "from-amber-500/25 via-fuchsia-500/20 to-sky-500/20",
    likes: 2400,
    saves: 530,
    views: 12800,
  },
  {
    id: "exp-2",
    title: "Premium mobile banking flow",
    category: "Fintech",
    tags: ["mobile", "fintech", "product"],
    description: "Step-by-step onboarding with focus on clarity and trust cues.",
    coverUrl: "/placeholders/post-2.jpg",
    gradient: "from-emerald-500/25 via-cyan-500/15 to-blue-600/20",
    likes: 1980,
    saves: 410,
    views: 10120,
  },
  {
    id: "exp-3",
    title: "Editorial grid for travel stories",
    category: "Content",
    tags: ["editorial", "layout", "travel"],
    description: "Magazine-style hero, adaptive columns, and clean typography.",
    coverUrl: "/placeholders/post-3.jpg",
    gradient: "from-orange-500/25 via-amber-500/15 to-rose-500/20",
    likes: 1640,
    saves: 320,
    views: 8840,
  },
  {
    id: "exp-4",
    title: "AI handoff kit for designers",
    category: "AI",
    tags: ["ai", "handoff", "system"],
    description: "Prompt presets, token rules, and accessibility checks in one view.",
    coverUrl: "/placeholders/post-1.jpg",
    gradient: "from-indigo-500/25 via-violet-500/20 to-fuchsia-600/20",
    likes: 2230,
    saves: 610,
    views: 14500,
  },
  {
    id: "exp-5",
    title: "Collab whiteboard with reactions",
    category: "Collaboration",
    tags: ["whiteboard", "realtime", "productivity"],
    description: "Live cursors, sticky notes, and lightweight toolbar for teams.",
    coverUrl: "/placeholders/post-2.jpg",
    gradient: "from-emerald-500/25 via-lime-500/15 to-amber-400/20",
    likes: 1890,
    saves: 470,
    views: 12040,
  },
  {
    id: "exp-6",
    title: "Streaming hero with layered glass",
    category: "Media",
    tags: ["glassmorphism", "hero", "media"],
    description: "Frosted overlays, gradient edge glow, and adaptive CTAs.",
    coverUrl: "/placeholders/post-3.jpg",
    gradient: "from-blue-600/25 via-sky-500/15 to-cyan-400/20",
    likes: 1740,
    saves: 355,
    views: 9320,
  },
];

const categories = ["All", "Product", "Fintech", "Content", "AI", "Collaboration", "Media"];
const trendingTags = ["ui", "mobile", "ai", "editorial", "analytics", "glassmorphism", "handoff", "realtime"];

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(exploreItems);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesTag = !activeTag || item.tags.includes(activeTag);
      const matchesQuery =
        search.trim().length === 0 ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesTag && matchesQuery;
    });
  }, [activeTag, items, search, selectedCategory]);

  const toggleSave = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, saves: item.saves + (item.tags.includes("saved") ? -1 : 1), tags: item.tags.includes("saved") ? item.tags.filter((tag) => tag !== "saved") : [...item.tags, "saved"] }
          : item
      )
    );
  };

  const toggleLike = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, likes: item.tags.includes("liked") ? item.likes - 1 : item.likes + 1, tags: item.tags.includes("liked") ? item.tags.filter((tag) => tag !== "liked") : [...item.tags, "liked"] } : item
      )
    );
  };

  return (
    <div className="min-h-screen px-3 py-4 text-slate-900 transition-colors dark:text-white sm:px-4 sm:py-6 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:gap-6">
        <main className="min-w-0 flex-1 space-y-4 sm:space-y-5">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Discover</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Explore curated inspiration</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search UI patterns, product ideas, and motion concepts tailored for modern teams.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:inline-flex">
                ⟳ Refresh picks
              </button>
              <button type="button" className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-blue-500 hover:shadow-md">
                + Submit your shot
              </button>
            </div>
          </header>

          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <span className="text-lg">🔍</span>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search layouts, industries, or keywords" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
                {search && (
                  <button type="button" onClick={() => setSearch("")} className="text-xs font-semibold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
                    Clear
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        active ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950" : "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wide text-slate-400">Trending tags</span>
              {trendingTags.map((tag) => {
                const active = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(active ? null : tag)}
                    className={`rounded-full px-3 py-1 font-semibold transition ${
                      active ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const liked = item.tags.includes("liked");
              const saved = item.tags.includes("saved");
              return (
                <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm shadow-slate-200 backdrop-blur transition hover:-translate-y-[2px] hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-80 blur-2xl transition group-hover:opacity-100`} aria-hidden />
                  <div className="relative flex flex-col gap-3 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm backdrop-blur dark:bg-slate-800/70 dark:text-slate-200">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleLike(item.id)}
                          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                            liked ? "bg-rose-500 text-white shadow-sm shadow-rose-400/40" : "bg-white/80 text-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
                          }`}
                        >
                          {liked ? "♥" : "♡"} {item.likes.toLocaleString()}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSave(item.id)}
                          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                            saved ? "bg-emerald-500 text-white shadow-sm shadow-emerald-400/40" : "bg-white/80 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
                          }`}
                        >
                          {saved ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-950/60 shadow-inner shadow-slate-200/30 dark:border-slate-800">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                      <Image src={item.coverUrl} alt={item.title} width={640} height={640} className="h-52 w-full object-cover sm:h-56" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/80 dark:text-slate-100">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        {item.views.toLocaleString()} views
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold leading-tight text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tags
                          .filter((tag) => tag !== "liked" && tag !== "saved")
                          .map((tag) => (
                            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                              #{tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-10 text-center text-sm text-slate-500 shadow-sm shadow-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
                <p className="font-semibold">No results for this view</p>
                <p className="mt-1 text-xs">Try a broader category or clear the tag filter.</p>
              </div>
            )}
          </section>
        </main>

        <aside className="shrink-0 space-y-4 lg:w-72">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">For you</p>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Curator digest</h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">New</span>
            </div>
            <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 leading-snug shadow-sm dark:bg-slate-800/70">
                <span className="text-lg">✨</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Motion-first inspiration</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">High-impact hero reels and hover microinteractions.</p>
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 leading-snug shadow-sm dark:bg-slate-800/70">
                <span className="text-lg">🎨</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Palette ideas</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Warm to cool gradients to pair with glass surfaces.</p>
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 leading-snug shadow-sm dark:bg-slate-800/70">
                <span className="text-lg">🧠</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">AI-friendly UX</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Model guardrails, clarity hints, and trust-building states.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm shadow-sm shadow-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
            <p className="font-semibold text-slate-900 dark:text-white">Build your set</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Save patterns to review later or share with your squad.</p>
            <button type="button" className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-slate-800 dark:bg-white dark:text-slate-900">
              Create moodboard
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Explore;
