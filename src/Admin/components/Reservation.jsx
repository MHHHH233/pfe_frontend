import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Check, X, Search, Plus } from 'lucide-react'

const initialReservations = [
  { id: 1, name: 'John Doe', date: '2023-06-15', time: '14:00', status: 'Confirmed' },
  { id: 2, name: 'Jane Smith', date: '2023-06-16', time: '10:30', status: 'Pending' },
  { id: 3, name: 'Bob Johnson', date: '2023-06-17', time: '18:00', status: 'Confirmed' },
  { id: 4, name: 'Alice Brown', date: '2023-06-18', time: '12:00', status: 'Cancelled' },
  { id: 5, name: 'Charlie Davis', date: '2023-06-19', time: '15:30', status: 'Pending' },
]

export default function Reservations() {
  const [reservations, setReservations] = useState(initialReservations)
  const [searchTerm, setSearchTerm] = useState('')

  const handleConfirm = (id) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: 'Confirmed' } : res
    ))
  }

  const handleCancel = (id) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: 'Cancelled' } : res
    ))
  }

  const handleDelete = (id) => {
    setReservations(reservations.filter(res => res.id !== id))
  }

  const filteredReservations = reservations.filter(res =>
    res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.date.includes(searchTerm) ||
    res.time.includes(searchTerm) ||
    res.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Reservations</h2>
        <button className="flex items-center rounded-md bg-[#07f468] px-4 py-2 text-sm font-medium text-white hover:bg-[#06d35a] focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:ring-offset-2 dark:focus:ring-offset-gray-900">
          <Plus className="mr-2 h-5 w-5" />
          New Reservation
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search reservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-[#07f468] focus:outline-none focus:ring-1 focus:ring-[#07f468] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-[#07f468]"
          />
          <Search className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
        </div>
        <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-[#07f468] focus:outline-none focus:ring-1 focus:ring-[#07f468] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-[#07f468]">
          <option value="">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
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
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Time
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
            {filteredReservations.map((reservation, index) => (
              <motion.tr
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{reservation.name}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.date}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.time}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      reservation.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : reservation.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {reservation.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-2">
                    {reservation.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleConfirm(reservation.id)}
                          className="rounded bg-green-100 p-1 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCancel(reservation.id)}
                          className="rounded bg-red-100 p-1 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button className="rounded bg-yellow-100 p-1 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-400 dark:hover:bg-yellow-800">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reservation.id)}
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

