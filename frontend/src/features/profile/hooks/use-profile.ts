import { useMutation, useQuery } from '@tanstack/react-query'
import { getCurrentUser, updateProfile } from '@/features/profile/services/profile-service'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60_000,
  })
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
    meta: {
      successMessage: 'Perfil atualizado.',
      errorMessage: 'Não foi possível atualizar o perfil.',
    },
  })
}
