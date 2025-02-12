export interface User {
  id: string
  email: string
  credits: number
  web_ui_enabled: boolean
  role: string
  created_at?: string
  updated_at?: string
}
