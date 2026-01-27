"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Post } from "@/types/api";
import ICONS from "@/components/assets/icons";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onSave: (postId: string, content: string, imageUrl?: string | null) => Promise<void>;
  /** Called when user picks a new image; returns the uploaded public URL */
  uploadImage?: (file: File) => Promise<string>;
}

const EditPostModal = ({ isOpen, onClose, post, onSave, uploadImage }: EditPostModalProps) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && post) {
      setContent(post.caption);
      setImageUrl(post.imageUrl || null);
      setRemoveImage(false);
      setNewFile(null);
      setError(null);
    }
  }, [isOpen, post]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (newFile) {
      const url = URL.createObjectURL(newFile);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setObjectUrl(null);
    return undefined;
  }, [newFile]);

  const displayPreview = objectUrl ?? (removeImage ? null : imageUrl ?? null);

  const handleSave = async () => {
    if (!post || !content.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      let finalImageUrl: string | null | undefined = undefined;
      if (removeImage) {
        finalImageUrl = null;
      } else if (newFile && uploadImage) {
        finalImageUrl = await uploadImage(newFile);
      } else if (!newFile && !removeImage) {
        finalImageUrl = undefined; // keep current
      }
      await onSave(post.id, content.trim(), finalImageUrl);
      onClose();
    } catch (err) {
      console.error("Edit post error:", err);
      setError(err instanceof Error ? err.message : "Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      setRemoveImage(false);
    }
    e.target.value = "";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-post-title"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="edit-post-title" className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
          Edit post
        </h2>

        {/* Image preview / replace / remove */}
        <div className="mb-4 space-y-2">
          {displayPreview ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
              <Image
                src={displayPreview}
                alt="Post"
                fill
                className="object-contain"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.src = ICONS.solid;
                }}
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                {uploadImage && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="cursor-pointer rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow transition hover:bg-white disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      Change photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRemoveImage(true);
                        setNewFile(null);
                      }}
                      disabled={isLoading}
                      className="cursor-pointer rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-medium text-red-600 shadow transition hover:bg-white disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      Remove photo
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : uploadImage && !removeImage ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-amber-400 hover:bg-amber-50/30 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-amber-500 dark:hover:bg-amber-500/10"
            >
              <span className="text-2xl">🖼️</span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Add photo
              </span>
            </button>
          ) : uploadImage && removeImage ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400"
            >
              <span className="text-2xl">📷</span>
              <span className="text-xs font-medium">Photo removed. Add again?</span>
            </button>
          ) : null}
          {uploadImage && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              aria-hidden
            />
          )}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          className="mb-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200/60 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-600/40"
          disabled={isLoading}
          autoFocus
        />
        {error && (
          <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !content.trim()}
            className="flex-1 cursor-pointer rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {isLoading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
