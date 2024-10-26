// zustand/useAuthUpdate.ts
import { create, StateCreator } from "zustand";
import { UserData } from "../../app/types/user";
interface AuthUpdate {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  updateUser: (userData: Partial<UserData>) => void;
}

export const useAuthUpdate = create<AuthUpdate>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (userData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),
}));
