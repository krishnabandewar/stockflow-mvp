import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useInventoryStore } from '../store/inventoryStore'
import { LayoutDashboard, Package, Settings, LogOut } from 'lucide-react'

export default function Layout({ children }) {
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const location = useLocation()
  
  const fetchProducts = useInventoryStore(state => state.fetchProducts)
  const fetchOrganization = useInventoryStore(state => state.fetchOrganization)

  // Fetch initial data on layout mount
  useEffect(() => {
    fetchProducts()
    fetchOrganization()
  }, [fetchProducts, fetchOrganization])

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="h-16 flex items-center px-6 shadow-sm border-b border-white/5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <LogOut className="w-5 h-5 hidden" />
              <span className="font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">StockFlow</h1>
          </div>
        </div>
        
        <div className="px-6 py-5 border-b border-white/5 bg-white/5">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1.5">Active Workspace</p>
          <p className="text-sm font-semibold text-white truncate">{user?.organizationName}</p>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
          <h2 className="text-lg font-medium text-slate-800">
            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
          </h2>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
