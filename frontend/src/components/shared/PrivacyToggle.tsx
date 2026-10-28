import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { usePrivacy } from '@/hooks/use-privacy'

export function PrivacyToggle() {
  const [hidden, toggle] = usePrivacy()
  const label = hidden ? 'Mostrar valores' : 'Esconder valores'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          aria-pressed={hidden}
          onClick={toggle}
        >
          {hidden ? <EyeOff /> : <Eye />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
