"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";

import type { FeedFilter, Post, SuggestedProfile } from "@/types/api";
import { mockPosts, suggestedProfiles } from "@/data/dummyData";

const Home = () => {
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("for-you");
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<SuggestedProfile[]>([]);
  const storiesRef = useRef<HTMLDivElement>(null);
  const [storyIndex, setStoryIndex] = useState(0);

  useEffect(() => {
    setPosts(mockPosts);
    setProfiles(suggestedProfiles);
  }, []);

  const visiblePosts = useMemo(() => {
    if (feedFilter === "following") {
      return posts.filter((post) => post.following);
    }
    return posts;
  }, [feedFilter, posts]);

  const toggleLike = (postId: string) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const toggleFollowProfile = (profileId: string) => {
    setProfiles((current) =>
      current.map((profile) =>
        profile.id === profileId
          ? { ...profile, isFollowing: !profile.isFollowing }
          : profile
      )
    );
  };

  const scrollStories = (direction: "left" | "right") => {
    if (!storiesRef.current) return;
    const container = storiesRef.current;
    const scrollAmount = 200;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  const handleStoriesScroll = () => {
    if (!storiesRef.current) return;
    const container = storiesRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = 80; // Approximate width of each story item
    const newIndex = Math.round(scrollLeft / itemWidth);
    setStoryIndex(newIndex);
  };

  const canScrollLeft = storyIndex > 0;
  const canScrollRight = storyIndex < 7; // 8 stories total (0-7)

  return (
    <div className="min-h-screen px-3 py-4 text-slate-900 transition-colors dark:text-white sm:px-4 sm:py-5 md:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-7xl gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Main feed */}
        <main className="min-w-0 flex-1 space-y-3 sm:space-y-4">
          {/* Stories slider */}
          <section className="relative rounded-xl border border-slate-200 bg-white/80 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:rounded-2xl">
            <div className="relative flex items-center">
              {/* Left arrow */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollStories("left")}
                  className="absolute left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 sm:h-10 sm:w-10"
                  aria-label="Scroll stories left"
                >
                  <svg
                    className="h-5 w-5 text-slate-700 dark:text-slate-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {/* Stories container */}
              <div
                ref={storiesRef}
                onScroll={handleStoriesScroll}
                className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-3 scroll-smooth sm:gap-3 sm:px-4 sm:py-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {[...Array(8)].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className="flex shrink-0 flex-col items-center gap-1 w-16 sm:w-20 transition-transform hover:scale-105"
                  >
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-amber-400 p-[2px] sm:h-14 sm:w-14">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900/95 dark:bg-slate-900">
                          <span className="text-xs font-semibold text-white">
                            {index === 0 ? "You" : `Acc ${index}`}
                          </span>
                        </div>
                      </div>
                      {index === 0 && (
                        <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow ring-2 ring-slate-900 dark:ring-slate-950 sm:h-5 sm:w-5 sm:text-xs">
                          +
                        </span>
                      )}
                    </div>
                    <span className="truncate text-xs text-slate-600 dark:text-slate-400">
                      {index === 0 ? "Your story" : "View story"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right arrow */}
              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scrollStories("right")}
                  className="absolute right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 sm:h-10 sm:w-10"
                  aria-label="Scroll stories right"
                >
                  <svg
                    className="h-5 w-5 text-slate-700 dark:text-slate-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Scroll indicators */}
            <div className="flex justify-center gap-1 pb-2">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all ${
                    Math.abs(storyIndex - index) <= 1
                      ? "w-2 bg-slate-400 dark:bg-slate-500"
                      : "w-1 bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </section>

          {/* Feed controls */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="inline-flex rounded-full border border-slate-200 bg-white/80 p-1 text-xs shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:text-sm">
              <button
                type="button"
                onClick={() => setFeedFilter("for-you")}
                className={`rounded-full px-3 py-1.5 font-medium transition ${
                  feedFilter === "for-you"
                    ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                For you
              </button>
              <button
                type="button"
                onClick={() => setFeedFilter("following")}
                className={`rounded-full px-3 py-1.5 font-medium transition ${
                  feedFilter === "following"
                    ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Following
              </button>
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold tracking-wide text-white shadow-sm transition hover:bg-blue-500 hover:shadow-md sm:w-auto sm:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              New post
            </button>
          </div>

          {/* Posts feed - Pinterest style grid */}
          <section className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6">
            {visiblePosts.map((post) => (
              <article
                key={post.id}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/90 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none sm:rounded-2xl"
              >
                {/* Post header */}
                <header className="flex items-start justify-between gap-2 px-4 py-3 sm:px-5 min-h-[72px]">
                  <div className="flex min-w-0 items-start gap-3 flex-1">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-800 sm:h-10 sm:w-10">
                      <Image
                        src={post.avatarUrl}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="space-y-1">
                        <div>
                          <span className="block truncate text-sm font-semibold leading-tight">
                            {post.author}
                          </span>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {post.handle} · {post.timeAgo}
                          </p>
                        </div>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            post.following
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {post.following ? "Following" : "Suggested"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100 shrink-0"
                    aria-label="More options"
                  >
                    <span className="inline-block h-1 w-1 rounded-full bg-current" />
                    <span className="mx-0.5 inline-block h-1 w-1 rounded-full bg-current" />
                    <span className="inline-block h-1 w-1 rounded-full bg-current" />
                  </button>
                </header>

                {/* Post media */}
                <div className="relative aspect-4/5 w-full bg-slate-900/90">
                  <Image
                    src={post.imageUrl}
                    alt={post.caption}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Post actions */}
                <div className="flex flex-1 flex-col justify-between space-y-2 px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className="group inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold transition hover:bg-rose-500/10"
                      >
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-lg transition ${
                            post.liked
                              ? "bg-rose-500 text-white shadow-sm shadow-rose-400/40"
                              : "bg-slate-100 text-slate-600 group-hover:bg-rose-500 group-hover:text-white dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {post.liked ? "♥" : "♡"}
                        </span>
                        <span className="text-xs text-slate-700 dark:text-slate-200">
                          {post.liked ? "Liked" : "Like"}
                        </span>
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                      >
                        💬
                        <span className="hidden sm:inline">Comment</span>
                      </button>

                      <button
                        type="button"
                        className="hidden items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 sm:inline-flex"
                      >
                        📤
                        <span>Share</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="rounded-full px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                      Save
                    </button>
                  </div>

                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="font-semibold text-slate-900 dark:text-slate-50">
                      {post.likes.toLocaleString()} likes
                    </p>
                    <p className="line-clamp-2 text-slate-700 dark:text-slate-200">
                      <span className="font-semibold">{post.author}</span>{" "}
                      {post.caption}
                    </p>
                    <button
                      type="button"
                      className="text-xs font-medium text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      View all {post.comments} comments
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {visiblePosts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-4 py-10 text-center text-sm text-slate-500 shadow-sm shadow-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
                <p className="font-medium">No posts yet in this view</p>
                <p className="mt-1 text-xs">
                  Start following more pages and creators to see their latest
                  posts here.
                </p>
              </div>
            )}
          </section>
        </main>

        {/* Right sidebar */}
        <aside className="hidden shrink-0 space-y-3 lg:block lg:w-72">
          <section className="rounded-xl border border-slate-200 bg-white/90 p-3 text-xs shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none sm:rounded-2xl sm:p-4 sm:text-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Suggested for you
              </h2>
              <button
                type="button"
                className="text-xs font-semibold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
              >
                See all
              </button>
            </div>

            <div className="space-y-3">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-800">
                      <Image
                        src={profile.avatarUrl}
                        alt={profile.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {profile.name}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {profile.handle}
                      </p>
                      <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                        {profile.reason}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFollowProfile(profile.id)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                      profile.isFollowing
                        ? "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        : "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
                    }`}
                  >
                    {profile.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white/90 p-3 text-xs text-slate-400 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-500 dark:shadow-none sm:rounded-2xl sm:p-4">
            <p className="mb-2 font-semibold text-slate-500 dark:text-slate-400">
              Your space for creators
            </p>
            <p>
              Follow pages and profiles you care about to build a personalized
              feed of design, dev, and product content.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Home;
