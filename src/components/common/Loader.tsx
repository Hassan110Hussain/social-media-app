type LoaderProps = {
  title?: string;
  subtitle?: string;
  /** Use for inline/smaller contexts (e.g. comments, message list) */
  compact?: boolean;
  className?: string;
};

export default function Loader({
  title = "Loading...",
  subtitle = "Almost there",
  compact = false,
  className = "",
}: LoaderProps) {
  if (compact) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 py-6 text-center shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60 ${className}`}
      >
        <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-amber-200 border-t-amber-500 dark:border-amber-900/50 dark:border-t-amber-400" />
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{title}</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 px-6 py-12 text-center shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60 ${className}`}
    >
      <div className="mb-3 h-10 w-10 animate-spin rounded-full border-2 border-amber-200 border-t-amber-500 dark:border-amber-900/50 dark:border-t-amber-400" />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
      {subtitle ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      ) : null}
    </div>
  );
}
