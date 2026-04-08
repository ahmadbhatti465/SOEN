import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const examplePrompts = [
  'Explain this component and suggest improvements',
  'Generate unit tests for the following function',
  'Refactor this code for performance and readability',
  'Create a README section describing setup and run steps'
]

export async function generateContent(prompt, options = {}) {
  try {
    const systemMsg = options.system || 'You are a helpful assistant that generates code-aware, concise, and actionable responses.'

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000) // 25s timeout

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user', content: prompt }
      ],
      model: options.model || process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const choice = chatCompletion.choices?.[0]
    const text = choice?.message?.content || ''

    // Return structured response for easier client handling
    return {
      text,
      raw: chatCompletion,
      model: options.model || process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
    }
  } catch (error) {
    console.error('Error generating content:', error)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: AI service took too long to respond')
    }
    throw error
  }
}