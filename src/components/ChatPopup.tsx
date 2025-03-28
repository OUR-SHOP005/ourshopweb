'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Suggested questions for the user to ask
const suggestedQuestions = [
  "What services do you offer?",
  "How much does a website cost?",
  "Tell me about your team",
  "How can I contact you?",
  "What is your design process?"
];

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '# 👋 Welcome to OurShop!\n\nI\'m your virtual assistant, ready to help you with information about our **web design services**, **pricing**, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
    if (isOpen && chatInputRef.current) {
      chatInputRef.current.focus()
    }
  }, [messages, isOpen])

  const handleSendMessage = async (messageText: string = inputValue) => {
    if (messageText.trim() === '') return

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageText })
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: `**Error:** ${data.message || 'Sorry, I encountered an error. Please try again later.'}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '**Error:** Sorry, there was a problem connecting to the assistant. Please try again later.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="bg-secondary hover:bg-secondary/90 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 transition-all">
          {/* Chat header */}
          <div className="bg-secondary text-white p-4 flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold">OurShop Assistant</h3>
              <p className="text-xs opacity-80">Ask me about our web design services</p>
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-secondary text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-tl-none'
                  }`}
                >
                  {message.role === 'user' ? (
                    <div className="mb-1 text-sm">{message.content}</div>
                  ) : (
                    <div className="mb-1 text-sm prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-1 mb-2" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-1 mb-2" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-1 mb-1" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-1 leading-snug" {...props} />,
                          a: ({ node, ...props }) => (
                            <a className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer" {...props} />
                          ),
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-1" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-2">
                              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700" {...props} />
                            </div>
                          ),
                          thead: ({ node, ...props }) => <thead className="bg-gray-100 dark:bg-gray-700" {...props} />,
                          tbody: ({ node, ...props }) => <tbody {...props} />,
                          tr: ({ node, ...props }) => <tr className="border-b border-gray-300 dark:border-gray-700" {...props} />,
                          th: ({ node, ...props }) => (
                            <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700 dark:text-gray-300" {...props} />
                          ),
                          td: ({ node, ...props }) => <td className="px-2 py-1 text-xs" {...props} />,
                          hr: ({ node, ...props }) => <hr className="my-2 border-gray-200 dark:border-gray-700" {...props} />,
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="pl-2 border-l-2 border-gray-300 dark:border-gray-700 italic my-2" {...props} />
                          ),
                          code: ({ node, inline, ...props }) =>
                            inline ? (
                              <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs" {...props} />
                            ) : (
                              <code className="block p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-x-auto my-2" {...props} />
                            ),
                          pre: ({ node, ...props }) => <pre className="overflow-auto text-xs p-0 my-2" {...props} />,
                          em: ({ node, ...props }) => <em className="italic" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                          img: ({ node, ...props }) => <img className="max-w-full h-auto my-2 rounded" {...props} />
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  <div
                    className={`text-xs ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg rounded-tl-none p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length < 3 && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center">
              <input
                ref={chatInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || inputValue.trim() === ''}
                className={`p-2 rounded-r-lg ${
                  isLoading || inputValue.trim() === ''
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-secondary hover:bg-secondary/90 text-white'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Powered by Google Gemini AI
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 