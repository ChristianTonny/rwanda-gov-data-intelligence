'use client'

import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { fetchJson } from '../lib/api'
import type { QueryAnswer } from '../types/api'

export function useQueryAnswer() {
  const [question, setQuestion] = React.useState('')

  const mutation = useMutation({
    mutationKey: ['query', question],
    mutationFn: async () => {
      return await fetchJson<QueryAnswer>('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
    }
  })

  const submit = React.useCallback(() => {
    if (!question.trim()) return
    mutation.mutate()
  }, [mutation, question])

  return {
    question,
    setQuestion,
    submit,
    answer: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error as Error | null
  }
}


