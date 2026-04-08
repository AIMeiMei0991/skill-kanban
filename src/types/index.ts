export interface Skill {
  id: string
  name: string
  source: string
  install_command: string
  description: string
  usage: string
  tags: string[]
  shortcuts?: string[]
  sub_skills?: string[]
  dependencies?: string[]
  category?: string
  url?: string
}

export interface SkillFlow {
  id: string
  name: string
  description?: string
  plugin_ids: string[]
  created_at: string
}

export type PluginType = 'plugin' | 'memory' | 'local'

export interface Plugin {
  id: string
  name: string
  registry: string
  description: string
  prereq_command?: string
  install_command: string
  skill_ids: string[]
  type?: PluginType
  has_worker?: boolean
  worker_port?: number
  worker_runtime?: string
  web_ui?: string
  url?: string
}
