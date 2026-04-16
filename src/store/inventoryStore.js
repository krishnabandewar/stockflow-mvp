import { create } from 'zustand'
import { useAuthStore } from './authStore'

const API_URL = 'http://localhost:5000/api'

export const useInventoryStore = create((set, get) => ({
  products: [],
  globalLowStockThreshold: 5,
  isLoading: false,

  fetchOrganization: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/organizations/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        set({ globalLowStockThreshold: data.globalLowStockThreshold })
      }
    } catch (e) {
      console.error(e)
    }
  },

  setGlobalLowStockThreshold: async (threshold) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/organizations/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ globalLowStockThreshold: threshold })
      })
      if (res.ok) {
        set({ globalLowStockThreshold: threshold })
      }
    } catch (e) {
      console.error(e)
    }
  },

  fetchProducts: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    set({ isLoading: true })
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        set({ products: data, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (e) {
      set({ isLoading: false })
    }
  },

  getOrgProducts: () => {
    return get().products
  },

  addProduct: async (productParams) => {
    const token = useAuthStore.getState().token;
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(productParams)
      })
      if (res.ok) {
        const newProduct = await res.json()
        set(state => ({ products: [newProduct, ...state.products] }))
        return true
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to add. Ensure SKU is unique.')
        return false
      }
    } catch (e) {
      return false
    }
  },

  updateProduct: async (id, updates) => {
    const token = useAuthStore.getState().token;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updates)
      })
      if (res.ok) {
        const updated = await res.json()
        set(state => ({
          products: state.products.map(p => p.id === id ? updated : p)
        }))
        return true
      }
      return false
    } catch (e) {
      return false
    }
  },

  deleteProduct: async (id) => {
    const token = useAuthStore.getState().token;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        set(state => ({
          products: state.products.filter(p => p.id !== id)
        }))
      }
    } catch (e) {
      console.error(e)
    }
  }
}))
