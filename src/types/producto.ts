// ─── Unidad de Medida
export interface UnidadMedida {
    id: number
    nombre: string
    simbolo: string
    tipo: string
}

// ─── Ingrediente
export interface Ingrediente {
    id: number
    nombre: string
    descripcion: string | null
    es_alergeno: boolean
    stock_cantidad: number
}

export interface IngredienteCreate { 
    nombre: string
    descripcion?: string
    es_alergeno: boolean
    stock_cantidad?: number
}

export interface IngredienteUpdate {
    nombre?: string
    descripcion?: string
    es_alergeno?: boolean
    stock_cantidad?: number
}

// ─── Producto-Ingrediente (relación N:M con datos)
export interface ProductoIngrediente {
    id: number                       
    nombre: string                   
    cantidad: number | null          
    unidad_medida_id: number | null  
    es_removible: boolean
}

// ─── Categoría simple
export interface CategoriaSimple {
    id: number
    nombre: string
    es_principal: boolean
}

// ─── Producto
export interface Producto {
    id: number
    nombre: string
    descripcion: string | null
    precio_base: number
    imagenes_url: { url: string; public_id: string | null }[] | null 
    unidad_venta_id: number | null    
    unidad_venta: UnidadMedida | null 
    stock_cantidad: number
    disponible: boolean               
    categorias: CategoriaSimple[]
    ingredientes: ProductoIngrediente[]
    created_at: string
    updated_at: string | null
}

// ─── Producto Create
export interface CategoriaInput {
    id: number
    es_principal: boolean
}

export interface IngredienteInput {
    ingrediente_id: number
    cantidad: number
    unidad_medida_id: number
    es_removible: boolean
}

export interface ProductoCreate {
    nombre: string
    descripcion?: string
    precio_base: number
    stock_cantidad: number
    disponible?: boolean
    imagenes_url?: string[]
    unidad_venta_id?: number | null
    categorias: CategoriaInput[]
    ingredientes_ids: number[]
}

// ─── Producto Update
export interface ProductoUpdate {
    nombre?: string
    descripcion?: string
    precio_base?: number
    stock_cantidad?: number
    disponible?: boolean
    imagenes_url?: string[]
    unidad_venta_id?: number | null
    categorias?: CategoriaInput[]
    ingredientes_ids?: number[]
}

// ─── Cloudinary

// Respuesta del endpoint POST /api/v1/uploads/imagen
export interface CloudinaryResponse {
    secure_url: string
    public_id: string
    width: number
    height: number
    format: string
    resource_type: string
}

// Body para PATCH /api/v1/productos/{id}/imagenes
export interface ImagenProductoUpdate {
    imagenes_url: string[]
}