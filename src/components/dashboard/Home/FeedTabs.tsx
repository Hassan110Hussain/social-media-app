"use client";

import type { FeedFilter } from "@/types/api";

interface FeedTabsProps {
  feedFilter: FeedFilter;
  onFilterChange: (filter: FeedFilter) => void;
}

const tabs: { id: FeedFilter; label: string }[] = [
  { id: "my-feed", label: "My Feed" },
  { id: "for-you", label: "For you" },
  { id: "following", label: "Following" },
];

const FeedTabs = ({ feedFilter, onFilterChange }: FeedTabsProps) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <div
        role="tablist"
        className="inline-flex rounded-2xl bg-slate-100/80 p-1.5 shadow-inner dark:bg-slate-800/50 sm:p-1.5"
        aria-label="Feed filter"
      >
        <div className="relative flex gap-0.5 rounded-xl bg-white/60 p-0.5 shadow-sm dark:bg-slate-900/40 sm:rounded-[14px]">
          {tabs.map((tab) => {
            const isActive = feedFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show ${tab.label}`}
                onClick={() => onFilterChange(tab.id)}
                className={`relative z-0 cursor-pointer overflow-hidden rounded-[10px] px-4 py-2.5 text-sm font-medium transition-all duration-200 sm:rounded-xl sm:px-5 sm:py-2.5 ${
                  isActive
                    ? "text-amber-800 shadow-sm dark:text-amber-100"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-amber-100 to-orange-100 shadow-sm dark:from-amber-500/20 dark:to-orange-500/15 sm:rounded-xl"
                    aria-hidden
                  />
                )}
                <span className="relative z-10 block">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeedTabs;
