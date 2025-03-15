import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Edit2, Trash2, Search, Plus } from 'lucide-react'

const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'Active' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'User', status: 'Active' },
]

export default function Accounts() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id))
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">User Accounts</h2>
        <button className="flex items-center rounded-md bg-[#07f468] px-4 py-2 text-sm font-medium text-white hover:bg-[#06d35a] focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:ring-offset-2 dark:focus:ring-offset-gray-900">
          <Plus className="mr-2 h-5 w-5" />
          Add New User
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-[#07f468] focus:outline-none focus:ring-1 focus:ring-[#07f468] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-[#07f468]"
          />
          <Search className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
        </div>
        <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-[#07f468] focus:outline-none focus:ring-1 focus:ring-[#07f468] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-[#07f468]">
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Manager">Manager</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow transition-colors duration-300 dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-[#07f468] bg-opacity-20 px-2 text-xs font-semibold leading-5 text-[#07f468]">
                    {user.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="rounded bg-[#07f468] bg-opacity-20 p-1 text-[#07f468] hover:bg-opacity-30">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded bg-yellow-100 p-1 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-400 dark:hover:bg-yellow-800">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="rounded bg-red-100 p-1 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

