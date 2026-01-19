"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Board = {
  id: string;
  title: string;
  category: string;
  coverUrl: string;
  items: number;
  collaborators: number;
  updated: string;
  pinned?: boolean;
};

const initialBoards: Board[] = [
  {
    id: "board-1",
    title: "Design systems · 2026",
    category: "Design",
    coverUrl: "/placeholders/post-1.jpg",
    items: 42,
    collaborators: 6,
    updated: "2d ago",
    pinned: true,
  },
  {
    id: "board-2",
    title: "Product storytelling",
    category: "Content",
    coverUrl: "/placeholders/post-2.jpg",
    items: 27,
    collaborators: 3,
    updated: "5d ago",
  },
  {
    id: "board-3",
    title: "Fintech flows",
    category: "Product",
    coverUrl: "/placeholders/post-3.jpg",
    items: 31,
    collaborators: 4,
    updated: "1w ago",
    pinned: true,
  },
  {
    id: "board-4",
    title: "Motion & reels",
    category: "Motion",
    coverUrl: "/placeholders/post-1.jpg",
    items: 18,
    collaborators: 2,
    updated: "3d ago",
  },
  {
    id: "board-5",
    title: "Brand palettes",
    category: "Design",
    coverUrl: "/placeholders/post-2.jpg",
    items: 22,
    collaborators: 5,
    updated: "4d ago",
  },
];

const recentSaves = [
  { id: "rs-1", title: "Dashboard hover states", type: "Interaction", time: "2h ago" },
  { id: "rs-2", title: "Card carousel concept", type: "Component", time: "5h ago" },
  { id: "rs-3", title: "AI trust screen", type: "Pattern", time: "Yesterday" },
];

const filters = ["All", "Pinned", "Design", "Product", "Content", "Motion"];

const Saved = () => {
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredBoards = useMemo(() => {
    if (activeFilter === "All") return boards;
    if (activeFilter === "Pinned") return boards.filter((board) => board.pinned);
    return boards.filter((board) => board.category === activeFilter);
  }, [activeFilter, boards]);

  const togglePin = (id: string) => {
    setBoards((current) => current.map((board) => (board.id === id ? { ...board, pinned: !board.pinned } : board)));
  };

  return (
    <div className="min-h-screen px-3 py-4 text-slate-900 transition-colors dark:text-white sm:px-4 sm:py-6 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:gap-6">
        <main className="min-w-0 flex-1 space-y-4 sm:space-y-5">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Library</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Saved boards and collections</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Organize inspiration, keep teams aligned, and reopen anything fast.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                Import pin
              </button>
              <button type="button" className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-blue-500 hover:shadow-md">
                + New board
              </button>
            </div>
          </header>

          <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      active ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950" : "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
              <div className="ms-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`rounded-full px-2 py-1 transition ${view === "grid" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "hover:text-slate-900 dark:hover:text-white"}`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`rounded-full px-2 py-1 transition ${view === "list" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "hover:text-slate-900 dark:hover:text-white"}`}
                >
                  List
                </button>
              </div>
            </div>
          </section>

          {view === "grid" ? (
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBoards.map((board) => (
                <article key={board.id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm shadow-slate-200 backdrop-blur transition hover:-translate-y-[2px] hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
                  {board.pinned && <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 shadow-sm dark:bg-amber-500/20 dark:text-amber-200">Pinned</span>}
                  <div className="relative">
                    <Image src={board.coverUrl} alt={board.title} width={640} height={360} className="h-40 w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/85 dark:text-white">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      {board.items} saved
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{board.category}</p>
                        <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">{board.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Updated {board.updated}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePin(board.id)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                          board.pinned ? "bg-amber-500 text-white shadow-sm shadow-amber-400/40" : "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
                        }`}
                      >
                        {board.pinned ? "Pinned" : "Pin"}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>👥 {board.collaborators} collaborators</span>
                      <button type="button" className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                        Open board
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <section className="space-y-3">
              {filteredBoards.map((board) => (
                <article key={board.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm shadow-slate-200 backdrop-blur transition hover:-translate-y-[1px] hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
                  <div className="relative h-20 w-32 overflow-hidden rounded-xl bg-slate-900/80">
                    <Image src={board.coverUrl} alt={board.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{board.category}</p>
                    <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">{board.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Updated {board.updated} · {board.items} saved · {board.collaborators} collaborators</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {board.pinned && <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 shadow-sm dark:bg-amber-500/20 dark:text-amber-200">Pinned</span>}
                    <button
                      type="button"
                      onClick={() => togglePin(board.id)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        board.pinned ? "bg-amber-500 text-white shadow-sm shadow-amber-400/40" : "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
                      }`}
                    >
                      {board.pinned ? "Pinned" : "Pin"}
                    </button>
                    <button type="button" className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                      Open
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}

          {filteredBoards.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-4 py-10 text-center text-sm text-slate-500 shadow-sm shadow-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
              <p className="font-semibold">No boards match this view</p>
              <p className="mt-1 text-xs">Try a different filter or create a new board.</p>
            </div>
          )}
        </main>

        <aside className="shrink-0 space-y-3 lg:w-72">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent saves</h3>
            <ul className="mt-3 space-y-3 text-sm">
              {recentSaves.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 p-3 shadow-sm dark:bg-slate-800/70">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.type}</p>
                  </div>
                  <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-300">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm shadow-sm shadow-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none">
            <p className="font-semibold text-slate-900 dark:text-white">Organize faster</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Group by project, theme, or sprint. Invite collaborators to co-curate.</p>
            <button type="button" className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-slate-800 dark:bg-white dark:text-slate-900">
              Start a new board
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Saved;
