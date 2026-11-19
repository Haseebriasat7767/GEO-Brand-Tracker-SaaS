export interface User {
  id: string
  email: string
  name: string
}

export interface Brand {
  id: string
  user_id: string
  name: string
  domain: string
  description: string
  color: string
  created_at: string
}

export interface Competitor {
  id: string
  user_id: string
  brand_id: string
  name: string
  domain: string
  created_at: string
}

export interface Prompt {
  id: string
  user_id: string
  brand_id: string
  text: string
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational'
  created_at: string
}

export type Engine = 'ChatGPT' | 'Claude' | 'Gemini' | 'Perplexity' | 'Grok' | 'Copilot'

export interface Check {
  id: string
  user_id: string
  brand_id: string
  prompt_id: string
  engine: Engine
  mentioned: boolean
  position: number | null
  visibility_score: number
  sentiment: 'positive' | 'neutral' | 'negative'
  citations: string[]
  answer_snippet: string
  created_at: string
}

export interface AppState {
  brands: Brand[]
  competitors: Competitor[]
  prompts: Prompt[]
  checks: Check[]
}
