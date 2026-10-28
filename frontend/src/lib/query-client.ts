import { MutationCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/api-error'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      successMessage?: string
      errorMessage?: string
    }
  }
}

export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: async (_data, _variables, _context, mutation) => {
      const message = mutation.meta?.successMessage
      if (message) toast.success(message)
      await queryClient.invalidateQueries()
    },
    onError: (error, _variables, _context, mutation) => {
      toast.error(getErrorMessage(error, mutation.meta?.errorMessage))
    },
  }),
})
