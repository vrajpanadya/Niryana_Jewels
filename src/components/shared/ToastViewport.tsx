'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AlertCircle, Check, Info, X } from 'lucide-react'
import { Toast, useToastStore } from '@/store/toastStore'

const ICON = { success: Check, info: Info, error: AlertCircle } as const
const ACCENT = { success: 'bg-gold text-forest', info: 'bg-white/15 text-white', error: 'bg-red-500/90 text-white' } as const

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss)
  const reduced = useReducedMotion()
  const timer = useRef<number>()
  const remaining = useRef(toast.duration)
  const startedAt = useRef(0)
  const Icon = ICON[toast.variant]

  const start = () => {
    startedAt.current = Date.now()
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => dismiss(toast.id), remaining.current)
  }
  const pause = () => {
    window.clearTimeout(timer.current)
    remaining.current = Math.max(1200, remaining.current - (Date.now() - startedAt.current))
  }
  useEffect(() => {
    start()
    return () => window.clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.li
      layout={!reduced}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.97 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.97 }}
      transition={{ duration: reduced ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={pause}
      onMouseLeave={start}
      onFocus={pause}
      onBlur={start}
      className="pointer-events-auto relative rounded-[3px] border border-gold/40 bg-forest text-white shadow-[0_18px_50px_rgba(23,59,44,.35)]"
    >
      <div className="flex items-start gap-3 py-3.5 pl-4 pr-3">
        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${ACCENT[toast.variant]}`}><Icon size={13} strokeWidth={2.4} /></span>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-[17px] leading-tight">{toast.title}</p>
          {toast.description && <p className="mt-1 text-[11px] leading-4 text-white/70">{toast.description}</p>}
          {toast.href && <Link href={toast.href.url} onClick={() => dismiss(toast.id)} className="mt-2 inline-block border-b border-gold/60 pb-0.5 text-[9px] uppercase tracking-[.16em] text-gold hover:text-white">{toast.href.label}</Link>}
        </div>
        <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification" className="-mr-1 -mt-0.5 p-1.5 text-white/50 hover:text-white"><X size={14} /></button>
      </div>
    </motion.li>
  )
}

export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center p-4 sm:justify-end sm:p-6" role="region" aria-label="Notifications">
      <ul className="flex w-full max-w-sm flex-col gap-2.5" aria-live="polite" aria-atomic="false">
        <AnimatePresence initial={false} mode="popLayout">
          {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
        </AnimatePresence>
      </ul>
    </div>
  )
}
