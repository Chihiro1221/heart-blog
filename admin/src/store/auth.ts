import { getProfile } from "@/apis/authApi"
import { RoleDocument } from "@/apis/roleApi"
import { defineStore } from "pinia"
export interface UserProfile {
  _id: string
  username: string
  nickname: string
  avatar?: string
  description?: string
  qq?: string
  email?: string
  role?: RoleDocument
  createdAt: string
  updatedAt: string
}
export const authStore = defineStore("auth", {
  state() {
    return {
      profile: {} as UserProfile,
    }
  },
  actions: {
    async getProfile(token: string) {
      if (token) {
        const { result } = await getProfile()
        this.profile = result
      }
    },
  },
})
