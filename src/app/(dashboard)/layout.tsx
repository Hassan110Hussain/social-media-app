import Sidebar from "@/components/dashboard/sidebar";
import MobileBottomNav from "@/components/dashboard/sidebar/MobileBottomNav";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen bg-slate-50/70 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-20 lg:pb-0">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
