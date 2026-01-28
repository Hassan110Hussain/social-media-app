"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Post, Comment } from "@/types/api";
import Loader from "@/components/common/Loader";
import ICONS from "@/components/assets/icons";
import {
  fetchSavedPosts,
  toggleSavePost,
  toggleLikePost,
  toggleSharePost,
  createComment,
  fetchComments,
  deleteComment,
} from "@/lib/posts";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/dashboard/Home/PostCard";
import ScrollPaginationSentinel from "@/components/common/ScrollPagination";

const POSTS_PER_PAGE = 12;

const Saved = () => {
  const pathname = usePathname();
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>(ICONS.land);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isLoadingComments, setIsLoadingComments] = useState<Record<string, boolean>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});
  const [replyingTo, setReplyingTo] = useState<{ postId: string; commentId: string } | null>(null);
  const [isDeletingCommentId, setIsDeletingCommentId] = useState<string | null>(null);

  const loadSavedPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setHasMore(true);
      const posts = await fetchSavedPosts(POSTS_PER_PAGE, 0);
      setSavedPosts(posts);
      setHasMore(posts.length === POSTS_PER_PAGE);
    } catch (err) {
      console.error("Failed to load saved posts:", err);
      setError("Unable to load saved posts right now. Please try again.");
      setSavedPosts([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load more posts when scrolling
  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const currentOffset = savedPosts.length;
      const newPosts = await fetchSavedPosts(POSTS_PER_PAGE, currentOffset);

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setSavedPosts((prev) => [...prev, ...newPosts]);
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Load saved posts on mount and when page is focused (so data stays in sync with Home/Explore)
  useEffect(() => {
    void loadSavedPosts();
  }, [loadSavedPosts]);

  useEffect(() => {
    if (typeof document === "undefined" || !pathname?.includes("saved")) return;
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void loadSavedPosts();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [pathname, loadSavedPosts]);

  // Load current user for comments and delete
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          const { data: profile } = await supabase
            .from("users")
            .select("avatar_url")
            .eq("id", user.id)
            .maybeSingle();
          if (profile?.avatar_url) setCurrentUserAvatar(profile.avatar_url);
        }
      } catch (e) {
        console.error("Failed to load current user:", e);
      }
    };
    void loadUser();
  }, []);

  const toggleLike = async (postId: string) => {
    const previous = [...savedPosts];
    setSavedPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
    try {
      await toggleLikePost(postId);
      // Optimistic update is already applied, no need to refetch all
    } catch (e) {
      console.error("Failed to toggle like:", e);
      setSavedPosts(previous);
    }
  };

  const toggleShare = async (postId: string) => {
    const previous = [...savedPosts];
    setSavedPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, shared: !p.shared, shares: p.shared ? p.shares - 1 : p.shares + 1 }
          : p
      )
    );
    try {
      await toggleSharePost(postId);
      // Optimistic update is already applied, no need to refetch all
    } catch (e) {
      console.error("Failed to toggle share:", e);
      setSavedPosts(previous);
    }
  };

  const toggleSave = async (postId: string) => {
    const previous = [...savedPosts];
    setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      await toggleSavePost(postId);
      // Post is removed from saved list, no need to refetch
    } catch (e) {
      console.error("Failed to unsave:", e);
      setSavedPosts(previous);
    }
  };

  const toggleComments = async (postId: string) => {
    if (openCommentsPostId === postId) {
      setOpenCommentsPostId(null);
    } else {
      setOpenCommentsPostId(postId);
      if (!comments[postId]) {
        try {
          setIsLoadingComments((prev) => ({ ...prev, [postId]: true }));
          const postComments = await fetchComments(postId);
          setComments((prev) => ({ ...prev, [postId]: postComments }));
        } catch (e) {
          console.error("Failed to load comments:", e);
        } finally {
          setIsLoadingComments((prev) => ({ ...prev, [postId]: false }));
        }
      }
    }
  };

  const handleSubmitComment = async (
    postId: string,
    content: string,
    parentId?: string | null
  ) => {
    const trimmed = content.trim();
    if (!trimmed || isSubmittingComment[postId]) return;
    try {
      setIsSubmittingComment((prev) => ({ ...prev, [postId]: true }));
      await createComment(postId, trimmed, parentId ?? undefined);
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setReplyingTo((prev) => (prev?.postId === postId ? null : prev));
      const updatedComments = await fetchComments(postId);
      setComments((prev) => ({ ...prev, [postId]: updatedComments }));
      setSavedPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p))
      );
    } catch (e) {
      console.error("Failed to submit comment:", e);
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      setIsDeletingCommentId(commentId);
      await deleteComment(commentId);
      const updatedComments = await fetchComments(postId);
      setComments((prev) => ({ ...prev, [postId]: updatedComments }));
      setSavedPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: Math.max(0, p.comments - 1) } : p
        )
      );
    } catch (e) {
      console.error("Failed to delete comment:", e);
    } finally {
      setIsDeletingCommentId(null);
    }
  };

  const handleStartReply = (postId: string, commentId: string) => {
    setReplyingTo({ postId, commentId });
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const noopDelete = () => {}; // Saved page does not support deleting the post itself from this view

  const handleUnsave = async (postId: string) => {
    try {
      await toggleSavePost(postId);
      setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
      setOpenMenuId(null);
    } catch (e) {
      console.error("Failed to unsave:", e);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        openMenuId &&
        !target.closest("[data-menu-button]") &&
        !target.closest("[data-menu-dropdown]")
      ) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white px-3 py-4 text-slate-900 transition-colors dark:from-slate-950/50 dark:to-slate-900/80 dark:text-white sm:px-4 sm:py-5 md:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-5">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Library</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Saved Posts</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">All posts you&apos;ve saved for later.</p>
          </div>
        </header>

        {isLoading ? (
          <Loader title="Loading saved posts..." subtitle="Almost there" />
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-4 text-center text-xs text-rose-700 shadow-sm shadow-rose-100 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-4 py-10 text-center text-sm text-slate-500 shadow-sm shadow-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
            <p className="font-medium">No saved posts yet</p>
            <p className="mt-1 text-xs">Start saving posts you want to revisit later.</p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
              {savedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUserId}
                  currentUserAvatar={currentUserAvatar}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  openCommentsPostId={openCommentsPostId}
                  comments={comments[post.id] || []}
                  commentInput={commentInputs[post.id] || ""}
                  isLoadingComments={isLoadingComments[post.id] || false}
                  isSubmittingComment={isSubmittingComment[post.id] || false}
                  replyingToCommentId={replyingTo?.postId === post.id ? replyingTo.commentId : null}
                  isDeletingCommentId={isDeletingCommentId}
                  onStartReply={handleStartReply}
                  onCancelReply={handleCancelReply}
                  onDeleteComment={handleDeleteComment}
                  onDelete={noopDelete}
                  hideDeleteInMenu
                  onUnsave={handleUnsave}
                  onLike={toggleLike}
                  onShare={toggleShare}
                  onSave={toggleSave}
                  saveButtonDisabled
                  onToggleComments={toggleComments}
                  onCommentInputChange={handleCommentInputChange}
                  onSubmitComment={handleSubmitComment}
                />
              ))}
            </section>
            <ScrollPaginationSentinel
              onLoadMore={loadMorePosts}
              hasMore={hasMore}
              isLoading={isLoadingMore}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Saved;
