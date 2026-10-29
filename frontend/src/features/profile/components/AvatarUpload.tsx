import { useEffect, useMemo, useRef } from 'react'
import { Camera } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/format'

interface AvatarUploadProps {
  name: string
  imageUrl: string | null | undefined
  file: File | undefined
  onFileChange: (file: File | undefined) => void
}

export function AvatarUpload({ name, imageUrl, file, onFileChange }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file])

  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="Alterar foto de perfil"
      >
        <Avatar className="size-24">
          <AvatarImage src={preview ?? imageUrl ?? undefined} alt="" className="object-cover" />
          <AvatarFallback className="bg-accent font-heading text-2xl font-semibold text-accent-foreground">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/50 text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Camera className="size-6" />
        </span>
      </button>
      <div className="text-sm">
        <p className="font-medium">Foto de perfil</p>
        <p className="text-muted-foreground">PNG ou JPG com até 2 MB.</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => onFileChange(event.target.files?.[0])}
      />
    </div>
  )
}
