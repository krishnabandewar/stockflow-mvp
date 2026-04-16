import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { PackageSearch } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [error, setError] = useState('')
  const signup = useAuthStore(state => state.signup)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const success = await signup(email, password, orgName)
    if (success) {
      navigate('/dashboard')
    } else {
      setError('Signup failed. Email might already exist.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-10 rounded-2xl shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)] border border-white/10">
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4 ring-1 ring-emerald-500/20">
            <PackageSearch size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Create an account</h2>
        </div>
        
        {error && <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 p-3 rounded-md text-sm">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1">Organization Name</label>
              <input
                required
                type="text"
                placeholder="e.g. My Mini Store"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="appearance-none block w-full px-4 py-2.5 bg-slate-950 border border-white/10 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm placeholder-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1">Email address</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-2.5 bg-slate-950 border border-white/10 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-2.5 bg-slate-950 border border-white/10 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              Sign up
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
