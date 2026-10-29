import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { login, signup } from '@/features/auth/services/auth-service'
import { clearToken, setToken } from '@/lib/token-storage'

export function useLogin(redirectTo = '/') {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: login,
    onSuccess: (token) => {
      setToken(token)
      navigate(redirectTo, { replace: true })
    },
    meta: { errorMessage: 'E-mail ou senha incorretos.' },
  })
}

export function useSignup() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: Parameters<typeof signup>[0]) => {
      await signup(input)
      return login({ email: input.email, senha: input.senha })
    },
    onSuccess: (token) => {
      setToken(token)
      navigate('/', { replace: true })
    },
    meta: {
      successMessage: 'Conta criada. Boas-vindas ao MyBag!',
      errorMessage: 'Não foi possível criar sua conta.',
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return () => {
    clearToken()
    queryClient.clear()
  }
}
