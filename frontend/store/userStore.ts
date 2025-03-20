import { User } from "@/interfaces/user";
import { apiService } from "@/utils/apiService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const response = await apiService.getAxiosInstance().post("auth/me");

          if (response.data.statusCode !== 200)
            throw new Error("Failed to fetch user");
          console.log(response.data);
          const data: User = response.data.user;
          set({ user: data, isLoading: false });
        } catch (error) {
          console.error("Error fetching user:", error);
          set({ user: null, isLoading: false });
        }
      },

      setUser: (user: User) => set({ user }),

      logout: async () => {
        set({ user: null, isLoading: true });
        try {
          await apiService.getAxiosInstance().post("/auth/logout");
        } catch (error) {
          console.error(error);
        }
        set({ isLoading: false });
      },
    }),
    { name: "user-storage" }, // Persist user data in localStorage
  ),
);
