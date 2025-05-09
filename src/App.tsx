import React from 'react';
import { ImageViewer } from './components/ImageViewer';
import { Panel } from './components/Panel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useStore } from './store';

function App() {
  const { isLoading } = useStore();
  
  const imageUrl = "https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg";

  return (
    <div className="min-h-screen bg-[#F5EAD6] flex items-center justify-center">
      <div className="relative w-full h-screen">
        <ImageViewer imageUrl={imageUrl} />
        <Panel />
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
}

export default App;