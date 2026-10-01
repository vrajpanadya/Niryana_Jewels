'use client'
import { create } from 'zustand'

export type ToastVariant = 'success' | 'info' | 'error'
export type Toast = { id: number; variant: ToastVariant; title: string; description?: string; duration: number; href?: { label: string; url: string } }
export type ToastInput = Omit<Toast, 'id' | 'duration' | 'variant'> & { variant?: ToastVariant; duration?: number }

type ToastStore = {
  toasts: Toast[]
  show: (input: ToastInput) => number
  dismiss: (id: number) => void
  clear: () => void
}

const MAX_VISIBLE = 3
let nextId = 1

export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  show: (input) => {
    const id = nextId++
    const toast: Toast = { variant: 'success', duration: 3800, ...input, id }
    set((s) => {
      // Replace an identical toast already on screen (e.g. rapid repeated clicks) instead of stacking copies.
      const rest = s.toasts.filter((t) => !(t.title === toast.title && t.description === toast.description))
      return { toasts: [...rest, toast].slice(-MAX_VISIBLE) }
    })
    return id
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}))

/** Imperative helper usable from any component, store action or event handler. */
export const toast = {
  show: (input: ToastInput) => useToastStore.getState().show(input),
  success: (title: string, description?: string, extra?: Partial<ToastInput>) => useToastStore.getState().show({ title, description, variant: 'success', ...extra }),
  info: (title: string, description?: string, extra?: Partial<ToastInput>) => useToastStore.getState().show({ title, description, variant: 'info', ...extra }),
  error: (title: string, description?: string, extra?: Partial<ToastInput>) => useToastStore.getState().show({ title, description, variant: 'error', duration: 5000, ...extra }),
  dismiss: (id: number) => useToastStore.getState().dismiss(id),
}
