"use client";

import Image from "next/image";
import type { SuggestedProfile } from "@/types/api";
import ICONS from "@/components/assets/icons";

interface SuggestedProfilesProps {
  profiles: SuggestedProfile[];
  onToggleFollow: (profileId: string) => void;
}

const SuggestedProfiles = ({ profiles, onToggleFollow }: SuggestedProfilesProps) => {
  return (
    <aside className="hidden shrink-0 space-y-4 lg:block lg:w-72">
      <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 text-xs shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70 sm:p-5 sm:text-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Suggested for you
          </h2>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            See all
          </button>
        </div>

        <div className="space-y-3">
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between gap-3 rounded-xl py-1"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-2 ring-slate-100 dark:bg-slate-700 dark:ring-slate-800">
                    <Image
                      src={ICONS.view}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
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
                  onClick={() => onToggleFollow(profile.id)}
                  className={`shrink-0 cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    profile.isFollowing
                      ? "border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-600 hover:to-orange-600"
                  }`}
                >
                  {profile.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            ))
          ) : (
            <p className="rounded-xl bg-slate-50/80 px-3 py-3 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              No suggested profiles at the moment.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 text-xs text-slate-500 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-400 sm:p-5">
        <p className="mb-2 font-semibold text-slate-600 dark:text-slate-300">
          Your space for creators
        </p>
        <p className="leading-relaxed">
          Follow pages and profiles you care about to build a personalized
          feed of design, dev, and product content.
        </p>
      </section>
    </aside>
  );
};

export default SuggestedProfiles;
