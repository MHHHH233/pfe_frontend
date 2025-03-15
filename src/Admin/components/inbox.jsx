import { motion } from 'framer-motion'

const messages = [
  { id: 1, sender: 'John Doe', subject: 'Meeting Reminder', preview: 'Don\'t forget about our meeting tomorrow at 2 PM.' },
  { id: 2, sender: 'Jane Smith', subject: 'Project Update', preview: 'I\'ve completed the first phase of the project. Please review.' },
  { id: 3, sender: 'Bob Johnson', subject: 'Question about Invoice', preview: 'I have a question regarding the latest invoice you sent.' },
  { id: 4, sender: 'Alice Brown', subject: 'New Feature Request', preview: 'Our clients are asking for a new feature. Can we discuss this?' },
]

export default function Inbox() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-100">Inbox</h3>
      <div className="space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg bg-gray-800 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-100">{message.sender}</h4>
              <span className="text-sm text-gray-300">Just now</span>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-200">{message.subject}</p>
            <p className="mt-1 text-sm text-gray-400">{message.preview}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

