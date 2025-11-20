declare interface MatchingOption {
  id: string
  text: string
}

declare interface MatchingItem {
  id: number
  text: string
  correctAnswer: string
}

declare interface ComponentConfig {
  text?: string
  level?: number
  label?: string
  placeholder?: string
  maxLength?: number
  beforeText?: string
  afterText?: string
  correctAnswer?: string
  options?: string[]  // MCQ uchun
  multiSelect?: boolean
  url?: string
  alt?: string
  caption?: string
  hotspots?: any[]
  rows?: number
  columns?: number
  headers?: string[]
  variant?: string
  items?: string[]  // NUMBERED_LIST va BULLET_LIST uchun
  questionText?: string
  questionNumber?: number
  hasHeaderRow?: boolean
  hasHeaderColumn?: boolean
  bordered?: boolean
  data?: any[][]
  title?: string
  startNumber?: number
  bulletStyle?: string
  
  // Matching component uchun alohida fieldlar
  instruction?: string
  optionsTitle?: string
  itemsTitle?: string
  matchingOptions?: MatchingOption[]
  matchingItems?: MatchingItem[]
  questionNumberEnd?: any
}

declare interface Component {
  id: number
  type: string
  config: ComponentConfig
}

interface QuestionData {
  questionType: string
  components: Component[]
  metadata: {
    totalComponents: number
    createdAt: string
  }
}