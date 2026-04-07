import { create } from 'zustand'

type ContextType = 'global' | 'decision' | 'spec' | 'conflict'

interface AIPanelState {
  isOpen: boolean
  contextType: ContextType
  contextId: string | null
  setOpen: (isOpen: boolean) => void
  setContext: (type: ContextType, id: string | null) => void
}

export const useAIPanelStore = create<AIPanelState>((set) => ({
  isOpen: false,
  contextType: 'global',
  contextId: null,
  setOpen: (isOpen) => set({ isOpen }),
  setContext: (type, id) => set({ contextType: type, contextId: id }),
}))
