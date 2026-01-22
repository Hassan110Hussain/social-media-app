"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { FeedFilter, Post, SuggestedProfile } from "@/types/api";
import { mockPosts, suggestedProfiles } from "@/data/dummyData";
import ICONS from "@/components/assets/icons";
import { createPost, fetchFeedPosts, uploadPostImage } from "@/lib/posts";

const Home = () => {
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("for-you");
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<SuggestedProfile[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [composerContent, setComposerContent] = useState<string>("");
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setProfiles(suggestedProfiles);
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoadingPosts(true);
        setPostsError(null);

        const feedPosts = await fetchFeedPosts();

        // Fallback to mock posts if backend returns nothing
        setPosts(feedPosts.length > 0 ? feedPosts : mockPosts);
      } catch (error) {
        console.error("Failed to load posts:", error);
        setPostsError("Unable to load posts right now. Please try again.");
        setPosts(mockPosts);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    void loadPosts();
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

  const handleCreatePost = async () => {
    const trimmed = composerContent.trim();
    if (!trimmed || isCreatingPost) return;

    try {
      setIsCreatingPost(true);
      setCreateError(null);

      let imageUrl: string | null = null;

      if (selectedFile) {
        imageUrl = await uploadPostImage(selectedFile);
      }

      await createPost({ content: trimmed, imageUrl });

      // Refresh feed so the new post appears at the top
      const updatedPosts = await fetchFeedPosts();
      setPosts(updatedPosts.length > 0 ? updatedPosts : mockPosts);

      setComposerContent("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to create post:", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Could not publish your post. Please try again.";

      if (
        message.includes("posts_user_id_fkey") ||
        message.toLowerCase().includes("foreign key")
      ) {
        setCreateError(
          "Your account profile isn’t fully set up in the database yet (FK constraint). Please sign out/in and try again."
        );
      } else if (message.toLowerCase().includes("not authenticated")) {
        setCreateError("You need to be signed in to post.");
      } else {
        setCreateError(message);
      }
    } finally {
      setIsCreatingPost(false);
    }
  };

  return (
    <div className="min-h-screen px-3 py-4 text-slate-900 transition-colors dark:text-white sm:px-4 sm:py-5 md:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-7xl gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Main feed */}
        <main className="min-w-0 flex-1 space-y-3 sm:space-y-4">
          {/* Composer */}
          <section className="rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none sm:rounded-2xl sm:p-4">
            <div className="flex items-start gap-3">
              <div className="relative mt-1 h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-800">
                <Image
                  src={ICONS.solid}
                  alt="Your profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <textarea
                  ref={composerRef}
                  value={composerContent}
                  onChange={(event) => setComposerContent(event.target.value)}
                  rows={2}
                  placeholder="What&apos;s on your mind?"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                />

                {createError && (
                  <p className="text-xs font-medium text-rose-500">
                    {createError}
                  </p>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-900">
                      <span>📷</span>
                      <span>Attach image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          setSelectedFile(file ?? null);
                        }}
                      />
                    </label>
                    {selectedFile && (
                      <span className="truncate max-w-[160px] text-[11px] text-slate-500 dark:text-slate-400">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleCreatePost}
                    disabled={isCreatingPost || !composerContent.trim()}
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-sm transition hover:bg-blue-500 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
                  >
                    {isCreatingPost ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
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
          </div>

          {/* Posts feed - single column */}
          <section className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            {isLoadingPosts && (
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-6 text-center text-sm text-slate-500 shadow-sm shadow-slate-200 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
                Loading your feed...
              </div>
            )}

            {postsError && !isLoadingPosts && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-4 text-center text-xs text-rose-700 shadow-sm shadow-rose-100 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-200">
                {postsError}
              </div>
            )}

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
                        src={ICONS.solid}
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
                <div className="relative w-full h-[500px] bg-slate-900/90">
                  <Image
                    src={ICONS.land}
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
                        src={ICONS.solid}
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
