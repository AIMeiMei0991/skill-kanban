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
}

export interface SkillFlow {
  id: string
  name: string
  skill_ids: string[]
  created_at: string
}

export interface Plugin {
  id: string
  name: string
  registry: string
  description: string
  install_command: string
  skill_ids: string[]
}
