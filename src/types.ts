export interface ImageState {
  scale: number;
  position: { x: number; y: number };
  isDragging: boolean;
}

export interface AppState {
  imageState: ImageState;
  isPanelOpen: boolean;
  isLoading: boolean;
  setImageState: (state: Partial<ImageState>) => void;
  togglePanel: () => void;
  setLoading: (loading: boolean) => void;
}