import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUnidadesMedida } from "@/api/unidadesMedidaApi";
import { 
    getProductos,
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    updateDisponibilidad,
    updateImagenes,
} from "@/api/productosApi";
import { uploadImage, deleteImagen } from "@/api/uploadsApi";
import type { Producto, ProductoCreate, ProductoUpdate, ImagenProductoUpdate, UnidadMedida } from "@/types/producto";
import type { PaginatedResponse } from "@/types/api";

const PRODUCTOS_KEY= ['productos'] as const
const ALL_PRODUCTOS_KEY = ['productos', 'all'] as const

export function useProductos(params ?: {
    page?: number
    size?: number
    categoria?: number
    disponible?: boolean
    search?: string
}) {
    return useQuery<PaginatedResponse<Producto>>({
        queryKey: [...PRODUCTOS_KEY, params],
        queryFn: () => getProductos(params),
        staleTime: 2 * 60 * 1000,
    })
}

export function useAllProductos() {
    return useQuery<Producto[]>({
        queryKey: ALL_PRODUCTOS_KEY,
        queryFn: getAllProductos,
        staleTime: 5 * 60 * 1000,
    })
}

export function useProductoById(id: number | null) {
    return useQuery<Producto>({
        queryKey: [...PRODUCTOS_KEY, id],
        queryFn: () => getProductoById(id!),
        enabled: id !== null,
        staleTime: 2 * 60 * 1000
    })
}

export function useCreateProducto() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: ProductoCreate) => createProducto(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY })
            queryClient.invalidateQueries({ queryKey: ALL_PRODUCTOS_KEY })
        },
    })
}

export function useUpdateProducto() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ProductoUpdate }) =>
            updateProducto(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY })
            queryClient.invalidateQueries({ queryKey: ALL_PRODUCTOS_KEY })
        },
    })
}

export function useDeleteProducto() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => deleteProducto(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY })
            queryClient.invalidateQueries({ queryKey: ALL_PRODUCTOS_KEY })
        },
    })
}

export function useUpdateDisponibilidad() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, disponible }: { id: number; disponible: boolean }) =>
            updateDisponibilidad(id, disponible),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY })
            queryClient.invalidateQueries({ queryKey: ALL_PRODUCTOS_KEY })
        }
    })
}

export function useUpdateImagenes() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ImagenProductoUpdate }) =>
            updateImagenes(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY })
            queryClient.invalidateQueries({ queryKey: ALL_PRODUCTOS_KEY })
        }
    })
}

export function useUploadImage() {
    return useMutation({
        mutationFn: (file: File) => uploadImage(file),
    })
}

export function useDeleteImage() {
    return useMutation({
        mutationFn: (publicId: string) => deleteImagen(publicId),
    })
}

export function useUnidadesMedida() {
    return useQuery<UnidadMedida[]>({
        queryKey: ['unidades-medida'],
        queryFn: getUnidadesMedida,
        staleTime: 10 * 60 * 1000,
    })
}