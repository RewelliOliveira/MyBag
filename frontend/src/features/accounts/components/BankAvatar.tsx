import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'

interface BankAvatarProps {
  name: string
  iconUrl?: string | null
  className?: string
}

export function BankAvatar({ name, iconUrl, className }: BankAvatarProps) {
  return (
    <Avatar className={cn('size-10 rounded-xl', className)}>
      {iconUrl && <AvatarImage src={iconUrl} alt="" className="object-contain" />}
      <AvatarFallback className="rounded-xl bg-secondary text-sm font-semibold">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
