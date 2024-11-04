import { create } from "zustand";
import { UserData } from "../types/user";

interface UserStore {
  users: UserData[];
  currentUser: UserData | null;
  loading: boolean;
  error: string | null;

  // CRUD operations
  setUsers: (users: UserData[]) => void;
  addUser: (user: UserData) => void;
  updateUser: (uuid: string, user: UserData) => void;
  deleteUser: (uuid: string) => void;

  // Current user operations
  setCurrentUser: (user: UserData | null) => void;
  updateCurrentUser: (userData: Partial<UserData>) => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Helper functions
  getUserByUuid: (uuid: string) => UserData | undefined;
  getUsersByRole: (role: string) => UserData[];
  clearUserStore: () => void;
}

// Helper function for safe string comparison
const safeCompare = (
  a: string | null | undefined,
  b: string | null | undefined
): number => {
  // Handle null/undefined cases
  if (a === null || a === undefined)
    return b === null || b === undefined ? 0 : 1;
  if (b === null || b === undefined) return -1;
  return a.localeCompare(b);
};

// Helper function for user sorting
const sortUsers = (a: UserData, b: UserData): number => {
  const lastNameComparison = safeCompare(a.last_name, b.last_name);
  if (lastNameComparison !== 0) return lastNameComparison;
  return safeCompare(a.name, b.name);
};

export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  users: [],
  currentUser: null,
  loading: false,
  error: null,

  // CRUD operations
  setUsers: (users) =>
    set({
      users: [...users].sort(sortUsers),
    }),

  addUser: (user) =>
    set((state) => ({
      users: [user, ...state.users].sort(sortUsers),
    })),

  updateUser: (uuid, updatedUser) =>
    set((state) => {
      const updatedUsers = state.users.map((user) =>
        user.uuid === uuid ? { ...user, ...updatedUser } : user
      );

      return {
        users: updatedUsers.sort(sortUsers),
        currentUser:
          state.currentUser?.uuid === uuid
            ? { ...state.currentUser, ...updatedUser }
            : state.currentUser,
      };
    }),

  deleteUser: (uuid) =>
    set((state) => ({
      users: state.users.filter((user) => user.uuid !== uuid),
      currentUser: state.currentUser?.uuid === uuid ? null : state.currentUser,
    })),

  // Current user operations
  setCurrentUser: (user) => set({ currentUser: user }),

  updateCurrentUser: (userData) =>
    set((state) => {
      if (!state.currentUser) return state;

      const updatedCurrentUser = {
        ...state.currentUser,
        ...userData,
      };

      const updatedUsers = state.users
        .map((user) =>
          user.uuid === state.currentUser?.uuid ? updatedCurrentUser : user
        )
        .sort(sortUsers);

      return {
        currentUser: updatedCurrentUser,
        users: updatedUsers,
      };
    }),

  // State management
  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  // Helper functions
  getUserByUuid: (uuid) => {
    const { users } = get();
    return users.find((user) => user.uuid === uuid);
  },

  getUsersByRole: (user_role) => {
    const { users } = get();
    return users.filter((user) => user.user_role === user_role).sort(sortUsers);
  },

  clearUserStore: () =>
    set({
      users: [],
      currentUser: null,
      loading: false,
      error: null,
    }),
}));
