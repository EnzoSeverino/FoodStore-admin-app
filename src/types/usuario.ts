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

export interface UsuarioCreate {
  nombre: string
  email: string
  password: string
  rol: string
}

export interface UsuarioUpdate {
  nombre?: string
  email?: string
  rol?: string
}