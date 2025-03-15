import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react'

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
]

const userActivityData = [
  { name: 'Mon', value: 1000 },
  { name: 'Tue', value: 1200 },
  { name: 'Wed', value: 1500 },
  { name: 'Thu', value: 1300 },
  { name: 'Fri', value: 1400 },
  { name: 'Sat', value: 1100 },
  { name: 'Sun', value: 900 },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const StatCard = ({ title, value, change, icon: Icon }) => (
  <motion.div
    variants={cardVariants}
    className="rounded-lg bg-white p-6 shadow-sm transition-colors duration-300 dark:bg-gray-800"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
      <div className={`rounded-full p-3 ${change >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
        <Icon className={`h-6 w-6 ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {change >= 0 ? (
        <ArrowUp className="h-4 w-4 text-green-500 dark:text-green-400" />
      ) : (
        <ArrowDown className="h-4 w-4 text-red-500 dark:text-red-400" />
      )}
      <p className={`ml-2 text-sm ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}
      </p>
    </div>
  </motion.div>
)

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Analytics Overview</h2>
        <select className="rounded-md border-gray-300 text-sm focus:border-[#07f468] focus:ring-[#07f468] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last 12 months</option>
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="$54,763" change={12.5} icon={DollarSign} />
        <StatCard title="Total Users" value="2,837" change={-3.6} icon={Users} />
        <StatCard title="Total Orders" value="1,947" change={8.2} icon={ShoppingCart} />
        <StatCard title="Conversion Rate" value="3.24%" change={1.2} icon={TrendingUp} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg bg-white p-6 shadow-sm transition-colors duration-300 dark:bg-gray-800"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Revenue Overview</h3>
          <div className="h-64 w-full">
            {/* Replace with a simple bar chart using divs */}
            <div className="flex h-full items-end space-x-2">
              {revenueData.map((item, index) => (
                <div key={index} className="flex-1">
                  <div
                    className="bg-[#07f468] transition-all duration-300"
                    style={{ height: `${(item.value / 6000) * 100}%` }}
                  ></div>
                  <div className="mt-2 text-center text-xs">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg bg-white p-6 shadow-sm transition-colors duration-300 dark:bg-gray-800"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">User Activity</h3>
          <div className="h-64 w-full">
            {/* Replace with a simple line chart using divs */}
            <div className="flex h-full items-end space-x-2">
              {userActivityData.map((item, index) => (
                <div key={index} className="flex-1 relative">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[#07f468] transition-all duration-300"
                    style={{ height: `${(item.value / 1500) * 100}%` }}
                  ></div>
                  <div className="absolute bottom-0 left-0 right-0 mt-2 text-center text-xs">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

