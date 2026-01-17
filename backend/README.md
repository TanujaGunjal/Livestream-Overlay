# RTSP Livestream Overlay Backend

Flask backend API for managing livestream overlays.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials

4. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### GET /overlays
Fetch all overlays

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "text",
    "content": "Hello World",
    "position": {"x": 100, "y": 50},
    "size": {"width": 200, "height": 100},
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

### POST /overlays
Create a new overlay

**Request Body:**
```json
{
  "type": "text",
  "content": "Sample Text",
  "position": {"x": 100, "y": 50},
  "size": {"width": 200, "height": 100}
}
```

### PUT /overlays/:id
Update an existing overlay

**Request Body:**
```json
{
  "content": "Updated Text",
  "position": {"x": 150, "y": 75}
}
```

### DELETE /overlays/:id
Delete an overlay

**Response:**
```json
{
  "message": "Overlay deleted successfully"
}
```

## RTSP to HLS Streaming

To stream RTSP video to the browser, you need to convert it to HLS format using FFmpeg.

### Option 1: Using FFmpeg directly

1. Install FFmpeg on your system
2. Edit `stream_config.py` and set your RTSP URL
3. Run the FFmpeg command:

```bash
mkdir -p hls_output
ffmpeg -rtsp_transport tcp -i YOUR_RTSP_URL \
  -c:v libx264 -preset veryfast -tune zerolatency \
  -c:a aac -b:a 128k \
  -f hls \
  -hls_time 2 \
  -hls_list_size 3 \
  -hls_flags delete_segments \
  hls_output/stream.m3u8
```

4. Serve the HLS output directory using Flask or a static file server

### Option 2: Using a streaming service

For production, consider using:
- MediaMTX (formerly rtsp-simple-server)
- Nginx with RTSP module
- Cloud streaming services (AWS MediaLive, etc.)

## Testing

You can test the API using curl:

```bash
# Create overlay
curl -X POST http://localhost:5000/overlays \
  -H "Content-Type: application/json" \
  -d '{"type":"text","content":"Test Overlay","position":{"x":100,"y":100},"size":{"width":200,"height":50}}'

# Get all overlays
curl http://localhost:5000/overlays

# Update overlay
curl -X PUT http://localhost:5000/overlays/OVERLAY_ID \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated Text"}'

# Delete overlay
curl -X DELETE http://localhost:5000/overlays/OVERLAY_ID
```
