export type CodigoRol = 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'CLIENT'

export interface Usuario {
  id: number
  nombre: string
  apellido?: string | null
  email: string
  rol: string 
  celular?: string | null         
  deleted_at: string | null
}

// Para crear usuario desde admin
export interface UsuarioCreate {
  nombre: string
  email: string
  password: string
  rol: string
}

// Para actualizar usuario
export interface UsuarioUpdate {
  nombre?: string
  email?: string
  rol?: string
}