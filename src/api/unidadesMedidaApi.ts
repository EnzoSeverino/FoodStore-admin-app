import apiClient from "./axiosInstance";
import type { UnidadMedida } from "@/types/producto";

const UNIDADES_MEDIDA = '/unidades-medida'

export async function getUnidadesMedida(): Promise<UnidadMedida[]> {
    const response = await apiClient.get<UnidadMedida[]>(UNIDADES_MEDIDA)
    return response.data
}
