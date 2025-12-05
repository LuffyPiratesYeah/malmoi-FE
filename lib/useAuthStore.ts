import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthUser {
    id: string;
    email?: string;
    name: string;
    userType: "student" | "teacher";
    isTeacher: boolean;
    profileImage?: string | null;
    verificationStatus?: "none" | "pending" | "verified";
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
    updateUser: (data: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user) =>
                set({
                    user,
                    isAuthenticated: true,
                }),
            logout: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                }),
            updateUser: (data) =>
                set((state) =>
                    state.user
                        ? {
                            user: { ...state.user, ...data },
                            isAuthenticated: state.isAuthenticated,
                        }
                        : state
                ),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
