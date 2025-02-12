import { Outlet } from 'react-router-dom'
import { MenuDashBoard } from './components/menu'

export function DashboardPage() {
  return (
    <div className="flex min-h-screen ">
      <MenuDashBoard />
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}