import type { UserPublic } from "@/types/api";

export function hasRole(user: UserPublic | null, ...roles: string[]): boolean {
  if (!user) return false
  return roles.map(r => r.toUpperCase()).includes(user.rol?.toUpperCase())
}