'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { useQueryAnswer } from '../../hooks/useQueryAnswer'
import type { ProvenanceItem } from '../../types/api'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  provenance?: ProvenanceItem[]
  timestamp: Date
}

const CHAT_STORAGE_KEY = 'rgdi-chat-history'

function loadChatHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return parsed.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
  } catch {
    return []
  }
}

function saveChatHistory(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return
  // Keep only last 10 messages
  const toSave = messages.slice(-10)
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toSave))
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { question, setQuestion, submit, answer, isLoading, error } = useQueryAnswer()

  // Load chat history on mount
  useEffect(() => {
    setMessages(loadChatHistory())
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle new answer from API
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

  return (
    <div className="flex flex-col h-full bg-white border-l">
      <div className="flex-shrink-0 px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Rwanda AI Assistant</h2>
        </div>
        <p className="text-xs text-gray-600 mt-1">Ask questions about Rwanda's government data</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-8">
            <Bot className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p>Ask me anything about Rwanda's data!</p>
            <p className="text-xs mt-1">Try: "What is Gasabo's population?" or "Which districts need more supplies?"</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-green-100 text-green-700'
            }`}>
              {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            
            <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
              <div className={`rounded-lg px-3 py-2 text-sm ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {message.content}
              </div>
              
              {/* Provenance for assistant messages */}
              {message.type === 'assistant' && message.provenance && message.provenance.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  <div className="font-medium mb-1">Sources:</div>
                  {message.provenance.map((prov, i) => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="font-medium">{prov.dataset}</span>
                      {prov.timestamp && <span>({prov.timestamp})</span>}
                      {prov.confidence && <span className="text-gray-400">• {Math.round(prov.confidence * 100)}%</span>}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
                Sorry, I encountered an error: {error.message}
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 p-4 border-t bg-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Rwanda's data..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
