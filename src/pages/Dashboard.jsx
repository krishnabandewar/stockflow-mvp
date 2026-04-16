import { useInventoryStore } from '../store/inventoryStore'
import { Package, AlertTriangle, BarChart3 } from 'lucide-react'

export default function Dashboard() {
  const getOrgProducts = useInventoryStore(state => state.getOrgProducts)
  const globalThreshold = useInventoryStore(state => state.globalLowStockThreshold)
  
  const products = getOrgProducts()
  
  const totalProducts = products.length
  const totalQuantity = products.reduce((acc, p) => acc + (parseInt(p.quantity) || 0), 0)
  
  const lowStockItems = products.filter(p => {
    const threshold = p.lowStockThreshold !== '' && p.lowStockThreshold != null ? parseInt(p.lowStockThreshold) : globalThreshold
    return parseInt(p.quantity) <= threshold
  })

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-white/10 flex items-center transition-all hover:shadow-[0_0_20px_-5px_rgba(52,211,153,0.15)] hover:border-emerald-500/30 group">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl mr-5 ring-1 ring-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
            <Package strokeWidth={2.5} size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
            <p className="text-3xl font-extrabold text-white mt-1">{totalProducts}</p>
          </div>
        </div>
        
        <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-white/10 flex items-center transition-all hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.15)] hover:border-sky-500/30 group">
          <div className="p-3.5 bg-sky-500/10 text-sky-400 rounded-xl mr-5 ring-1 ring-sky-500/20 group-hover:bg-sky-500/20 transition-colors">
            <BarChart3 strokeWidth={2.5} size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Units</p>
            <p className="text-3xl font-extrabold text-white mt-1">{totalQuantity}</p>
          </div>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className="bg-slate-900 rounded-xl shadow-sm border border-rose-500/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none"></div>
        <div className="px-6 py-4 bg-rose-500/10 border-b border-rose-500/20 flex items-center relative">
          <AlertTriangle className="w-5 h-5 text-rose-400 mr-2.5" strokeWidth={2.5} />
          <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider shadow-sm">Critical Inventory (Low Stock)</h3>
        </div>
        
        {lowStockItems.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm relative">
            No items are currently low on stock. All positions secure.
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Threshold</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900 divide-y divide-white/5">
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-rose-400">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {item.lowStockThreshold !== '' && item.lowStockThreshold != null ? item.lowStockThreshold : `${globalThreshold} (Global)`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
