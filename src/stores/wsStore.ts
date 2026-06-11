import { create } from "zustand";
import type { WsConnectionStatus, WsLastEvent } from "@/types/websocket";

interface WsStoreState {
    status: WsConnectionStatus
    lastEvent: WsLastEvent | null
    retryCount: number
    setStatus: (status: WsConnectionStatus) => void
    setLastEvent: (event: WsLastEvent) => void
    incrementRetry: () => void
    resetRetry: () => void
    reset: () => void
}

export const useWsStore = create<WsStoreState>((set) => ({
    status: 'disconnected',
    lastEvent: null,
    retryCount: 0,

    setStatus: (status) => set({ status }),
    setLastEvent: (event) => set({ lastEvent: event }),
    incrementRetry: () => set((state) => ({ retryCount: state.retryCount + 1 })),
    resetRetry: () => set({ retryCount: 0 }),
    reset: () => set({ status: 'disconnected', lastEvent: null, retryCount: 0 }),
}))