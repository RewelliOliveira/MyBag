import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/features/profile/services/profile-service'

export const currentUserQueryKey = ['current-user'] as const

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    staleTime: 5 * 60_000,
  })
}
