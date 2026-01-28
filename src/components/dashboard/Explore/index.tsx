"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Post, Comment as ApiComment } from "@/types/api";
import { fetchExplorePosts, toggleLikePost, toggleSavePost, toggleSharePost, createComment, fetchComments } from "@/lib/posts";
import ScrollPaginationSentinel from "@/components/common/ScrollPagination";
import Loader from "@/components/common/Loader";
import PostDetailOverlay from "@/components/common/PostDetailOverlay";
import ICONS from "@/components/assets/icons";
import { supabase } from "@/lib/supabase";

const POSTS_PER_PAGE = 12;

// Stable per-visit shuffle seed so repeated fetches (e.g. React Strict Mode double-mount) show the same order and avoid flicker
let exploreShuffleSeed = Date.now();

function ExplorePostMedia({ post, onClick }: { post: Post; onClick?: () => void }) {
  const urls = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
  const [index, setIndex] = useState(0);
  const current = urls[index];
  if (urls.length === 0) return null;
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={(e) => { if (onClick) { e.stopPropagation(); onClick(); } }}
      onKeyDown={(e) => { if (onClick && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(); } }}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-950/60 dark:border-slate-700"
    >
      <Image
        src={current}
        alt={post.caption}
        fill
        className="object-cover transition group-hover:scale-[1.02]"
        onError={(e) => { (e.target as HTMLImageElement).src = ICONS.solid; }}
      />
      {urls.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIndex((i) => (i === 0 ? urls.length - 1 : i - 1)); }}
            className="absolute left-1.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIndex((i) => (i === urls.length - 1 ? 0 : i + 1)); }}
            className="absolute right-1.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
            aria-label="Next image"
          >
            ›
          </button>
          <div className="absolute bottom-1.5 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {urls.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
                aria-hidden
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const Explore = () => {
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [overlayPost, setOverlayPost] = useState<Post | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>(ICONS.land);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setHasMore(true);
      const explorePosts = await fetchExplorePosts(POSTS_PER_PAGE, 0, exploreShuffleSeed);
      setPosts(explorePosts);
      setHasMore(explorePosts.length === POSTS_PER_PAGE);
    } catch (err) {
      console.error("Failed to load explore posts:", err);
      setError("Unable to load posts right now. Please try again.");
      setPosts([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial posts on mount
  useEffect(() => {
    void loadPosts();
  }, []);

  // Load current user for overlay comment form
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          const { data: row } = await supabase.from("users").select("avatar_url").eq("id", user.id).maybeSingle();
          // Always update avatar, even if null (will use ICONS.land fallback)
          setCurrentUserAvatar(row?.avatar_url || ICONS.land);
        }
      } catch (e) {
        console.error("Failed to load current user:", e);
      }
    };
    void loadUser();
  }, []);

  // Refresh avatar when page becomes visible (in case it was updated in another tab)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: row } = await supabase.from("users").select("avatar_url").eq("id", user.id).maybeSingle();
            if (row?.avatar_url) {
              setCurrentUserAvatar(row.avatar_url);
            }
          }
        } catch (e) {
          console.error("Failed to refresh avatar:", e);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const [overlayComments, setOverlayComments] = useState<ApiComment[]>([]);
  const [isLoadingOverlayComments, setIsLoadingOverlayComments] = useState<boolean>(false);
  const [overlayCommentInput, setOverlayCommentInput] = useState<string>("");
  const [isSubmittingOverlayComment, setIsSubmittingOverlayComment] = useState<boolean>(false);

  const loadOverlayComments = useCallback(async (postId: string) => {
    try {
      setIsLoadingOverlayComments(true);
      const list = await fetchComments(postId);
      setOverlayComments(list);
    } catch (e) {
      console.error("Failed to load overlay comments:", e);
      setOverlayComments([]);
    } finally {
      setIsLoadingOverlayComments(false);
    }
  }, []);

  const handleOverlayCommentSubmit = async (content: string) => {
    if (!overlayPost || !content.trim() || isSubmittingOverlayComment) return;
    try {
      setIsSubmittingOverlayComment(true);
      await createComment(overlayPost.id, content.trim());
      setOverlayCommentInput("");
      const updated = await fetchComments(overlayPost.id);
      setOverlayComments(updated);
      setPosts((prev) => prev.map((p) => (p.id === overlayPost.id ? { ...p, comments: p.comments + 1 } : p)));
      setOverlayPost((p) => (p && p.id === overlayPost.id ? { ...p, comments: p.comments + 1 } : p));
    } catch (e) {
      console.error("Failed to submit comment:", e);
    } finally {
      setIsSubmittingOverlayComment(false);
    }
  };

  const handleCloseOverlay = useCallback(() => {
    setOverlayPost(null);
    setOverlayComments([]);
    setOverlayCommentInput("");
  }, []);

  const handleOverlayLike = async (postId: string) => {
    const prev = [...posts];
    setPosts((p) => p.map((x) => (x.id === postId ? { ...x, liked: !x.liked, likes: x.liked ? x.likes - 1 : x.likes + 1 } : x)));
    if (overlayPost?.id === postId) setOverlayPost((p) => (p ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : null));
    try {
      await toggleLikePost(postId);
    } catch (e) {
      console.error("Failed to toggle like:", e);
      setPosts(prev);
      setOverlayPost(prev.find((p) => p.id === postId) ?? overlayPost);
    }
  };

  const handleOverlaySave = async (postId: string) => {
    const prev = [...posts];
    setPosts((p) => p.map((x) => (x.id === postId ? { ...x, saved: !x.saved } : x)));
    if (overlayPost?.id === postId) setOverlayPost((p) => (p ? { ...p, saved: !p.saved } : null));
    try {
      await toggleSavePost(postId);
    } catch (e) {
      console.error("Failed to toggle save:", e);
      setPosts(prev);
      setOverlayPost(prev.find((p) => p.id === postId) ?? overlayPost);
    }
  };

  const handleOverlayShare = async (postId: string) => {
    const prev = [...posts];
    setPosts((p) => p.map((x) => (x.id === postId ? { ...x, shared: !x.shared, shares: x.shared ? x.shares - 1 : x.shares + 1 } : x)));
    if (overlayPost?.id === postId) setOverlayPost((p) => (p ? { ...p, shared: !p.shared, shares: p.shared ? p.shares - 1 : p.shares + 1 } : null));
    try {
      await toggleSharePost(postId);
    } catch (e) {
      console.error("Failed to toggle share:", e);
      setPosts(prev);
      setOverlayPost(prev.find((p) => p.id === postId) ?? overlayPost);
    }
  };

  // Load more posts when scrolling (same seed as initial load so order is consistent)
  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const currentOffset = posts.length;
      const newPosts = await fetchExplorePosts(POSTS_PER_PAGE, currentOffset, exploreShuffleSeed);

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return posts;
    
    const searchLower = search.toLowerCase();
    return posts.filter((post) => {
      return (
        post.caption.toLowerCase().includes(searchLower) ||
        post.author.toLowerCase().includes(searchLower) ||
        post.handle.toLowerCase().includes(searchLower)
      );
    });
  }, [posts, search]);

  const toggleLike = async (postId: string) => {
    const previousPosts = [...posts];
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

    try {
      await toggleLikePost(postId);
      // Just update the specific post instead of refetching all
      // The optimistic update is already applied
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setPosts(previousPosts);
    }
  };

  const toggleSave = async (postId: string) => {
    const previousPosts = [...posts];
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );

    try {
      await toggleSavePost(postId);
      // Just update the specific post instead of refetching all
      // The optimistic update is already applied
    } catch (error) {
      console.error("Failed to toggle save:", error);
      setPosts(previousPosts);
    }
  };


  return (
    <div
      ref={scrollRootRef}
      className="h-screen overflow-y-auto px-3 py-4 text-slate-900 transition-colors dark:text-white sm:px-4 sm:py-6 md:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:gap-6">
        <main className="min-w-0 flex-1 space-y-4 sm:space-y-5">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Discover</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Explore curated inspiration</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search UI patterns, product ideas, and motion concepts tailored for modern teams.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                exploreShuffleSeed = Date.now();
                void loadPosts();
              }}
              disabled={isLoading}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              ⟳ Refresh picks
            </button>
          </header>

          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <span className="text-lg">🔍</span>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts, users, or content..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
                {search && (
                  <button type="button" onClick={() => setSearch("")} className="cursor-pointer text-xs font-semibold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full">
                <Loader title="Loading posts..." subtitle="Almost there" />
              </div>
            ) : error ? (
              <div className="col-span-full rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-4 text-center text-xs text-rose-700 shadow-sm shadow-rose-100 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-200">
                {error}
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-10 text-center text-sm text-slate-500 shadow-sm shadow-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
                <p className="font-semibold">No posts found</p>
                <p className="mt-1 text-xs">Try adjusting your search or check back later.</p>
              </div>
            ) : (
              <>
                {filtered.map((post) => {
                  const hasMedia = post.imageUrl || (post.imageUrls?.length ?? 0) > 0;
                  return (
                  <article key={post.id} className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900/90 dark:hover:shadow-slate-900/50">
                    <div className="flex flex-col">
                      {/* Header: author + save */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2.5 dark:border-slate-800/80 sm:px-4">
                        <div className="flex min-w-0 flex-1 items-center gap-2.5">
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <Image
                              src={post.avatarUrl || ICONS.land}
                              alt={post.author}
                              fill
                              className="object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = ICONS.land; }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{post.author}</p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{post.handle} · {post.timeAgo}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleSave(post.id); }}
                          className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            post.saved ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {post.saved ? "Saved" : "Save"}
                        </button>
                      </div>

                      {/* Media or caption – clickable to open overlay (div to avoid nesting buttons; ExplorePostMedia has prev/next buttons) */}
                      <div
                        role="button"
                        tabIndex={0}
                        className="w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-slate-500"
                        onClick={() => setOverlayPost(post)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setOverlayPost(post);
                          }
                        }}
                      >
                        {hasMedia ? (
                          <ExplorePostMedia post={post} />
                        ) : (
                          <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-800/80 sm:px-4">
                            <p className="line-clamp-4 text-sm text-slate-700 dark:text-slate-300">{post.caption}</p>
                          </div>
                        )}
                        {hasMedia && (
                          <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800/80 sm:px-4">
                            <p className="line-clamp-2 text-sm text-slate-700 dark:text-slate-300">{post.caption}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions – do not open overlay */}
                      <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                          className={`flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${
                            post.liked ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                          }`}
                        >
                          {post.liked ? "♥" : "♡"} {post.likes.toLocaleString()}
                        </button>
                        <span className="text-xs text-slate-500 dark:text-slate-400">💬 {post.comments}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">📤 {post.shares}</span>
                        <button
                          type="button"
                          className="ml-auto cursor-pointer rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                          onClick={(e) => { e.stopPropagation(); setOverlayPost(post); }}
                        >
                          View post
                        </button>
                      </div>
                  </div>
                </article>
                  );
                })}
                {!search.trim() && (
                  <div className="col-span-full">
                    <ScrollPaginationSentinel
                      onLoadMore={loadMorePosts}
                      hasMore={hasMore}
                      isLoading={isLoadingMore}
                      root={scrollRootRef.current}
                    />
                  </div>
                )}
              </>
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

      <PostDetailOverlay
        post={overlayPost}
        onClose={handleCloseOverlay}
        comments={overlayComments}
        isLoadingComments={isLoadingOverlayComments}
        onOpen={loadOverlayComments}
        currentUserAvatar={currentUserAvatar}
        currentUserId={currentUserId}
        commentInput={overlayCommentInput}
        onCommentInputChange={setOverlayCommentInput}
        onSubmitComment={handleOverlayCommentSubmit}
        isSubmittingComment={isSubmittingOverlayComment}
        onLike={handleOverlayLike}
        onShare={handleOverlayShare}
        onSave={handleOverlaySave}
      />
    </div>
  );
};

export default Explore;
