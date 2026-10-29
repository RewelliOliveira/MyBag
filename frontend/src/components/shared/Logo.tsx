import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showWordmark?: boolean
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8 shrink-0">
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <path
          d="M9 12.5a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 23 12.5V21a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 9 21z"
          fill="none"
          strokeWidth="2"
          className="stroke-primary-foreground"
        />
        <path
          d="M12.5 10V9a3.5 3.5 0 0 1 7 0v1"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-primary-foreground"
        />
        <circle cx="19" cy="17" r="1.5" className="fill-primary-foreground" />
      </svg>
      {showWordmark && <span className="font-heading text-xl font-bold tracking-tight">MyBag</span>}
    </span>
  )
}
