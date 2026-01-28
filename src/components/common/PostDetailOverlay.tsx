"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Post, Comment } from "@/types/api";
import ICONS from "@/components/assets/icons";
import Loader from "@/components/common/Loader";

type PostDetailOverlayProps = {
  post: Post | null;
  onClose: () => void;
  /** Comments for this post (parent loads when post opens) */
  comments?: Comment[];
  isLoadingComments?: boolean;
  currentUserAvatar?: string;
  currentUserId?: string | null;
  commentInput?: string;
  onCommentInputChange?: (value: string) => void;
  onSubmitComment?: (content: string) => void;
  isSubmittingComment?: boolean;
  onLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
  /** Called when overlay opens with a post so parent can load comments */
  onOpen?: (postId: string) => void;
};

function ImageCarousel({
  post,
  className = "relative aspect-[4/3] w-full bg-slate-900/90 sm:aspect-video",
}: {
  post: Post;
  className?: string;
}) {
  const urls = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
  const [index, setIndex] = useState(0);
  const current = urls[index];

  useEffect(() => {
    setIndex(0);
  }, [post.id]);

  if (urls.length === 0) return null;
  return (
    <div className={className}>
      <Image
        src={current}
        alt={post.caption}
        fill
        className="object-contain"
        onError={(e) => {
          const t = e.target as HTMLImageElement;
          t.src = ICONS.solid;
        }}
      />
      {urls.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i === 0 ? urls.length - 1 : i - 1));
            }}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-xl text-white transition hover:bg-black/70"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i === urls.length - 1 ? 0 : i + 1));
            }}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-xl text-white transition hover:bg-black/70"
            aria-label="Next image"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {urls.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-2.5 w-2.5 cursor-pointer rounded-full transition ${i === index ? "bg-white" : "bg-white/50 hover:bg-white/70"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PostDetailOverlay({
  post,
  onClose,
  comments = [],
  isLoadingComments = false,
  currentUserAvatar = ICONS.land,
  currentUserId = null,
  commentInput = "",
  onCommentInputChange,
  onSubmitComment,
  isSubmittingComment = false,
  onLike,
  onShare,
  onSave,
  onOpen,
}: PostDetailOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (post?.id && onOpen) onOpen(post.id);
  }, [post?.id, onOpen]);

  if (!post || !mounted) return null;

  const hasImages = post.imageUrl || (post.imageUrls?.length ?? 0) > 0;
  const isOwnPost = !!(currentUserId && post.userId && currentUserId === post.userId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Post detail"
    >
      <div
        className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex max-h-[90vh] flex-col overflow-y-auto">
          {/* Header: close + author — z-20 and solid bg so it stays above carousel arrows when scrolling */}
          <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <Image
                  src={post.avatarUrl || ICONS.land}
                  alt={post.author}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ICONS.land;
                  }}
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{post.author}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{post.handle} · {post.timeAgo}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Media carousel */}
          {hasImages && (
            <div className="relative w-full shrink-0">
              <ImageCarousel post={post} className="relative h-[280px] w-full bg-slate-900/90 sm:h-[360px]" />
            </div>
          )}

          {/* Caption */}
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-5">
            {!hasImages && (
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">{post.author}</span> {post.caption}
              </p>
            )}
            {hasImages && (
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">{post.author}</span> {post.caption}
              </p>
            )}
          </div>

          {/* Stats: likes, comments, shares — grid layout so row doesn’t break on small screens */}
          <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 px-4 py-3 text-sm dark:border-slate-700 sm:px-5">
            <div className="flex min-w-0 items-center gap-x-2">
              <span className="shrink-0 text-slate-600 dark:text-slate-400">♥</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{post.likes} likes</span>
              {!isOwnPost && typeof onLike === "function" && (
                <button
                  type="button"
                  onClick={() => onLike(post.id)}
                  className="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                >
                  {post.liked ? "Unlike" : "Like"}
                </button>
              )}
            </div>
            <div className="flex min-w-0 items-center gap-x-2">
              <span className="shrink-0 text-slate-600 dark:text-slate-400">💬</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{post.comments} comments</span>
            </div>
            <div className="flex min-w-0 items-center gap-x-2">
              <span className="shrink-0 text-slate-600 dark:text-slate-400">📤</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{post.shares} shares</span>
              {!isOwnPost && typeof onShare === "function" && (
                <button
                  type="button"
                  onClick={() => onShare(post.id)}
                  title="Share"
                  className="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
                >
                  {post.shared ? "Unshare" : "Share"}
                </button>
              )}
            </div>
            {!isOwnPost && typeof onSave === "function" && (
              <button
                type="button"
                onClick={() => onSave(post.id)}
                className="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
              >
                {post.saved ? "Unsave" : "Save"}
              </button>
            )}
          </div>

          {/* Comments */}
          <div className="flex-1 px-4 py-3 sm:px-5">
            <h4 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">Comments</h4>
            {isLoadingComments ? (
              <Loader compact title="Loading comments…" className="py-6" />
            ) : comments.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">No comments yet.</p>
            ) : (
              <ul className="space-y-3 max-h-[240px] overflow-y-auto">
                {comments.map((c) => (
                  <li key={c.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <Image
                          src={c.users.avatar_url || ICONS.land}
                          alt={c.users.username}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = ICONS.land;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">@{c.users.username}</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{c.content}</p>
                      </div>
                    </div>
                    {c.replies && c.replies.length > 0 && (
                      <ul className="ml-11 space-y-2 border-l-2 border-slate-200 pl-3 dark:border-slate-700">
                        {c.replies.map((reply) => (
                          <li key={reply.id} className="flex items-start gap-2">
                            <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                              <Image
                                src={reply.users.avatar_url || ICONS.land}
                                alt={reply.users.username}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = ICONS.land;
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">@{reply.users.username}</p>
                              <p className="text-sm text-slate-700 dark:text-slate-300">{reply.content}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {onSubmitComment && onCommentInputChange && (
              <div className="mt-4 flex items-end gap-2">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <Image src={currentUserAvatar} alt="You" fill className="object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ICONS.land; }} />
                </div>
                <div className="min-w-0 flex-1">
                  <textarea
                    value={commentInput}
                    onChange={(e) => onCommentInputChange(e.target.value)}
                    placeholder="Add a comment…"
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const v = commentInput.trim();
                        if (v && onSubmitComment) onSubmitComment(v);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const v = commentInput.trim();
                      if (v && onSubmitComment) onSubmitComment(v);
                    }}
                    disabled={!commentInput.trim() || isSubmittingComment}
                    className="mt-2 cursor-pointer rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-200 dark:text-slate-800"
                  >
                    {isSubmittingComment ? "Posting…" : "Post"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
