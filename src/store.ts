import { create } from 'zustand';
import { AppState, ImageState } from './types';

const initialImageState: ImageState = {
  scale: 1,
  minScale: 1,
  position: { x: 0, y: 0 },
  isDragging: false,
};

export const useStore = create<AppState>((set) => ({
  imageState: initialImageState,
  isPanelOpen: false,
  isLoading: true,
  setImageState: (state) =>
    set((prev) => ({
      imageState: { ...prev.imageState, ...state },
    })),
  togglePanel: () =>
    set((prev) => ({
      isPanelOpen: !prev.isPanelOpen,
    })),
  setLoading: (loading) =>
    set(() => ({
      isLoading: loading,
    })),
}));