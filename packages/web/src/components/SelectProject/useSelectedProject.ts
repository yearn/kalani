import { create } from 'zustand'
import { Project } from './useProjects'

type UseSelectedProject = {
  selectedProject: Project | undefined,
  setSelectedProject: (project: Project | undefined) => void
} 

export const useSelectedProject = create<UseSelectedProject>(set => ({
  selectedProject: undefined,
  setSelectedProject: (project: Project | undefined) => set({ selectedProject: project })
}))
