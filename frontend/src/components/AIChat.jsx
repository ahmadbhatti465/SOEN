import React, { useState } from 'react'
import api from '../api/axios'

const examplePrompts = [
  'Explain how this component works and suggest improvements.',
  'Generate unit tests for the following function.',
  'Convert this code into an optimized version for production.',
  'Create a README section describing the project setup and run steps.'
]

const AIChat = () => {
  const [prompt, setPrompt] = useState('')
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(false)

  const sendPrompt = async (p) => {
    const finalPrompt = p || prompt
    if (!finalPrompt || finalPrompt.trim() === '') return
    setLoading(true)
    try {
      const res = await api.get('/ai/get-result', { params: { prompt: finalPrompt } })
      const payload = res.data || {}
      const data = payload.result || payload
      const text = data?.text || (typeof data === 'string' ? data : JSON.stringify(data))
      setResponses((prev) => [...prev, { prompt: finalPrompt, response: { text, meta: data } }])
      setPrompt('')
    } catch (err) {
      console.error('AI request failed', err)
      const errorMessage = err.response?.data?.message || err.message || 'Request failed. Please try again.'
      setResponses((prev) => [...prev, { prompt: finalPrompt, response: { text: 'Error: ' + errorMessage } }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b">
        <h4 className="text-lg font-semibold">AI Assistant</h4>
        <p className="text-sm text-gray-500">Ask for code suggestions, conversions, or documentation.</p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4 bg-white">
        {responses.length === 0 ? (
          <div className="text-sm text-gray-400">No conversations yet. Try a prompt below.</div>
        ) : (
          responses.map((r, i) => (
            <div key={i} className="space-y-2">
              <div className="text-xs text-gray-600">You:</div>
              <div className="bg-gray-100 p-2 rounded text-sm break-words">{r.prompt}</div>
              <div className="text-xs text-gray-600 mt-1">AI:</div>
              <div className="bg-gray-50 p-3 rounded border text-sm whitespace-pre-wrap">{r.response?.text || JSON.stringify(r.response)}</div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t bg-white">
        <div className="flex gap-2 mb-2">
          {examplePrompts.map((p, idx) => (
            <button key={idx} onClick={() => sendPrompt(p)} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">{p}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask the AI..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none h-20"
          />
          <button onClick={() => sendPrompt()} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIChat
