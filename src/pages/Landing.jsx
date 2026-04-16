import { Link } from 'react-router-dom'
import { Package, LineChart, ShieldCheck, Zap, ArrowRight, BarChart3 } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-white">StockFlow</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Log in</Link>
              <Link to="/signup" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-emerald-500/50">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-slate-950"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-balance">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-emerald-400 bg-emerald-400/10 ring-1 ring-inset ring-emerald-400/20 mb-6">
            <span className="flex w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            v0.1 MVP Now Live
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-8">
            Inventory management <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">built for velocity.</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed text-balance">
            Track metrics, analyze supply levels, and prevent stockouts instantly. Designed specifically for SaaS & E-commerce operations needing institutional-grade reliability.
          </p>
          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <Link to="/signup" className="flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-[0_0_40px_-10px_rgba(52,211,153,0.4)]">
              Start Trading Inventory <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="#features" className="flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg transition-all">
              View Platform Specs
            </a>
          </div>
        </div>
      </div>

      {/* Stats/Mock Preview */}
      <div className="py-12 border-y border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            <div>
              <p className="text-4xl font-bold text-white mb-2">99.9%</p>
              <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Uptime</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">&lt;50ms</p>
              <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Latency</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-400 mb-2">Real-time</p>
              <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Sync</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">Zero</p>
              <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Data Loss</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Infrastructure</h2>
          <p className="text-lg text-slate-400 max-w-2xl">StockFlow brings the speed and analytics of quantitative stock trading platforms directly to your warehouse inventory.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Data-driven Dashboard</h3>
            <p className="text-slate-400 leading-relaxed">
              Visualize your capital allocation. Track total active product margins and immediately spot low-stock critical assets.
            </p>
          </div>
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Lightning Adjustments</h3>
            <p className="text-slate-400 leading-relaxed">
              Adjust stock levels with instant, optimistic UI updates. Zero latency means your data represents reality the millisecond you click.
            </p>
          </div>
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Multi-Tenant Vault</h3>
            <p className="text-slate-400 leading-relaxed">
              Your data is cryptographically isolated by Organization ID natively via our strict middleware and relational schemas.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm">
        <p>© 2026 StockFlow Corp. Built for Wexa AI Assessment.</p>
      </footer>
    </div>
  )
}
