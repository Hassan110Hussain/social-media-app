"use client";

import { useState } from "react";
import Image from "next/image";
import type { Post, Comment } from "@/types/api";
import Loader from "@/components/common/Loader";
import ICONS from "@/components/assets/icons";

function CommentBlock({
  comment,
  postId,
  onStartReply,
  onDeleteComment,
  replyingToCommentId,
  isReply,
  currentUserId,
  isDeletingCommentId,
  ICONSMap,
}: {
  comment: Comment;
  postId: string;
  onStartReply: (postId: string, commentId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  replyingToCommentId: string | null;
  isReply: boolean;
  currentUserId: string | null;
  isDeletingCommentId: string | null;
  ICONSMap: typeof ICONS;
}) {
  const canDelete = currentUserId !== null && comment.user_id === currentUserId;
  const isDeleting = isDeletingCommentId === comment.id;
  return (
    <div className={`flex items-start gap-3 ${isReply ? "ml-8 sm:ml-10" : ""}`}>
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-200 dark:border-slate-700 dark:bg-slate-700">
        <Image
          src={comment.users.avatar_url || ICONSMap.land}
          alt={comment.users.username}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = ICONSMap.land;
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5 dark:border-slate-700/60 dark:bg-slate-800/40">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            @{comment.users.username}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {comment.content}
          </p>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
          <button
            type="button"
            onClick={() => onStartReply(postId, comment.id)}
            className="cursor-pointer text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Reply
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDeleteComment(postId, comment.id)}
              disabled={isDeleting}
              className="cursor-pointer text-xs font-medium text-red-600 underline-offset-2 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReplyInlineForm({
  postId,
  parentId,
  commentInput,
  onInputChange,
  onSubmit,
  onCancel,
  isSubmitting,
  currentUserAvatar,
  replyToUsername,
  ICONSMap,
}: {
  postId: string;
  parentId: string;
  commentInput: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  currentUserAvatar: string;
  replyToUsername: string;
  ICONSMap: typeof ICONS;
}) {
  return (
    <div className="mt-2 flex items-start gap-2 rounded-lg border border-slate-200/80 bg-slate-50/60 p-2 dark:border-slate-700/60 dark:bg-slate-800/30 sm:gap-2.5 sm:p-2.5">
      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-200 dark:border-slate-600 dark:bg-slate-700 sm:h-8 sm:w-8">
        <Image
          src={currentUserAvatar}
          alt="You"
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = ICONSMap.land;
          }}
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Replying to <span className="font-semibold text-slate-600 dark:text-slate-300">@{replyToUsername}</span>
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Cancel
          </button>
        </div>
        <textarea
          value={commentInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={`Reply to @${replyToUsername}…`}
          rows={2}
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs outline-none placeholder:text-slate-400 focus:border-slate-300 dark:border-slate-600 dark:bg-slate-900/50 dark:placeholder:text-slate-500 dark:focus:border-slate-500"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={!commentInput.trim() || isSubmitting}
          className="cursor-pointer rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-slate-100 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
        >
          {isSubmitting ? "Posting…" : "Reply"}
        </button>
      </div>
    </div>
  );
}

