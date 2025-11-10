declare interface ComponentConfig {
  text?: string
  level?: number
  label?: string
  placeholder?: string
  maxLength?: number
  beforeText?: string
  afterText?: string
  correctAnswer?: string
  options?: string[]
  multiSelect?: boolean
  url?: string
  alt?: string
  caption?: string
  hotspots?: any[]
  rows?: number
  columns?: number
  headers?: string[]
  variant?: string
  items?: string[]
  questionText?: string,
  questionNumber?: number,
  hasHeaderRow?: boolean
  hasHeaderColumn?: boolean
  bordered?: boolean,
  data?: string[][],
  title?: string,
  startNumber?: number,
  bulletStyle?: string,
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