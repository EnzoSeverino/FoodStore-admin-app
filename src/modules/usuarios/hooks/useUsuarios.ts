import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    type UsuarioAdmin,
    type UsuarioAdminCreate,
    type UsuarioAdminUpdate,
} from "@/api/usuariosApi";
import type { PaginatedResponse } from "@/types/api";

const USUARIOS_KEY = ['usuarios'] as const

export function useUsuarios(page = 1, size = 20) {
  return useQuery<PaginatedResponse<UsuarioAdmin>>({
    queryKey: [...USUARIOS_KEY, { page, size }],
    queryFn: () => getUsuarios(page, size),
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UsuarioAdminCreate) => createUsuario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_KEY })
    },
  })
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UsuarioAdminUpdate }) =>
      updateUsuario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_KEY })
    },
  })
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USUARIOS_KEY })
    },
  })
}