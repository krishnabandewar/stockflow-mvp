import { useState } from 'react'
import { useInventoryStore } from '../store/inventoryStore'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'

export default function Products() {
  const getOrgProducts = useInventoryStore(state => state.getOrgProducts)
  const addProduct = useInventoryStore(state => state.addProduct)
  const updateProduct = useInventoryStore(state => state.updateProduct)
  const deleteProduct = useInventoryStore(state => state.deleteProduct)
  const globalThreshold = useInventoryStore(state => state.globalLowStockThreshold)

  const products = getOrgProducts()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', quantity: 0, costPrice: '', sellingPrice: '', lowStockThreshold: ''
  })

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({ name: '', sku: '', description: '', quantity: 0, costPrice: '', sellingPrice: '', lowStockThreshold: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (p) => {
    setEditingProduct(p.id)
    setFormData({ ...p })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    // Validation
    if (!formData.name || !formData.sku) {
      alert('Name and SKU are required.')
      return
    }

    let success = false
    if (editingProduct) {
      success = await updateProduct(editingProduct, formData)
    } else {
      success = await addProduct(formData)
    }
    
    if (success) setIsModalOpen(false)
  }

  const handleQuickAdjust = async (id, currentQty, amount) => {
    await updateProduct(id, { quantity: parseInt(currentQty) + amount })
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder="Search products or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 shadow-sm border border-white/10 rounded-xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-slate-950/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-white/5">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    No products found. Add one to get started.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const threshold = p.lowStockThreshold !== '' && p.lowStockThreshold != null ? parseInt(p.lowStockThreshold) : globalThreshold
                  const isLowStock = parseInt(p.quantity) <= threshold

                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">{p.name}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[200px] mt-1">{p.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono tracking-tight">{p.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-400">
                        {p.sellingPrice ? `$${p.sellingPrice}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button onClick={() => handleQuickAdjust(p.id, p.quantity, -1)} className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 w-6 h-6 flex items-center justify-center rounded transition-colors tooltip transition-all">-</button>
                          <span className={`text-sm font-extrabold ${isLowStock ? 'text-rose-400' : 'text-slate-200'}`}>
                            {p.quantity}
                          </span>
                          <button onClick={() => handleQuickAdjust(p.id, p.quantity, 1)} className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 w-6 h-6 flex items-center justify-center rounded transition-colors tooltip transition-all">+</button>
                        </div>
                        {isLowStock && <span className="text-[10px] font-bold text-rose-500 mt-2 tracking-wider uppercase block">Low Stock</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openEditModal(p)} className="text-slate-400 hover:text-emerald-400 mx-2 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-rose-400 mx-2 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SKU *</label>
                <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quantity</label>
                  <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Low Stock Thresh.</label>
                  <input type="number" placeholder="Global def." value={formData.lowStockThreshold} onChange={e => setFormData({...formData, lowStockThreshold: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cost Price</label>
                  <input type="number" step="0.01" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Selling Price</label>
                  <input type="number" step="0.01" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono" />
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 shadow-[0_0_15px_-3px_rgba(52,211,153,0.3)] text-white rounded-lg text-sm font-bold hover:bg-emerald-500 transition-colors">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
