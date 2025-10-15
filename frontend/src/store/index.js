import { create } from "zustand";
import { createAuthSlice } from "./auth-slice";

export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a)
}))