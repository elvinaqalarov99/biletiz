import { create } from "zustand";

interface AnimationStore {
  isAnimationReady: boolean;
  setIsAnimationReady: (isAnimationReady: boolean) => void;
}

export const useAnimationStore = create<AnimationStore>()((set) => ({
  isAnimationReady: false,
  setIsAnimationReady: (isAnimationReady: boolean) => set({ isAnimationReady }),
}));
