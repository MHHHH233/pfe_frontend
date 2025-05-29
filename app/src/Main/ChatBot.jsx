   // src/Component/ChatBot/ChatBot.jsx
   import React, { useState, useRef, useEffect } from 'react';
   import ReactMarkdown from 'react-markdown';
   import { IoSend, IoClose, IoSettingsSharp, IoSunny, IoMoon, IoChevronDown } from 'react-icons/io5';
   import { RiRobot2Line, RiRefreshLine, RiArrowDownSLine } from 'react-icons/ri';
   import { FaUser, FaChevronLeft, FaChevronRight, FaRandom } from 'react-icons/fa';
   import { motion, AnimatePresence } from 'framer-motion';
   import chatbotService from '../lib/services/user/chatbotService';
   
   // Default suggestions based on the codebase
   const DEFAULT_SUGGESTIONS = [
     "How do I make a reservation?",
     "Tell me about your sports facilities",
     "What events are happening this month?",
     "How can I join an academy?",
     "What are your operating hours?",
     "How do I create a team?",
     "What tournaments are available?",
     "How do I view all terrains?",
     "Tell me about your features",
     "How do I contact support?",
     "What is the booking process?",
     "How do I register for an event?",
     "Tell me about your academies",
     "How do I find players for my team?",
     "What are the membership options?",
     "How do I view all matches?",
     "What payment methods do you accept?",
     "How do I update my profile?",
     "Tell me about your football facilities",
     "How do I sign up for notifications?"
   ];
   
   const ChatBot = () => {
     const [isOpen, setIsOpen] = useState(false);
     const [messages, setMessages] = useState([]);
     const [input, setInput] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const [availableModels, setAvailableModels] = useState([]);
     const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo');
     const [showSidebar, setShowSidebar] = useState(false);
     const [darkMode, setDarkMode] = useState(false);
     const [showFreeModelsOnly, setShowFreeModelsOnly] = useState(false);
     const messagesEndRef = useRef(null);
     const inputRef = useRef(null);
     const messagesContainerRef = useRef(null);
     const [autoScroll, setAutoScroll] = useState(true);
     const [isScrollable, setIsScrollable] = useState(false);
     const [showScrollIndicator, setShowScrollIndicator] = useState(false);
     const [userName, setUserName] = useState('');
     const [userPfp, setUserPfp] = useState('');
     const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
     const [suggestions, setSuggestions] = useState([]);
     const [showAllModels, setShowAllModels] = useState(false);
     const [inputSuggestions, setInputSuggestions] = useState([]);
     const [showInputSuggestions, setShowInputSuggestions] = useState(false);
   
     // Get user info from session storage and initialize suggestions
     useEffect(() => {
       const name = sessionStorage.getItem('name');
       const pfp = sessionStorage.getItem('pfp');
       
       setUserName(name || 'You');
       setUserPfp(pfp || '');
   
       // Get 3 random suggestions from the default list
       getRandomSuggestions();
   
       // Check for saved theme preference
       const savedTheme = localStorage.getItem('chatbot-theme');
       if (savedTheme === 'dark') {
         setDarkMode(true);
       }
   
       // Check for mobile device
       const handleResize = () => {
         setIsMobile(window.innerWidth < 640);
         if (window.innerWidth < 640 && showSidebar) {
           setShowSidebar(false);
         }
       };
   
       window.addEventListener('resize', handleResize);
       return () => window.removeEventListener('resize', handleResize);
     }, []);
   
     // Get random suggestions
     const getRandomSuggestions = () => {
       const shuffled = [...DEFAULT_SUGGESTIONS].sort(() => 0.5 - Math.random());
       setSuggestions(shuffled.slice(0, 3));
     };
   
     // Toggle dark mode
     const toggleDarkMode = () => {
       const newMode = !darkMode;
       setDarkMode(newMode);
       localStorage.setItem('chatbot-theme', newMode ? 'dark' : 'light');
     };
   
     // Check if messages container is scrollable
     const checkScrollable = () => {
       if (messagesContainerRef.current) {
         const { scrollHeight, clientHeight } = messagesContainerRef.current;
         setIsScrollable(scrollHeight > clientHeight);
       }
     };
   
     // Handle scroll events in the messages container
     const handleScroll = () => {
       if (messagesContainerRef.current) {
         const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
         const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
         setAutoScroll(isAtBottom);
         
         // Show scroll indicator if not at bottom
         setShowScrollIndicator(!isAtBottom && isScrollable);
       }
     };
   
     // Scroll to bottom of messages if autoScroll is enabled
     const scrollToBottom = () => {
       if (autoScroll && messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
       }
     };
   
     // Force scroll to bottom
     const forceScrollToBottom = () => {
       if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
         setShowScrollIndicator(false);
         setAutoScroll(true);
       }
     };
   
     useEffect(() => {
       if (isOpen && messagesContainerRef.current) {
         messagesContainerRef.current.addEventListener('scroll', handleScroll);
         checkScrollable();
         return () => {
           messagesContainerRef.current?.removeEventListener('scroll', handleScroll);
         };
       }
     }, [isOpen]);
   
     useEffect(() => {
       checkScrollable();
       if (autoScroll) {
         scrollToBottom();
       }
     }, [messages, isLoading]);
   
     useEffect(() => {
       // Add resize listener to check scrollable status when window size changes
       window.addEventListener('resize', checkScrollable);
       return () => {
         window.removeEventListener('resize', checkScrollable);
       };
     }, []);
   
     useEffect(() => {
       if (isOpen && inputRef.current) {
         inputRef.current.focus();
       }
     }, [isOpen]);
   
     // Update input suggestions when input changes
     useEffect(() => {
       if (input.length > 2) {
         const matchingSuggestions = DEFAULT_SUGGESTIONS.filter(
           suggestion => suggestion.toLowerCase().includes(input.toLowerCase())
         ).slice(0, 3);
         
         setInputSuggestions(matchingSuggestions);
         setShowInputSuggestions(matchingSuggestions.length > 0);
       } else {
         setShowInputSuggestions(false);
       }
     }, [input]);
   
     // Fetch available models when the component mounts
     useEffect(() => {
       const fetchModels = async () => {
         try {
           const response = await chatbotService.getAvailableModels();
           if (response.success) {
             setAvailableModels(response.models);
           }
         } catch (error) {
           console.error('Error fetching models:', error);
         }
       };
       
       fetchModels();
     }, []);
   
     const handleSend = async () => {
       if (!input.trim()) return;
       
       const userMessage = { role: 'user', content: input };
       setMessages(prev => [...prev, userMessage]);
       setInput('');
       setIsLoading(true);
       setAutoScroll(true); // Enable auto-scroll when sending a new message
       setShowInputSuggestions(false);
       
       try {
         const response = await chatbotService.sendMessage(input, {
           model: selectedModel
         });
         
         if (response.success) {
           setMessages(prev => [...prev, { 
             role: 'assistant', 
             content: response.message 
           }]);
           
           // Get new random suggestions after each conversation
           getRandomSuggestions();
         } else {
           throw new Error(response.message || 'Error communicating with chatbot');
         }
       } catch (error) {
         console.error('Error sending message:', error);
         setMessages(prev => [...prev, { 
           role: 'assistant', 
           content: 'Sorry, I encountered an error. Please try again.' 
         }]);
       } finally {
         setIsLoading(false);
       }
     };
   
     const handleClearConversation = async () => {
       try {
         await chatbotService.clearConversation();
         setMessages([]);
       } catch (error) {
         console.error('Error clearing conversation:', error);
       }
     };
   
     const toggleSidebar = () => {
       setShowSidebar(!showSidebar);
     };
   
     const handleInputChange = (e) => {
       setInput(e.target.value);
     };
   
     const handleKeyDown = (e) => {
       if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSend();
       }
     };
   
     // Handle suggested question click
     const handleSuggestedQuestion = (question) => {
       setInput(question);
       setShowInputSuggestions(false);
       inputRef.current.focus();
     };
   
     // Get user profile picture or default avatar
     const getUserAvatar = () => {
       if (userPfp) {
         return <img src={userPfp} alt={userName} className="w-6 h-6 rounded-full object-cover" />;
       }
       return <FaUser className="text-white" size={10} />;
     };
   
     // Get theme-based classes
     const getThemeClasses = () => {
       return {
         mainBg: darkMode ? 'bg-gray-900' : 'bg-white',
         textColor: darkMode ? 'text-white' : 'text-gray-800',
         inputBg: darkMode ? 'bg-gray-800' : 'bg-white',
         inputBorder: darkMode ? 'border-gray-700' : 'border-gray-300',
         inputFocus: darkMode ? 'focus:ring-green-500 focus:border-green-500' : 'focus:ring-green-500 focus:border-green-500',
         cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
         cardBorder: darkMode ? 'border-gray-700' : 'border-gray-200',
         sidebarBg: darkMode ? 'bg-gray-800' : 'bg-gray-50',
         buttonBg: darkMode ? 'bg-green-600' : 'from-green-500 to-green-700',
         buttonHover: darkMode ? 'hover:bg-green-700' : 'hover:from-green-600 hover:to-green-800',
         userMessageBg: darkMode ? 'bg-green-600' : 'from-green-500 to-green-600',
         botMessageBg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
         botMessageText: darkMode ? 'text-gray-100' : 'text-gray-800',
         headerBg: darkMode ? 'from-green-700 to-emerald-800' : 'from-green-600 to-emerald-700',
         suggestionBg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
         suggestionHover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200',
         suggestionText: darkMode ? 'text-gray-200' : 'text-gray-700',
         scrollIndicator: darkMode ? 'bg-green-500' : 'bg-green-600',
         scrollIndicatorHover: darkMode ? 'hover:bg-green-600' : 'hover:bg-green-700',
         divider: darkMode ? 'bg-gray-700' : 'bg-gray-200',
       };
     };
   
     const theme = getThemeClasses();
   
     // Filter models for display
     const displayModels = showAllModels 
       ? availableModels 
       : availableModels.slice(0, 5);
   
     // Filter for free models
     const filteredModels = availableModels.filter(model => 
       model.pricing && 
       model.pricing.prompt === "0" && 
       model.pricing.completion === "0"
     );
   
     return (
       <div className="fixed bottom-5 right-5 z-50">
         {/* Chat button */}
         <AnimatePresence>
           {!isOpen && (
             <motion.button
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0, opacity: 0 }}
               onClick={() => setIsOpen(true)}
               className={`${darkMode ? 'bg-green-600' : 'bg-gradient-to-r from-green-600 to-emerald-700'} text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center`}
             >
               <div className="relative">
                 <RiRobot2Line className="h-6 w-6" />
                 <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-300 rounded-full animate-pulse"></span>
               </div>
             </motion.button>
           )}
         </AnimatePresence>
         
         {/* Chat window */}
         <AnimatePresence>
           {isOpen && (
             <motion.div
               initial={{ opacity: 0, y: 20, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 20, scale: 0.95 }}
               transition={{ duration: 0.2 }}
               className={`absolute bottom-16 right-0 ${theme.mainBg} ${theme.textColor} rounded-lg shadow-2xl border ${theme.cardBorder} flex flex-col overflow-hidden`}
               style={{ 
                 maxHeight: 'calc(100vh - 120px)',
                 width: isMobile ? 'calc(100vw - 20px)' : showSidebar ? '500px' : '380px',
                 right: isMobile ? '-10px' : '0'
               }}
             >
               <div className="flex h-full">
                 {/* Sidebar */}
                 <AnimatePresence>
                   {showSidebar && (
                     <motion.div
                       initial={{ opacity: 0, width: 0 }}
                       animate={{ opacity: 1, width: '170px' }}
                       exit={{ opacity: 0, width: 0 }}
                       transition={{ duration: 0.2 }}
                       className={`${theme.sidebarBg} border-r ${theme.cardBorder} flex flex-col`}
                     >
                       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                         <h3 className="text-sm font-medium mb-2">Settings</h3>
                         <div className="flex items-center justify-between mb-4">
                           <span className="text-xs">Theme</span>
                           <button 
                             onClick={toggleDarkMode}
                             className="p-1.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                           >
                             {darkMode ? <IoSunny size={16} /> : <IoMoon size={16} />}
                           </button>
                         </div>
                       </div>
                       
                       <div className="p-4 flex-1 overflow-y-auto">
                         <div className="mb-4">
                           <label className="block text-xs font-medium mb-1.5">
                             AI Model
                           </label>
                           <select
                             value={selectedModel}
                             onChange={(e) => setSelectedModel(e.target.value)}
                             className={`w-full p-2 text-xs rounded ${theme.inputBg} ${theme.inputBorder} ${theme.inputFocus} focus:outline-none`}
                           >
                             {filteredModels.length > 0 ? (
                               filteredModels.map((model) => (
                                 <option key={model.id} value={model.id}>
                                   {model.name || model.id} (Free)
                                 </option>
                               ))
                             ) : (
                               <option value="" disabled>No free models available</option>
                             )}
                           </select>
                           
                           {availableModels.length > 5 && (
                             <button
                               onClick={() => setShowAllModels(!showAllModels)}
                               className="text-xs mt-1 text-green-600 dark:text-green-400 hover:underline flex items-center"
                             >
                               {showAllModels ? 'Show fewer models' : 'Show more models'}
                               <IoChevronDown className={`ml-1 transform ${showAllModels ? 'rotate-180' : ''} transition-transform`} />
                             </button>
                           )}
                         </div>
                         
                         <div className="mb-4">
                           <label className="block text-xs font-medium mb-1.5">
                             Suggestions
                           </label>
                           <button
                             onClick={getRandomSuggestions}
                             className="flex items-center text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                           >
                             <FaRandom className="mr-1" size={10} />
                             Refresh suggestions
                           </button>
                         </div>
                       </div>
                       
                       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                         <button 
                           onClick={handleClearConversation}
                           className="w-full py-2 px-3 text-xs bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors"
                         >
                           <RiRefreshLine className="mr-1.5" />
                           Clear Conversation
                         </button>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
                 
                 {/* Main chat area */}
                 <div className="flex-1 flex flex-col min-w-0">
                   {/* Header */}
                   <div className={`bg-gradient-to-r ${theme.headerBg} text-white p-3 flex justify-between items-center`}>
                     <div className="flex items-center">
                       <button 
                         onClick={toggleSidebar}
                         className="p-1.5 mr-2 rounded-full hover:bg-white/10 transition-colors"
                         aria-label="Toggle settings"
                       >
                         {showSidebar ? <FaChevronLeft size={14} /> : <IoSettingsSharp size={16} />}
                       </button>
                       <div className="flex items-center">
                         <RiRobot2Line className="mr-2 h-5 w-5" />
                         <h3 className="font-medium text-sm">AI Assistant</h3>
                       </div>
                     </div>
                     <button 
                       onClick={() => setIsOpen(false)}
                       className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                       aria-label="Close chat"
                     >
                       <IoClose className="h-5 w-5" />
                     </button>
                   </div>
                   
                   {/* Messages */}
                   <div 
                     ref={messagesContainerRef}
                     className={`flex-1 p-4 overflow-y-auto scroll-smooth ${darkMode ? '' : 'bg-gradient-to-b from-gray-50 to-white'}`}
                     style={{ maxHeight: 'calc(100vh - 250px)' }}
                   >
                     {messages.length === 0 ? (
                       <div className="text-center py-8">
                         <div className={`${darkMode ? 'bg-green-900/20' : 'bg-green-100/50'} p-4 rounded-lg inline-flex items-center justify-center mb-4`}>
                           <RiRobot2Line className={`${darkMode ? 'text-green-400' : 'text-green-600'} text-4xl`} />
                         </div>
                         <p className="font-medium">How can I help you today{userName ? `, ${userName}` : ''}?</p>
                         <p className="text-sm mt-2 text-gray-400 dark:text-gray-500">Ask me anything about our services, bookings, or general information.</p>
                         <div className="mt-4 grid grid-cols-1 gap-2">
                           {suggestions.map((suggestion, index) => (
                             <button 
                               key={index}
                               onClick={() => handleSuggestedQuestion(suggestion)}
                               className={`text-left p-2 ${theme.suggestionBg} ${theme.suggestionHover} rounded-lg text-sm ${theme.suggestionText} transition-colors`}
                             >
                               {suggestion}
                             </button>
                           ))}
                           <button
                             onClick={getRandomSuggestions}
                             className="text-center p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center"
                           >
                             <FaRandom className="mr-1.5" size={12} />
                             More suggestions
                           </button>
                         </div>
                       </div>
                     ) : (
                       <div className="space-y-4">
                         {messages.map((msg, index) => (
                           <motion.div 
                             key={index}
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ duration: 0.2 }}
                             className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                           >
                             <div 
                               className={`max-w-[85%] p-3 rounded-2xl ${
                                 msg.role === 'user' 
                                   ? `bg-gradient-to-r ${theme.userMessageBg} text-white rounded-br-none shadow-md` 
                                   : `${theme.botMessageBg} ${theme.botMessageText} rounded-bl-none shadow-sm`
                               }`}
                             >
                               <div className="flex items-center mb-1.5">
                                 <div className={`rounded-full p-1 mr-1.5 ${msg.role === 'user' ? 'bg-green-400' : darkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center`}>
                                   {msg.role === 'user' ? (
                                     getUserAvatar()
                                   ) : (
                                     <RiRobot2Line className={darkMode ? "text-gray-300" : "text-gray-600"} size={10} />
                                   )}
                                 </div>
                                 <span className="text-xs font-medium">
                                   {msg.role === 'user' ? (userName || 'You') : 'Assistant'}
                                 </span>
                               </div>
                               <div className={`prose prose-sm max-w-none overflow-auto ${darkMode ? 'prose-invert' : ''}`}>
                                 <ReactMarkdown>{msg.content}</ReactMarkdown>
                               </div>
                             </div>
                           </motion.div>
                         ))}
                       </div>
                     )}
                     {isLoading && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="flex justify-start my-4"
                       >
                         <div className={`${theme.botMessageBg} p-3 rounded-2xl rounded-bl-none`}>
                           <div className="flex space-x-1.5">
                             <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                             <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                             <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                           </div>
                         </div>
                       </motion.div>
                     )}
                     <div ref={messagesEndRef} />
                   </div>
                   
                   {/* Scroll to bottom indicator */}
                   <AnimatePresence>
                     {showScrollIndicator && (
                       <motion.button
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 10 }}
                         onClick={forceScrollToBottom}
                         className={`absolute bottom-20 right-4 ${theme.scrollIndicator} text-white p-2 rounded-full shadow-md ${theme.scrollIndicatorHover} transition-colors`}
                         title="Scroll to latest messages"
                       >
                         <RiArrowDownSLine className="h-4 w-4" />
                       </motion.button>
                     )}
                   </AnimatePresence>
                   
                   {/* Input area with suggestions */}
                   <div className="relative">
                     {/* Input suggestions */}
                     <AnimatePresence>
                       {showInputSuggestions && inputSuggestions.length > 0 && (
                         <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 10 }}
                           className={`absolute bottom-full left-0 right-0 ${theme.cardBg} border ${theme.cardBorder} rounded-t-lg shadow-lg overflow-hidden`}
                         >
                           {inputSuggestions.map((suggestion, index) => (
                             <button
                               key={index}
                               onClick={() => handleSuggestedQuestion(suggestion)}
                               className={`w-full text-left px-4 py-2 ${index !== 0 ? `border-t ${theme.cardBorder}` : ''} ${theme.textColor} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm`}
                             >
                               {suggestion}
                             </button>
                           ))}
                         </motion.div>
                       )}
                     </AnimatePresence>
                     
                     {/* Input */}
                     <div className={`border-t ${theme.cardBorder} p-3 flex`}>
                       <textarea
                         ref={inputRef}
                         value={input}
                         onChange={handleInputChange}
                         onKeyDown={handleKeyDown}
                         placeholder="Type a message..."
                         rows={1}
                         className={`flex-1 border ${theme.inputBorder} rounded-l-lg px-3 py-2 ${theme.inputBg} ${theme.textColor} ${theme.inputFocus} focus:outline-none resize-none overflow-auto`}
                         style={{ maxHeight: '120px', minHeight: '40px' }}
                       />
                       <button
                         onClick={handleSend}
                         disabled={!input.trim() || isLoading}
                         className={`${darkMode ? 'bg-green-600' : 'bg-gradient-to-r from-green-500 to-green-700'} text-white px-4 py-2 rounded-r-lg ${darkMode ? 'hover:bg-green-700' : 'hover:from-green-600 hover:to-green-800'} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
                       >
                         <IoSend />
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     );
   };
   
   export default ChatBot;