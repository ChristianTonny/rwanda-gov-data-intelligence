'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, Loader2, MessageSquare } from 'lucide-react'
import { useQueryAnswer } from '../../hooks/useQueryAnswer'
import type { ProvenanceItem } from '../../types/api'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  provenance?: ProvenanceItem[]
  timestamp: Date
}

const CHAT_STORAGE_KEY = 'rgdi-ai-history'

function loadChatHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return parsed.slice(-10).map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
  } catch {
    return []
  }
}

function saveChatHistory(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-10)))
}

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { question, setQuestion, submit, answer, isLoading, error } = useQueryAnswer()

  // Load chat history
  useEffect(() => {
    setMessages(loadChatHistory())
  }, [])

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [isOpen])

  // Handle new answers
  useEffect(() => {
    if (answer && question) {
      const assistantMessage: ChatMessage = {
        id: Date.now() + '-assistant',
        type: 'assistant',
        content: answer.answer,
        provenance: answer.provenance,
        timestamp: new Date()
      }
      
      setMessages(prev => {
        const updated = [...prev, assistantMessage]
        saveChatHistory(updated)
        return updated
      })
    }
  }, [answer, question])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now() + '-user',
      type: 'user', 
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => {
      const updated = [...prev, userMessage]
      saveChatHistory(updated)
      return updated
    })

    setQuestion(input.trim())
    submit()
    setInput('')
  }

  const hasUnread = messages.length > 0 && !isOpen

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Open AI Assistant"
      >
        <Bot className="w-6 h-6" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white shadow-2xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">AI Assistant</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Close AI Assistant"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-140px)]">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Ask me about Rwanda's data!</p>
              <p className="text-gray-400 text-xs mt-2">
                Try: "Budget execution by ministry" or "Population growth trends"
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-green-600" />
                  </div>
                )}
                
                <div className={`max-w-[280px] ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div className={`rounded-2xl px-3 py-2 text-sm ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-md' 
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    {message.content}
                  </div>
                  
                  {message.type === 'assistant' && message.provenance && message.provenance.length > 0 && (
                    <div className="mt-2 text-xs">
                      <details className="text-gray-500">
                        <summary className="cursor-pointer hover:text-gray-700">
                          {message.provenance.length} source{message.provenance.length > 1 ? 's' : ''}
                        </summary>
                        <div className="mt-1 space-y-1">
                          {message.provenance.map((prov, i) => (
                            <div key={i} className="flex items-center gap-2 py-1">
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                              <span className="font-medium">{prov.dataset}</span>
                              {prov.timestamp && <span className="text-gray-400">({prov.timestamp})</span>}
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 order-2">
                    <span className="text-white text-xs font-medium">You</span>
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-green-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-red-600" />
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl rounded-bl-md px-3 py-2 text-sm text-red-700">
                Sorry, I encountered an error. Please try again.
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Rwanda's data..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Ctrl+K to open • Esc to close
          </p>
        </div>
      </div>
    </>
  )
}
