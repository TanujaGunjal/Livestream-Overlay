# RTSP Livestream Overlay Web Application

A full-stack web application for managing real-time overlays on RTSP livestreams. Built with React, Python Flask, and Supabase.

## Features

- **Video Streaming**: Display RTSP livestreams with HLS conversion support
- **Text Overlays**: Add customizable text overlays on the video
- **Image Overlays**: Add image/logo overlays via URL
- **Drag & Drop**: Move overlays by dragging them
- **Resizable Overlays**: Resize overlays using the bottom-right handle
- **Real-time Updates**: All overlay changes sync with the database instantly
- **CRUD API**: Full REST API for overlay management

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- react-draggable for drag-and-drop functionality
- Lucide React for icons
- Vite as build tool

**Backend:**
- Python Flask
- Supabase (PostgreSQL database)
- CORS enabled for cross-origin requests

**Database:**
- Supabase PostgreSQL with Row Level Security

## Project Structure

```
project/
├── backend/                 # Flask backend
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── stream_config.py    # RTSP streaming configuration
│   └── README.md           # Backend-specific documentation
├── src/                    # React frontend
│   ├── components/         # React components
│   │   ├── VideoPlayer.tsx
│   │   ├── DraggableOverlay.tsx
│   │   └── ControlPanel.tsx
│   ├── services/           # API services
│   │   └── api.ts
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- FFmpeg (for RTSP to HLS conversion)
- Supabase account (or use provided credentials)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv

   # On macOS/Linux:
   source venv/bin/activate

   # On Windows:
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**

   Create a `.env` file in the `backend` directory:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the Flask server:**
   ```bash
   python app.py
   ```

   The server will start at `http://localhost:5000`

### Frontend Setup

1. **Navigate to project root directory:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## How to Use

### Setting Up Your RTSP Stream

1. Click the **"Stream Settings"** button in the control panel
2. Enter your RTSP stream URL (e.g., `rtsp://your-camera-ip:554/stream`)
3. Click **"Update"** to apply

**Note:** RTSP streams need to be converted to HLS/MP4 format to work in browsers. See the [RTSP Streaming Guide](#rtsp-streaming-guide) below.

### Adding Overlays

#### Text Overlay
1. Click **"Add Text Overlay"**
2. Enter your text content
3. Click **"Add"**
4. The overlay will appear on the video

#### Image Overlay
1. Click **"Add Image Overlay"**
2. Enter an image URL (e.g., `https://example.com/logo.png`)
3. Click **"Add"**
4. The image will appear on the video

### Managing Overlays

- **Move**: Drag the overlay by clicking and dragging the grip handle (top-left)
- **Resize**: Drag the blue square in the bottom-right corner
- **Delete**: Hover over the overlay and click the red trash icon
- **View All**: Check the "Active Overlays" panel to see all overlays

## RTSP Streaming Guide

RTSP streams cannot be played directly in web browsers. You need to convert them to HLS or WebRTC format.

### Option 1: Using FFmpeg (Recommended for testing)

1. **Install FFmpeg:**
   ```bash
   # macOS
   brew install ffmpeg

   # Ubuntu/Debian
   sudo apt-get install ffmpeg

   # Windows - Download from https://ffmpeg.org/download.html
   ```

2. **Create output directory:**
   ```bash
   mkdir hls_output
   ```

3. **Run FFmpeg conversion:**
   ```bash
   ffmpeg -rtsp_transport tcp -i rtsp://YOUR_RTSP_URL \
     -c:v libx264 -preset veryfast -tune zerolatency \
     -c:a aac -b:a 128k \
     -f hls \
     -hls_time 2 \
     -hls_list_size 3 \
     -hls_flags delete_segments \
     hls_output/stream.m3u8
   ```

4. **Serve the HLS stream:**

   Add this to your Flask `app.py`:
   ```python
   from flask import send_from_directory

   @app.route('/hls/<path:filename>')
   def serve_hls(filename):
       return send_from_directory('hls_output', filename)
   ```

5. **Update the stream URL in the frontend:**
   ```
   http://localhost:5000/hls/stream.m3u8
   ```

### Option 2: Using MediaMTX (Production)

MediaMTX is a real-time media server that can convert RTSP to HLS/WebRTC:

1. Download from [https://github.com/bluenviron/mediamtx](https://github.com/bluenviron/mediamtx)
2. Configure your RTSP source
3. Access the HLS stream at `http://localhost:8888/stream/index.m3u8`

### Option 3: Test with Sample Video

For testing without an RTSP source, the app uses a sample video by default:
```
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

## API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### GET /overlays
Fetch all overlays

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "text",
    "content": "Breaking News",
    "position": { "x": 100, "y": 50 },
    "size": { "width": 200, "height": 100 },
    "created_at": "2024-01-16T10:30:00Z",
    "updated_at": "2024-01-16T10:30:00Z"
  }
]
```

#### POST /overlays
Create a new overlay

**Request Body:**
```json
{
  "type": "text",
  "content": "Sample Text",
  "position": { "x": 100, "y": 50 },
  "size": { "width": 200, "height": 100 }
}
```

**Response:** Returns the created overlay object

#### PUT /overlays/:id
Update an existing overlay

**Request Body:**
```json
{
  "content": "Updated Text",
  "position": { "x": 150, "y": 75 }
}
```

**Response:** Returns the updated overlay object

#### DELETE /overlays/:id
Delete an overlay

**Response:**
```json
{
  "message": "Overlay deleted successfully"
}
```

## Database Schema

The application uses a MongoDB database with the following collection:

**overlays collection:**
```json
{
  "_id": ObjectId,
  "type": "text" | "image",
  "content": "string",
  "position": {"x": number, "y": number},
  "size": {"width": number, "height": number},
  "created_at": Date,
  "updated_at": Date
}
```

## Development

### Running Tests
```bash
npm run lint
npm run typecheck
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```



## License

MIT

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the backend and frontend READMEs
3. Ensure all dependencies are installed correctly
4. Verify environment variables are set properly

---

Built with React, Flask, and Supabase
