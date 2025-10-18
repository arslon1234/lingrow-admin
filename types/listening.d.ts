declare interface ComponentConfig {
  text?: string
  level?: number
  label?: string
  placeholder?: string
  maxLength?: number
  beforeText?: string
  afterText?: string
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
}

declare interface Component {
  id: number
  type: string
  config: ComponentConfig
}