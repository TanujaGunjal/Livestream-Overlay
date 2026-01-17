import { useState } from 'react';
import { Plus, Type, Image as ImageIcon, Settings } from 'lucide-react';

interface ControlPanelProps {
  onAddOverlay: (type: 'text' | 'image', content: string) => void;
  streamUrl: string;
  onStreamUrlChange: (url: string) => void;
}

export default function ControlPanel({
  onAddOverlay,
  streamUrl,
  onStreamUrlChange,
}: ControlPanelProps) {
  const [showAddText, setShowAddText] = useState(false);
  const [showAddImage, setShowAddImage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tempStreamUrl, setTempStreamUrl] = useState(streamUrl);

  const handleAddText = () => {
    if (textContent.trim()) {
      onAddOverlay('text', textContent);
      setTextContent('');
      setShowAddText(false);
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      onAddOverlay('image', imageUrl);
      setImageUrl('');
      setShowAddImage(false);
    }
  };

  const handleUpdateStreamUrl = () => {
    onStreamUrlChange(tempStreamUrl);
    setShowSettings(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Control Panel</h2>

      <div className="space-y-3">
        <button
          onClick={() => {
            setShowAddText(!showAddText);
            setShowAddImage(false);
            setShowSettings(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          <Type className="w-5 h-5" />
          Add Text Overlay
        </button>

        {showAddText && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <input
              type="text"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter text content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddText}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddText(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setShowAddImage(!showAddImage);
            setShowAddText(false);
            setShowSettings(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          <ImageIcon className="w-5 h-5" />
          Add Image Overlay
        </button>

        {showAddImage && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddImage}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddImage(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setShowSettings(!showSettings);
            setShowAddText(false);
            setShowAddImage(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          <Settings className="w-5 h-5" />
          Stream Settings
        </button>

        {showSettings && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              RTSP Stream URL
            </label>
            <input
              type="text"
              value={tempStreamUrl}
              onChange={(e) => setTempStreamUrl(e.target.value)}
              placeholder="rtsp://your-stream-url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdateStreamUrl}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Update
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Instructions</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Click to add text or image overlays</li>
          <li>• Drag overlays to reposition them</li>
          <li>• Use the resize handle (bottom-right) to adjust size</li>
          <li>• Hover over overlays to see delete button</li>
        </ul>
      </div>
    </div>
  );
}
