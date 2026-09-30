/**
 * Add-to-bag micro-interaction helpers.
 *
 * The fly-to-cart clone is animated with the Web Animations API so the flight
 * runs entirely off the React render path (no re-renders per frame). Everything
 * degrades gracefully: callers check `prefersReducedMotion()` first and simply
 * skip the flight when the user has asked for reduced motion.
 */

/** Flight duration in ms. The CartDrawer is opened right after it. */
export const FLY_TO_CART_MS = 600

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type FlyOptions = {
  /** Element whose bounding box the flight starts from (the visible gallery image). */
  sourceEl: HTMLElement
  /** Already-loaded image URL (e.g. an <img>.currentSrc) used for the flying clone. */
  imageUrl: string
  /** Element the clone lands on — the header cart button, marked with [data-cart-button]. */
  targetEl: HTMLElement
}

/**
 * Clones the given image as a fixed-position thumbnail and flies it along a
 * gentle arc into the cart button, shrinking and fading as it lands. On landing
 * the target gets a short `.cart-land` bounce (disabled under reduced motion
 * via globals.css, and this whole function is skipped when the media query
 * matches). Works for any viewport: positions come from live bounding rects,
 * so mobile and desktop both behave identically.
 */
export function flyImageToCart({ sourceEl, imageUrl, targetEl }: FlyOptions): void {
  const from = sourceEl.getBoundingClientRect()
  const to = targetEl.getBoundingClientRect()
  if (!from.width || !from.height || !to.width || !to.height || !imageUrl) return

  const wrapper = document.createElement('div')
  Object.assign(wrapper.style, {
    position: 'fixed',
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 22px 55px rgba(23,59,44,.35)',
    zIndex: '90',
    pointerEvents: 'none',
    willChange: 'transform, opacity'
  } satisfies Partial<CSSStyleDeclaration>)
  const pic = document.createElement('img')
  pic.src = imageUrl
  pic.alt = ''
  pic.draggable = false
  Object.assign(pic.style, {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  } satisfies Partial<CSSStyleDeclaration>)
  wrapper.appendChild(pic)
  document.body.appendChild(wrapper)

  // Transform-origin is the element centre, so translating by the delta between
  // the two centres lands the clone squarely on the cart icon.
  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  const endSize = Math.max(24, Math.min(44, to.width))
  const endScale = endSize / from.width
  // A mid-keyframe lifted above the straight line gives the flight its arc.
  const lift = Math.min(150, Math.max(50, Math.abs(dy) * 0.22))

  const flight = wrapper.animate(
    [
      { transform: 'translate(0px, 0px) scale(1)', opacity: 1, borderRadius: '16px' },
      { transform: `translate(${dx * 0.42}px, ${dy * 0.42 - lift}px) scale(0.7)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(${endScale})`, opacity: 0.15, borderRadius: '999px' }
    ],
    { duration: FLY_TO_CART_MS, easing: 'cubic-bezier(.45,.02,.3,1)', fill: 'forwards' }
  )
  flight.onfinish = () => {
    wrapper.remove()
    targetEl.classList.add('cart-land')
    window.setTimeout(() => targetEl.classList.remove('cart-land'), 480)
  }
  flight.oncancel = () => wrapper.remove()
}
