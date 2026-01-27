"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ICONS from "@/components/assets/icons";

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
      {url && <Image src={url} alt="" fill className="object-cover" />}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-600"
        aria-label="Remove image"
      >
        ×
      </button>
    </div>
  );
}

const MAX_IMAGES = 6;

interface PostComposerProps {
  composerContent: string;
  setComposerContent: (content: string) => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  currentUserAvatar: string;
  isCreatingPost: boolean;
  createError: string | null;
  onCreatePost: () => void;
}

const PostComposer = ({
  composerContent,
  setComposerContent,
  selectedFiles,
  setSelectedFiles,
  currentUserAvatar,
  isCreatingPost,
  createError,
  onCreatePost,
}: PostComposerProps) => {
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const images = files.filter((f) => f.type.startsWith("image/"));
    const remaining = MAX_IMAGES - selectedFiles.length;
    const toAdd = images.slice(0, remaining);
    setSelectedFiles([...selectedFiles, ...toAdd]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const canAddMore = selectedFiles.length < MAX_IMAGES;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="relative mt-0.5 h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-2 ring-slate-100 dark:bg-slate-700 dark:ring-slate-800">
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
        <div className="min-w-0 flex-1 space-y-3">
          <textarea
            ref={composerRef}
            value={composerContent}
            onChange={(event) => setComposerContent(event.target.value)}
            rows={2}
            placeholder="What's on your mind?"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-300 focus:bg-white focus:ring-2 focus:ring-amber-200/50 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-amber-500/50 dark:focus:ring-amber-500/20"
          />

          {/* Image preview grid */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
              {selectedFiles.map((file, i) => (
                <div key={`${file.name}-${i}`} className="relative aspect-square">
                  <FilePreview file={file} onRemove={() => removeFile(i)} />
                  {i === 0 && selectedFiles.length > 1 && (
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {selectedFiles.length} photos
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {createError && (
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {createError}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* Photo – primary action */}
              {canAddMore && (
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:border-amber-400 hover:bg-amber-50/50 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-amber-500/40 dark:hover:bg-amber-500/5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/80 text-lg dark:bg-slate-700/80">
                    📷
                  </span>
                  <span>Photo</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
              {/* Decorative / placeholder icons for UX */}
              <span
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-transparent bg-slate-50/60 px-3 py-2.5 text-xs font-medium text-slate-400 dark:bg-slate-800/40 dark:text-slate-500"
                title="Coming soon"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/60 text-lg dark:bg-slate-700/60">
                  🎬
                </span>
                <span>Video</span>
              </span>
              <span
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-transparent bg-slate-50/60 px-3 py-2.5 text-xs font-medium text-slate-400 dark:bg-slate-800/40 dark:text-slate-500"
                title="Coming soon"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/60 text-lg dark:bg-slate-700/60">
                  😊
                </span>
                <span>Feeling</span>
              </span>
              {selectedFiles.length > 0 && canAddMore && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedFiles.length}/{MAX_IMAGES} photos
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onCreatePost}
              disabled={isCreatingPost || !composerContent.trim()}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-amber-600 hover:to-orange-600 hover:shadow-lg disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none dark:disabled:from-slate-600 dark:disabled:to-slate-600 dark:disabled:text-slate-400"
            >
              {isCreatingPost ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostComposer;
