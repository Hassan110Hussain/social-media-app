import Saved from '@/components/dashboard/Saved';
import Sidebar from '@/components/dashboard/sidebar';

export const dynamic = 'force-dynamic';

export default function DashboardSavedPage() {
  return (
    <div className="flex min-h-screen bg-slate-50/70 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Saved />
      </main>
    </div>
  );
}
