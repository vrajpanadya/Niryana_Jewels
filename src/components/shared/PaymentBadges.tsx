import type {ReactElement} from 'react'

/**
 * Brand marks for the payment methods accepted through Razorpay. Rendered as inline SVG
 * (no network requests) on a white tile so they stay legible on both the light checkout
 * page and the dark-green footer. Trademarks belong to their respective owners.
 */
export type PaymentBrand = 'upi' | 'visa' | 'mastercard' | 'rupay'

const BRAND_LABEL: Record<PaymentBrand, string> = { upi: 'UPI', visa: 'Visa', mastercard: 'Mastercard', rupay: 'RuPay' }

function UpiMark() {
  return (
    <svg viewBox="36 38 370 106" aria-hidden="true" focusable="false" className="h-full w-full">
        <path d="M316.46,139.51h-19.28l26.82-96.86h19.28l-26.82,96.86Z" fill="#6e6f71"/>
        <path d="M306.45,45.71c-1.34-1.84-3.4-2.77-6.2-2.77h-106.04l-5.25,18.97h19.29s77.17-.01,77.17-.01l-5.61,20.27h-77.17v-.04s-19.28,0-19.28,0l-16.01,57.79h19.3l10.74-38.79h86.75c2.71,0,5.26-.92,7.66-2.77,2.39-1.85,3.97-4.13,4.72-6.86l10.74-38.79c.78-2.82.51-5.15-.81-7Z" fill="#6e6f71"/>
        <path d="M156.12,133.46c-1.07,3.83-4.56,6.49-8.54,6.49H48.09c-2.71,0-4.73-.92-6.05-2.77-1.32-1.85-1.61-4.13-.85-6.86l24.28-87.39h19.3l-21.68,78.05h77.21l21.68-78.05h19.3l-25.15,90.53Z" fill="#6e6f71"/>
        <polygon points="376.59 42.83 401 91.38 349.68 139.92 376.59 42.83" fill="#0f8041"/>
        <polygon points="359.47 42.83 383.87 91.38 332.52 139.92 359.47 42.83" fill="#e97726"/>
    </svg>
  )
}

function VisaMark() {
  return (
    <svg viewBox="0 6.5 24 11" aria-hidden="true" focusable="false" className="h-full w-full">
      <path fill="#1A1F71" d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
    </svg>
  )
}

function MastercardMark() {
  return (
    <svg viewBox="0 0 152 96" aria-hidden="true" focusable="false" className="h-full w-full">
      <circle cx="48" cy="48" r="48" fill="#EB001B" />
      <circle cx="104" cy="48" r="48" fill="#F79E1B" />
      <path fill="#FF5F00" d="M76 9A48 48 0 0 1 76 87A48 48 0 0 1 76 9Z" />
    </svg>
  )
}

function RupayMark() {
  return (
    <svg viewBox="45 55 735 195" aria-hidden="true" focusable="false" className="h-full w-full">
        <g transform="translate(55 0) skewX(-10)" fill="none" stroke="#354293" strokeWidth="32" strokeLinejoin="round">
        <path d="M70 77H112a30 30 0 0 1 0 60H70M70 77V198M108 137L138 198"/>
        <path d="M200 122V166a25 25 0 0 0 50 0M250 122V198"/>
        <path d="M322 77H364a30 30 0 0 1 0 60H322M322 77V198"/>
        <ellipse cx="450" cy="160" rx="24" ry="38"/><path d="M474 122V198"/>
        <path d="M520 122L552 198M590 122L552 198L530 240"/>
        </g>
        <polygon points="688 75 736 160 646 240" fill="#f37021"/>
        <polygon points="718 70 764 160 676 237" fill="#097e45"/>
    </svg>
  )
}

const MARKS: Record<PaymentBrand, () => ReactElement> = { upi: UpiMark, visa: VisaMark, mastercard: MastercardMark, rupay: RupayMark }
const ORDER: PaymentBrand[] = ['upi', 'visa', 'mastercard', 'rupay']

export default function PaymentBadges({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  const tile = size === 'sm' ? 'h-7 w-11 px-1.5 py-1.5' : 'h-9 w-14 px-2 py-2'
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Accepted payment methods">
      {ORDER.map(brand => {
        const Mark = MARKS[brand]
        return (
          <li key={brand} role="img" aria-label={BRAND_LABEL[brand]} title={BRAND_LABEL[brand]} className={`flex items-center justify-center rounded-[4px] border border-black/10 bg-white ${tile}`}>
            <Mark />
          </li>
        )
      })}
    </ul>
  )
}
