import { create } from 'zustand'

interface Project {
  id: string
  name: string
}

interface ProjectState {
  activeProject: Project | null
  setActiveProject: (project: Project | null) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),
}))
