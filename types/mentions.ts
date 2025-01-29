export interface SelectedMention {
  id: number
  label: string
  type: 'politician' | 'committee' | 'minister'
  trigger: '@' | '#' | '!'
}

export interface MentionSearchQuery {
  politicians: number[]
  committees: number[]
  ministers: number[]
  text: string
} 

export interface MentionItem {
    label: string
    value: number
    trigger: '@' | '#' | '!'
  }
  