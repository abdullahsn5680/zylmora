'use client'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '@/app/Context/contextProvider'
import { useRouter } from 'next/navigation'
import { BarChart3, Users, Package, TrendingUp, ShoppingCart, Eye, Edit2, Trash2, Plus, ArrowUpRight, ArrowDownRight, Bell, Settings, LogOut, Menu, X, Zap, Award, Target, Flame } from 'lucide-react'

function AdminDashboard() {
  const router = useRouter()
  const { session, status } = useContext(UserContext)
  const isAdmin = session?.user?.role
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.replace('/Authentication')
      }
      if (!isAdmin) {
        router.replace('/')
      }
    }
  }, [status, session, isAdmin, router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setDashboardData({
          totalProducts: 1234,
          totalOrders: 856,
          totalCustomers: 542,
          totalRevenue: 125430,
          revenueGrowth: 12.5,
          orderGrowth: 8.3,
          customerGrowth: 5.2,
          recentOrders: [
            { id: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'Delivered', date: '2024-01-15', avatar: '👨' },
            { id: 'ORD-002', customer: 'Jane Smith', amount: 149.99, status: 'Processing', date: '2024-01-14', avatar: '👩' },
            { id: 'ORD-003', customer: 'Mike Johnson', amount: 599.99, status: 'Pending', date: '2024-01-13', avatar: '👨‍💼' },
            { id: 'ORD-004', customer: 'Sarah Williams', amount: 449.99, status: 'Delivered', date: '2024-01-12', avatar: '👩‍🦰' },
          ],
          topProducts: [
            { id: 1, name: 'Premium Shirt', sales: 342, stock: 125, trend: 'up', icon: '👔' },
            { id: 2, name: 'Cargo Pants', sales: 298, stock: 87, trend: 'up', icon: '👖' },
            { id: 3, name: 'Classic Tee', sales: 256, stock: 203, trend: 'down', icon: '👕' },
          ],
          chartData: [
            { day: 'Mon', revenue: 4200 },
            { day: 'Tue', revenue: 5800 },
            { day: 'Wed', revenue: 3200 },
            { day: 'Thu', revenue: 7200 },
            { day: 'Fri', revenue: 9200 },
            { day: 'Sat', revenue: 8500 },
            { day: 'Sun', revenue: 6800 },
          ]
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchDashboardData()
    }
  }, [isAdmin])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-1 text-center">
          <div className="inline-block relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text mb-3">
            Dashboard Loading
          </p>
          <p className="text-indigo-300/70 text-lg">Preparing your analytics...</p>
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const StatCard = ({ icon: Icon, title, value, growth, bgGradient, lightBg, accentColor, index }) => (
    <div 
      className="relative group h-full"
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* Animated background glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-0 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      
      <div className={`relative overflow-hidden rounded-3xl p-8 transition-all duration-300 h-full ${bgGradient} border border-white/10 group-hover:border-white/30`}>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Shine effect */}
        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>

        <div className="relative z-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/70 text-sm font-semibold tracking-wide uppercase">{title}</p>
            </div>
            <div className={`${lightBg} p-4 rounded-2xl backdrop-blur-sm border border-white/10 group-hover:border-white/30 transition-all transform group-hover:scale-110 group-hover:rotate-6`}>
              <Icon size={32} className="text-white/90" />
            </div>
          </div>
          
          <p className="text-5xl font-black text-white mb-4 tracking-tight">{value}</p>
          
          {growth !== undefined && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-full px-4 py-2 w-fit">
              <ArrowUpRight size={18} className="text-green-400" />
              <span className="text-green-300 font-bold text-sm">{growth}% this month</span>
            </div>
          )}
        </div>

        {/* Animated corner accents */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-xl group-hover:w-32 group-hover:h-32 transition-all duration-500"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-xl group-hover:w-32 group-hover:h-32 transition-all duration-500"></div>
      </div>
    </div>
  )

  const StatusBadge = ({ status }) => {
    const styles = {
      'Delivered': 'bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 text-green-300 border border-green-500/50',
      'Processing': 'bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-sky-500/20 text-blue-300 border border-blue-500/50',
      'Pending': 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-amber-500/20 text-yellow-300 border border-yellow-500/50',
      'Cancelled': 'bg-gradient-to-r from-red-500/20 via-pink-500/20 to-rose-500/20 text-red-300 border border-red-500/50'
    }
    const icons = {
      'Delivered': '✓',
      'Processing': '⏳',
      'Pending': '⚠',
      'Cancelled': '✕'
    }
    return (
      <span className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm ${styles[status] || styles['Pending']} flex items-center gap-2 w-fit`}>
        <span>{icons[status]}</span>
        {status}
      </span>
    )
  }

  const SimpleChart = () => {
    const maxValue = Math.max(...dashboardData.chartData.map(d => d.revenue))
    return (
      <div className="flex items-end justify-center gap-3 h-48 px-4">
        {dashboardData.chartData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-3 flex-1 group/bar">
            <div 
              className="w-full bg-gradient-to-t from-purple-500 via-blue-500 to-cyan-400 rounded-t-2xl relative group/col cursor-pointer transform transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
              style={{ height: `${(item.revenue / maxValue) * 100}%` }}
            >
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-gray-900 to-black text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover/col:opacity-100 transition-opacity whitespace-nowrap z-2 border border-white/20 shadow-xl">
                ${item.revenue.toLocaleString()}
              </div>
            </div>
            <span className="text-xs text-gray-400 font-bold group-hover/bar:text-white transition-colors">{item.day}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className=" z-3 border-b border-white/10 backdrop-blur-2xl bg-gradient-to-r from-slate-950/50 via-indigo-950/50 to-slate-950/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl">
                  ⚡
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                    Admin Dashboard
                  </h1>
                  <p className="text-indigo-400/80 text-sm font-medium mt-1">Real-time business intelligence & analytics</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="group p-3 hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm border border-white/10 hover:border-purple-500/50">
                <Bell size={20} className="text-indigo-300 group-hover:text-purple-300 transition-colors" />
              </button>
              <button className="group p-3 hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm border border-white/10 hover:border-purple-500/50">
                <Settings size={20} className="text-indigo-300 group-hover:text-purple-300 transition-colors" />
              </button>
              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">Admin</p>
                  <p className="text-sm font-bold text-white">{session?.user?.email?.split('@')[0] || 'Admin'}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  👤
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-1 max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Package}
            title="Total Products"
            value={dashboardData?.totalProducts.toLocaleString()}
            bgGradient="bg-gradient-to-br from-blue-600/40 via-cyan-600/30 to-blue-700/40"
            lightBg="bg-blue-600/30"
            accentColor="blue"
            index={0}
          />
          <StatCard
            icon={ShoppingCart}
            title="Total Orders"
            value={dashboardData?.totalOrders.toLocaleString()}
            growth={dashboardData?.orderGrowth}
            bgGradient="bg-gradient-to-br from-purple-600/40 via-pink-600/30 to-purple-700/40"
            lightBg="bg-purple-600/30"
            accentColor="purple"
            index={1}
          />
          <StatCard
            icon={Users}
            title="Total Customers"
            value={dashboardData?.totalCustomers.toLocaleString()}
            growth={dashboardData?.customerGrowth}
            bgGradient="bg-gradient-to-br from-pink-600/40 via-rose-600/30 to-pink-700/40"
            lightBg="bg-pink-600/30"
            accentColor="pink"
            index={2}
          />
          <StatCard
            icon={TrendingUp}
            title="Total Revenue"
            value={`$${dashboardData?.totalRevenue.toLocaleString()}`}
            growth={dashboardData?.revenueGrowth}
            bgGradient="bg-gradient-to-br from-green-600/40 via-emerald-600/30 to-green-700/40"
            lightBg="bg-green-600/30"
            accentColor="green"
            index={3}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-0 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 border border-white/10 group-hover:border-white/20 rounded-3xl p-10 transition-all">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <BarChart3 size={24} className="text-white" />
                    </div>
                    Weekly Revenue
                  </h2>
                  <p className="text-indigo-300/60 text-sm font-medium">Revenue trend over the last 7 days</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">$42.5K</p>
                  <p className="text-green-400 text-sm font-bold flex items-center justify-end gap-1 mt-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1 w-fit ml-auto">
                    <ArrowUpRight size={16} className="animate-bounce" /> 23% increase
                  </p>
                </div>
              </div>
              <SimpleChart />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="group relative h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 border border-white/10 group-hover:border-white/20 rounded-3xl p-8 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white text-xl">
                    💰
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wide">Avg Order Value</p>
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">$146.50</p>
                  </div>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
                </div>
              </div>
            </div>

            <div className="group relative h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 border border-white/10 group-hover:border-white/20 rounded-3xl p-8 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl">
                    📈
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wide">Conversion Rate</p>
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text">8.24%</p>
                  </div>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                </div>
              </div>
            </div>

            <div className="group relative h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-rose-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 border border-white/10 group-hover:border-white/20 rounded-3xl p-8 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl flex items-center justify-center text-white text-xl">
                    ⚠️
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wide">Pending Orders</p>
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-orange-300 to-rose-300 bg-clip-text">23</p>
                  </div>
                </div>
                <p className="text-orange-400/80 text-xs font-bold">🔔 Requires immediate attention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-0 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 border border-white/10 group-hover:border-white/20 rounded-3xl overflow-hidden transition-all">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-8 border-b border-white/10">
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                  <ShoppingCart size={28} />
                  Recent Orders
                </h2>
                <p className="text-white/60 text-sm font-medium mt-1">Latest transactions from your store</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-8 py-5 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Order</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Customer</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Amount</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-white/70 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recentOrders.map((order, idx) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/10 transition-all group/row duration-200">
                        <td className="px-8 py-5 text-sm font-bold text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text">{order.id}</td>
                        <td className="px-8 py-5 text-sm">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{order.avatar}</span>
                            <span className="text-white font-semibold">{order.customer}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-black text-transparent bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text">${order.amount.toFixed(2)}</td>
                        <td className="px-8 py-5 text-sm"><StatusBadge status={order.status} /></td>
                        <td className="px-8 py-5 text-sm text-white/50 font-medium">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Products & Actions */}
          <div className="space-y-6">
            {/* Top Products */}
            <div className="group relative h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 border border-white/10 group-hover:border-white/20 rounded-3xl p-8 transition-all">
                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                  <span className="text-3xl">🔥</span> Top Products
                </h3>
                <div className="space-y-5">
                  {dashboardData?.topProducts.map((product) => (
                    <div key={product.id} className="group/product p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{product.icon}</span>
                          <p className="text-white font-bold group-hover/product:text-transparent group-hover/product:bg-gradient-to-r group-hover/product:from-purple-300 group-hover/product:to-blue-300 group-hover/product:bg-clip-text transition-all">{product.name}</p>
                        </div>
                        {product.trend === 'up' ? (
                          <div className="text-green-400 font-bold flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-lg">
                            <ArrowUpRight size={14} /> ↑
                          </div>
                        ) : (
                          <div className="text-red-400 font-bold flex items-center gap-1 bg-red-500/20 px-2 py-1 rounded-lg">
                            <ArrowDownRight size={14} /> ↓
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-white/50 font-bold">{product.sales.toLocaleString()} sales</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full">{product.stock} in stock</span>
                      </div>
                      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/50" style={{ width: `${(product.sales / 350) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="group relative h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 border border-white/10 group-hover:border-white/20 rounded-3xl p-8 transition-all">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                  ⚡ Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 rounded-xl hover:shadow-2xl transition-all font-bold flex items-center justify-center gap-3 text-lg transform hover:scale-105 active:scale-95">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-2 z-1">
                      <Plus size={22} className="group-hover/btn:rotate-90 transition-transform duration-300" /> Add Product
                    </div>
                  </button>
                  <button className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-4 rounded-xl hover:shadow-2xl transition-all font-bold flex items-center justify-center gap-3 text-lg transform hover:scale-105 active:scale-95">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-2 z-1">
                      <Eye size={22} /> View Reports
                    </div>
                  </button>
                  <button className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-4 rounded-xl hover:shadow-2xl transition-all font-bold flex items-center justify-center gap-3 text-lg transform hover:scale-105 active:scale-95">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-2 z-1">
                      <Users size={22} /> Manage Users
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes tilt {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1deg); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-tilt {
          animation: tilt 3s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard