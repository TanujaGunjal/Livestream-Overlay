import { useEffect, useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import DraggableOverlay from './components/DraggableOverlay';
import ControlPanel from './components/ControlPanel';
import { overlayAPI, Overlay } from './services/api';
import { AlertCircle } from 'lucide-react';

function App() {
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOverlays();
  }, []);

  const loadOverlays = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await overlayAPI.getAll();
      setOverlays(data);
    } catch (err) {
      setError('Failed to load overlays. Make sure the backend server is running.');
      console.error('Error loading overlays:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOverlay = async (type: 'text' | 'image', content: string) => {
    try {
      const newOverlay = await overlayAPI.create({
        type,
        content,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 100 },
      });
      setOverlays([...overlays, newOverlay]);
    } catch (err) {
      setError('Failed to add overlay');
      console.error('Error adding overlay:', err);
    }
  };

  const handleUpdateOverlay = async (id: string, updates: Partial<Overlay>) => {
    try {
      await overlayAPI.update(id, updates);
      setOverlays(
        overlays.map((overlay) =>
          overlay.id === id ? { ...overlay, ...updates } : overlay
        )
      );
    } catch (err) {
      setError('Failed to update overlay');
      console.error('Error updating overlay:', err);
    }
  };

  const handleDeleteOverlay = async (id: string) => {
    try {
      await overlayAPI.delete(id);
      setOverlays(overlays.filter((overlay) => overlay.id !== id));
    } catch (err) {
      setError('Failed to delete overlay');
      console.error('Error deleting overlay:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            RTSP Livestream Overlay Manager
          </h1>
          <p className="text-slate-300">
            Add and manage real-time overlays on your livestream
          </p>
        </header>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative">
              <VideoPlayer
                streamUrl={
                  streamUrl ||
                  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
                }
              />

              <div className="absolute inset-0 pointer-events-none">
                <div className="relative w-full h-full pointer-events-auto">
                  {overlays.map((overlay) => (
                    <DraggableOverlay
                      key={overlay.id}
                      overlay={overlay}
                      onUpdate={handleUpdateOverlay}
                      onDelete={handleDeleteOverlay}
                    />
                  ))}
                </div>
              </div>
            </div>

            {loading && (
              <div className="mt-4 text-center text-slate-400">
                Loading overlays...
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <ControlPanel
              onAddOverlay={handleAddOverlay}
              streamUrl={streamUrl}
              onStreamUrlChange={setStreamUrl}
            />

            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Active Overlays ({overlays.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {overlays.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No overlays yet. Add one to get started!
                  </p>
                ) : (
                  overlays.map((overlay) => (
                    <div
                      key={overlay.id}
                      className="bg-gray-50 rounded-lg p-3 text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-700 capitalize">
                          {overlay.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {overlay.size.width} × {overlay.size.height}
                        </span>
                      </div>
                      <div className="text-gray-600 truncate">
                        {overlay.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
