import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_URL = 'https://stockflow-mvp-e8zb.onrender.com/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      login: async (email, password) => {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          if (!res.ok) return false;
          const data = await res.json()
          set({ user: data.user, token: data.token })
          return true
        } catch (e) {
          console.error(e)
          return false
        }
      },

      signup: async (email, password, organizationName) => {
        try {
          const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, organizationName })
          })
          if (!res.ok) return false;
          const data = await res.json()
          set({ user: data.user, token: data.token })
          return true
        } catch (e) {
          console.error(e)
          return false
        }
      },

      logout: () => set({ user: null, token: null })
    }),
    {
      name: 'auth-storage', 
    }
  )
)
