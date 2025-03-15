import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Star, Trash2, MoreHorizontal } from 'lucide-react'

const initialMessages = [
  { id: 1, sender: 'John Doe', subject: 'Meeting Reminder', preview: 'Don\'t forget about our meeting tomorrow at 2 PM.', date: '2023-06-15', isStarred: false },
  { id: 2, sender: 'Jane Smith', subject: 'Project Update', preview: 'I\'ve completed the first phase of the project. Please review.', date: '2023-06-14', isStarred: true },
  { id: 3, sender: 'Bob Johnson', subject: 'Question about Invoice', preview: 'I have a question regarding the latest invoice you sent.', date: '2023-06-13', isStarred: false },
  { id: 4, sender: 'Alice Brown', subject: 'New Feature Request', preview: 'Our clients are asking for a new feature. Can we discuss this?', date: '2023-06-12', isStarred: false },
  { id: 5, sender: 'Charlie Davis', subject: 'Vacation Request', preview: 'I\'d like to request time off from July 1st to July 7th.', date: '2023-06-11', isStarred: true },
]

export default function Messages() {
  const [messages, setMessages] = useState(initialMessages)
  const [searchTerm, setSearchTerm] = useState('')

  const handleDelete = (id) => {
    setMessages(messages.filter(message => message.id !== id))
  }

  const handleStar = (id) => {
    setMessages(messages.map(message => 
      message.id === id ? { ...message, isStarred: !message.isStarred } : message
    ))
  }

  const filteredMessages = messages.filter(message =>
    message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Messages</h2>
        <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-[#07f468] focus:outline-none focus:ring-1 focus:ring-[#07f468] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-[#07f468]">
          <option>All Messages</option>
          <option>Unread</option>
          <option>Starred</option>
          <option>Sent</option>
        </select>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-[#07f468] focus:outline-none focus:ring-1 focus:ring-[#07f468] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-[#07f468]"
        />
        <Search className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {filteredMessages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg bg-white p-4 shadow-sm transition-colors duration-300 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`/placeholder.svg?height=40&width=40&text=${message.sender.charAt(0)}`}
                  alt=""
                />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{message.sender}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{message.subject}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStar(message.id)}
                  className={`rounded p-1 ${message.isStarred ? 'text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-500' : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'}`}
                >
                  <Star className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(message.id)}
                  className="rounded p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button className="rounded p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message.preview}</p>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{message.date}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

