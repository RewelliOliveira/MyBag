import type { ReactNode } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface FormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  footer: ReactNode
  children: ReactNode
  size?: 'md' | 'lg'
}

export function FormSheet({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  size = 'md',
}: FormSheetProps) {
  const isMobile = useIsMobile()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className={cn(
          'gap-0',
          isMobile
            ? 'max-h-11/12 rounded-t-2xl'
            : cn(
                'data-[side=right]:w-full data-[side=right]:sm:max-w-md',
                size === 'lg' && 'data-[side=right]:sm:max-w-lg',
              ),
        )}
      >
        {isMobile && (
          <div
            aria-hidden="true"
            className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-muted"
          />
        )}
        <SheetHeader className="gap-1 border-b px-6 py-5 pr-12">
          <SheetTitle className="text-lg font-semibold">{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        <SheetFooter className="flex-row justify-end border-t bg-muted/40 px-6 py-4 *:flex-1 sm:*:flex-none">
          {footer}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
