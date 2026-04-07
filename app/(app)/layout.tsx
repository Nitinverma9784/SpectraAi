import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { AIPanel } from '@/components/layout/AIPanel'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[--bg-base] text-[--text-primary]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto outline-none relative">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
      <AIPanel />
    </div>
  )
}
