import { create } from "zustand";

interface ModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}));

interface LoginStore {
    isLoggedIn: boolean;
    onLogin: () => void;
    onLogout: () => void;
}

export const useLogin = create<LoginStore>((set) => ({
    isLoggedIn: false,
    onLogin: () => set({ isLoggedIn: true }),
    onLogout: () => set({ isLoggedIn: false })
}));

interface AdminStore {
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
}

export const useAdmin = create<AdminStore>((set) => ({
    isAdmin: false,
    setIsAdmin: (value) => set({ isAdmin: value })
}))