function CommentThread({
  comment,
  postId,
  onStartReply,
  onDeleteComment,
  replyingToCommentId,
  commentInput,
  onCommentInputChange,
  onSubmitComment,
  onCancelReply,
  isSubmittingComment,
  currentUserAvatar,
  currentUserId,
  isDeletingCommentId,
  ICONS: ICONSMap,
}: {
  comment: Comment;
  postId: string;
  onStartReply: (postId: string, commentId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  replyingToCommentId: string | null;
  commentInput: string;
  onCommentInputChange: (postId: string, value: string) => void;
  onSubmitComment: (postId: string, content: string, parentId?: string | null) => void;
  onCancelReply: () => void;
  isSubmittingComment: boolean;
  currentUserAvatar: string;
  currentUserId: string | null;
  isDeletingCommentId: string | null;
  ICONS: typeof ICONS;
}) {
  const renderReplyFormBelow = (commentId: string, username: string) => {
    if (replyingToCommentId !== commentId) return null;
    return (
      <ReplyInlineForm
        postId={postId}
        parentId={commentId}
        commentInput={commentInput}
        onInputChange={(v) => onCommentInputChange(postId, v)}
        onSubmit={() => onSubmitComment(postId, commentInput.trim(), commentId)}
        onCancel={onCancelReply}
        isSubmitting={isSubmittingComment}
        currentUserAvatar={currentUserAvatar}
        replyToUsername={username}
        ICONSMap={ICONSMap}
      />
    );
  };

  return (
    <div className="space-y-2">
      <CommentBlock
        comment={comment}
        postId={postId}
        onStartReply={onStartReply}
        onDeleteComment={onDeleteComment}
        replyingToCommentId={replyingToCommentId}
        isReply={false}
        currentUserId={currentUserId}
        isDeletingCommentId={isDeletingCommentId}
        ICONSMap={ICONSMap}
      />
      {renderReplyFormBelow(comment.id, comment.users.username)}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2 border-l-2 border-slate-200/80 pl-2 dark:border-slate-700/60 sm:pl-3">
          {comment.replies.map((reply) => (
            <div key={reply.id}>
              <CommentBlock
                comment={reply}
                postId={postId}
                onStartReply={onStartReply}
                onDeleteComment={onDeleteComment}
                replyingToCommentId={replyingToCommentId}
                isReply
                currentUserId={currentUserId}
                isDeletingCommentId={isDeletingCommentId}
                ICONSMap={ICONSMap}
              />
              {renderReplyFormBelow(reply.id, reply.users.username)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PostCardMedia({
  post,
  ICONSMap,
}: {
  post: Post;
  ICONSMap: typeof ICONS;
}) {
  const urls = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
  const [index, setIndex] = useState(0);
  const current = urls[index];

  if (urls.length === 0) return null;
  return (
    <div className="relative h-[260px] w-full bg-slate-900/90 min-[480px]:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px]">
      <Image
        src={current}
        alt={post.caption}
        fill
        className="object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = ICONSMap.solid;
        }}
      />
      {urls.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => (i === 0 ? urls.length - 1 : i - 1))}
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i === urls.length - 1 ? 0 : i + 1))}
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
            aria-label="Next image"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {urls.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 w-2 cursor-pointer rounded-full transition ${i === index ? "bg-white" : "bg-white/50 hover:bg-white/70"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface PostCardProps {
  post: Post;
  currentUserId: string | null;
  currentUserAvatar: string;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  openCommentsPostId: string | null;
  comments: Comment[];
  commentInput: string;
  isLoadingComments: boolean;
  isSubmittingComment: boolean;
  /** When set, the main input is replying to this comment */
  replyingToCommentId: string | null;
  /** ID of comment being deleted, for loading state */
  isDeletingCommentId: string | null;
  onStartReply: (postId: string, commentId: string) => void;
  onCancelReply: () => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onDelete: (post: Post) => void;
  /** When true, hide the Delete option in the three-dots menu (e.g. on Saved page) */
  hideDeleteInMenu?: boolean;
  /** When provided, shows Edit in the three-dots menu for posts you authored */
  onEdit?: (post: Post) => void;
  /** When provided, shows three-dots for every post and adds Unsave in the menu (e.g. on Saved page) */
  onUnsave?: (postId: string) => void;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onSave: (postId: string) => void;
  /** When true, Save button is disabled (e.g. on Saved page where all posts are already saved) */
  saveButtonDisabled?: boolean;
  onToggleComments: (postId: string) => void;
  onCommentInputChange: (postId: string, value: string) => void;
  onSubmitComment: (postId: string, content: string, parentId?: string | null) => void;
}

const PostCard = ({
  post,
  currentUserId,
  currentUserAvatar,
  openMenuId,
  setOpenMenuId,
  openCommentsPostId,
  comments,
  commentInput,
  isLoadingComments,
  isSubmittingComment,
  replyingToCommentId,
  isDeletingCommentId,
  onStartReply,
  onCancelReply,
  onDeleteComment,
  onDelete,
  hideDeleteInMenu = false,
  onEdit,
  onUnsave,
  onLike,
  onShare,
  onSave,
  saveButtonDisabled = false,
  onToggleComments,
  onCommentInputChange,
  onSubmitComment,
}: PostCardProps) => {
  const replyingToComment = replyingToCommentId
    ? comments.flatMap((c) => (c.replies ? [c, ...c.replies] : [c])).find((c) => c.id === replyingToCommentId)
    : null;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-700/70 dark:bg-slate-900/90">
      {/* Post header */}
      <header className="flex min-h-[72px] items-start justify-between gap-2 border-b border-slate-200/80 px-4 py-3 dark:border-slate-700/60 sm:px-5">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-200 dark:border-slate-700 dark:bg-slate-700 sm:h-10 sm:w-10">
            <Image
              src={post.avatarUrl || ICONS.land}
              alt={post.author}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = ICONS.land;
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {post.author}
              </span>
              <span
                className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  (post.postSource ?? "featured") === "authored"
                    ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/40 dark:text-violet-400"
                    : (post.postSource ?? "featured") === "following"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : (post.postSource ?? "featured") === "network"
                        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-400"
                        : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400"
                }`}
              >
                {(post.postSource ?? "featured") === "authored"
                  ? "Authored"
                  : (post.postSource ?? "featured") === "following"
                    ? "Following"
                    : (post.postSource ?? "featured") === "network"
                      ? "Network"
                      : "Featured"}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {post.handle} · {post.timeAgo}
            </p>
          </div>
        </div>
        <div className="relative shrink-0">
          {(currentUserId === post.userId || onUnsave) && (
            <>
              <button
                type="button"
                data-menu-button
                onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                className="cursor-pointer rounded-lg border border-transparent p-2 text-slate-400 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-600 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="More options"
              >
                <span className="inline-block h-1 w-1 rounded-full bg-current" />
                <span className="mx-0.5 inline-block h-1 w-1 rounded-full bg-current" />
                <span className="inline-block h-1 w-1 rounded-full bg-current" />
              </button>
              {openMenuId === post.id && (
                <div data-menu-dropdown className="absolute right-0 top-full z-10 mt-1 min-w-[120px] rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  {onUnsave && (
                    <button
                      type="button"
                      onClick={() => onUnsave(post.id)}
                      className="w-full cursor-pointer px-4 py-2 text-left text-sm font-medium text-amber-600 transition first:rounded-t-lg hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                    >
                      Unsave
                    </button>
                  )}
                  {currentUserId === post.userId && (
                    <>
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(post)}
                          className="w-full cursor-pointer px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50"
                        >
                          Edit
                        </button>
                      )}
                      {!hideDeleteInMenu && (
                        <button
                          type="button"
                          onClick={() => onDelete(post)}
                          className={`w-full cursor-pointer px-4 py-2 text-left text-sm font-medium text-red-600 transition last:rounded-b-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${!onUnsave && !onEdit ? "first:rounded-t-lg" : ""}`}
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </header>

      {/* Post media – single or carousel */}
      {(post.imageUrl || post.imageUrls?.length) ? (
        <PostCardMedia post={post} ICONSMap={ICONS} />
      ) : null}

      {/* Caption */}
      <div
        className={`border-b border-slate-200/80 px-4 py-3 dark:border-slate-700/60 sm:px-5 ${post.imageUrl || post.imageUrls?.length ? "sm:py-3" : "sm:py-4"}`}
      >
        {!post.imageUrl && !post.imageUrls?.length && (
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/40">
            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 sm:text-base">
              {post.caption}
            </p>
          </div>
        )}
        {(post.imageUrl || post.imageUrls?.length) && (
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{post.author}</span>{" "}
            {post.caption}
          </p>
        )}
      </div>

      {/* Actions bar */}
      <div className="flex flex-1 flex-col border-b border-slate-200/80 dark:border-slate-700/60">
        <div className="grid grid-cols-2 gap-px bg-slate-200/80 dark:bg-slate-700/50 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => onLike(post.id)}
            className="flex cursor-pointer items-center justify-center gap-2 bg-white py-3 transition hover:bg-slate-50 dark:bg-slate-900/90 dark:hover:bg-slate-800/60 sm:gap-2.5"
          >
            <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-base transition ${
                post.liked
                  ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-400"
                  : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400"
              }`}
            >
              {post.liked ? "♥" : "♡"}
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {post.liked ? "Liked" : "Like"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onToggleComments(post.id)}
            className="flex cursor-pointer items-center justify-center gap-2 bg-white py-3 transition hover:bg-slate-50 dark:bg-slate-900/90 dark:hover:bg-slate-800/60 sm:gap-2.5"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-base text-slate-500 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
              💬
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Comment</span>
          </button>

          <button
            type="button"
            onClick={() => currentUserId !== post.userId && onShare(post.id)}
            disabled={currentUserId === post.userId}
            aria-disabled={currentUserId === post.userId}
            title={currentUserId === post.userId ? "You can't share your own post" : undefined}
            className={`hidden items-center justify-center gap-2 py-3 sm:flex sm:gap-2.5 ${
              currentUserId === post.userId
                ? "cursor-not-allowed bg-slate-50 opacity-70 dark:bg-slate-800/50"
                : "cursor-pointer bg-white transition hover:bg-slate-50 dark:bg-slate-900/90 dark:hover:bg-slate-800/60"
            }`}
          >
            <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-base transition ${
                post.shared
                  ? "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-400"
                  : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400"
              }`}
            >
              📤
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {post.shared ? "Shared" : "Share"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => !saveButtonDisabled && onSave(post.id)}
            disabled={saveButtonDisabled}
            aria-disabled={saveButtonDisabled}
            className={`flex items-center justify-center gap-2 py-3 sm:col-start-4 sm:gap-2.5 ${
              saveButtonDisabled
                ? "cursor-not-allowed bg-slate-50 opacity-70 dark:bg-slate-800/50"
                : "cursor-pointer bg-white transition hover:bg-slate-50 dark:bg-slate-900/90 dark:hover:bg-slate-800/60"
            }`}
          >
            <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-base transition ${
                post.saved
                  ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-400"
                  : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400"
              }`}
            >
              {post.saved ? "◆" : "◇"}
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {post.saved ? "Saved" : "Save"}
            </span>
          </button>
        </div>

        {/* Engagement summary – prominent */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t-2 border-slate-200/80 bg-white px-4 py-3 dark:border-slate-700/60 dark:bg-slate-900/70 sm:px-5 sm:py-3.5">
          <p className="text-base font-semibold tabular-nums text-slate-800 dark:text-slate-100">
            {post.likes === 1 ? "1 like" : `${post.likes.toLocaleString()} likes`}
          </p>
          {post.comments > 0 && (
            <button
              type="button"
              onClick={() => onToggleComments(post.id)}
              className="text-base font-semibold text-slate-600 underline-offset-2 transition hover:text-slate-800 hover:underline dark:text-slate-300 dark:hover:text-slate-100"
            >
              View all {post.comments} {post.comments === 1 ? "comment" : "comments"}
            </button>
          )}
        </div>
      </div>

        {/* Comments section */}
        {openCommentsPostId === post.id && (
          <div className="space-y-3 border-t border-slate-200/80 px-4 py-4 dark:border-slate-700/60 sm:px-5">
            {/* New comment input – only when not replying (reply form opens below the comment) */}
            {!replyingToCommentId && (
              <div className="flex items-start gap-3">
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-200 dark:border-slate-700 dark:bg-slate-700">
                  <Image
                    src={currentUserAvatar}
                    alt="Your profile"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = ICONS.land;
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <textarea
                    value={commentInput}
                    onChange={(e) => onCommentInputChange(post.id, e.target.value)}
                    placeholder="Add a comment…"
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200/60 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-600/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSubmitComment(post.id, commentInput.trim());
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onSubmitComment(post.id, commentInput.trim())}
                    disabled={!commentInput.trim() || isSubmittingComment}
                    className="cursor-pointer rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-slate-100 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
                  >
                    {isSubmittingComment ? "Posting…" : "Post comment"}
                  </button>
                </div>
              </div>
            )}

            {/* Threaded comments list – reply form opens below the comment when you click Reply */}
            {isLoadingComments ? (
              <Loader compact title="Loading comments…" />
            ) : comments.length > 0 ? (
              <div className="max-h-[400px] space-y-2 overflow-y-auto">
                {comments.map((comment) => (
                  <CommentThread
                    key={comment.id}
                    comment={comment}
                    postId={post.id}
                    onStartReply={onStartReply}
                    onDeleteComment={onDeleteComment}
                    replyingToCommentId={replyingToCommentId}
                    commentInput={commentInput}
                    onCommentInputChange={onCommentInputChange}
                    onSubmitComment={onSubmitComment}
                    onCancelReply={onCancelReply}
                    isSubmittingComment={isSubmittingComment}
                    currentUserAvatar={currentUserAvatar}
                    currentUserId={currentUserId}
                    isDeletingCommentId={isDeletingCommentId}
                    ICONS={ICONS}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200/80 bg-slate-50/60 py-6 text-center text-sm text-slate-500 dark:border-slate-700/60 dark:bg-slate-800/30 dark:text-slate-400">
                No comments yet. Be the first to comment.
              </div>
            )}
          </div>
        )}
    </article>
  );
};

export default PostCard;
