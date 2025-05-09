import create from 'zustand';

interface ImageState {
  scale: number;
  minScale: number;
  position: { x: number; y: number };
  isDragging: boolean;
}

interface StoreState {
  imageState: ImageState;
  setImageState: (partialState: Partial<ImageState>) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  imageState: {
    scale: 1,
    minScale: 1,
    position: { x: 0, y: 0 },
    isDragging: false,
  },
  setImageState: (partialState) => set((state) => ({ imageState: { ...state.imageState, ...partialState } })),
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));