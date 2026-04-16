import { useState } from 'react'
import { useInventoryStore } from '../store/inventoryStore'

export default function Settings() {
  const globalThreshold = useInventoryStore(state => state.globalLowStockThreshold)
  const setGlobalLowStockThreshold = useInventoryStore(state => state.setGlobalLowStockThreshold)

  const [threshold, setThreshold] = useState(globalThreshold)
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setGlobalLowStockThreshold(parseInt(threshold) || 0)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-xl">
      <div className="bg-slate-900 rounded-xl shadow-sm border border-white/10">
        <div className="px-6 py-5 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">Global Settings</h3>
          <p className="text-sm text-slate-400 mt-1">Configure defaults applied across your organization.</p>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Default Low Stock Threshold
            </label>
            <p className="text-xs text-slate-500 mb-4">
              If a product does not have a specific low stock threshold set, this value will be used to determine if it should appear on the critical low stock dashboard.
            </p>
            <div className="w-1/3">
              <input
                type="number"
                min="0"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-white font-medium shadow-inner"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
            {saved ? (
              <span className="text-sm text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded">Settings saved successfully!</span>
            ) : (
             <span />
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 shadow-[0_0_15px_-3px_rgba(52,211,153,0.3)] text-white font-bold rounded-lg hover:bg-emerald-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
