# Project Structure

Complete overview of the RTSP Livestream Overlay application architecture.

## Directory Tree

```
project/
│
├── backend/                          # Python Flask Backend
│   ├── app.py                       # Main Flask application with CRUD APIs
│   ├── requirements.txt             # Python dependencies
│   ├── stream_config.py            # RTSP streaming configuration
│   ├── .env.example                # Environment variables template
│   └── README.md                   # Backend-specific documentation
│
├── src/                             # React Frontend Source
│   ├── components/                 # React Components
│   │   ├── VideoPlayer.tsx        # Video player with controls
│   │   ├── DraggableOverlay.tsx   # Draggable & resizable overlay
│   │   └── ControlPanel.tsx       # Overlay management controls
│   │
│   ├── services/                   # API Services
│   │   └── api.ts                 # Backend API client
│   │
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # React entry point
│   ├── index.css                   # Global styles (Tailwind)
│   └── vite-env.d.ts              # Vite type definitions
│
├── public/                          # Static assets
│
├── dist/                            # Production build output (generated)
│
├── node_modules/                    # Frontend dependencies (generated)
│
├── index.html                       # HTML entry point
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.app.json               # App-specific TypeScript config
├── tsconfig.node.json              # Node-specific TypeScript config
├── eslint.config.js                # ESLint configuration
├── package.json                    # Frontend dependencies & scripts
│
├── README.md                        # Main documentation
├── QUICKSTART.md                   # Quick start guide
├── PROJECT_STRUCTURE.md            # This file
└── .gitignore                      # Git ignore rules
```

## Component Architecture

### Frontend (React + TypeScript)

```
┌─────────────────────────────────────────┐
│              App.tsx                    │
│  (Main application state & logic)      │
└─────────────────┬───────────────────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
┌────▼─────┐ ┌───▼──────┐ ┌──▼───────────┐
│ Video    │ │ Control  │ │ Draggable    │
│ Player   │ │ Panel    │ │ Overlay (N)  │
└──────────┘ └──────────┘ └──────────────┘
     │            │              │
     │            └──────┬───────┘
     │                   │
     │              ┌────▼─────┐
     └──────────────► API      │
                    │ Service  │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │  Flask   │
                    │  Backend │
                    └──────────┘
```

### Backend (Flask + Supabase)

```
┌──────────────────────────────────────┐
│         Flask Application            │
├──────────────────────────────────────┤
│  Routes:                             │
│  • GET    /overlays                  │
│  • POST   /overlays                  │
│  • PUT    /overlays/:id              │
│  • DELETE /overlays/:id              │
│  • GET    /health                    │
└────────────────┬─────────────────────┘
                 │
                 │  Client
                 │
        ┌────────▼────────┐
        │   Mongo DB      │
        │                 │
        ├─────────────────┤
        │ overlays table  │
        │  • id           │
        │  • type         │
        │  • content      │
        │  • position     │
        │  • size         │
        └─────────────────┘
```

## Data Flow

### Creating an Overlay

```
User Input (Control Panel)
         │
         ▼
   handleAddOverlay()
         │
         ▼
   overlayAPI.create()
         │
         ▼
   POST /overlays (Flask)
         │
         ▼
   Supabase Insert
         │
         ▼
   Return new overlay
         │
         ▼
   Update React state
         │
         ▼
   Render DraggableOverlay
```

### Updating an Overlay (Drag/Resize)

```
User drags/resizes overlay
         │
         ▼
   Draggable onStop event
         │
         ▼
   handleUpdateOverlay()
         │
         ▼
   overlayAPI.update()
         │
         ▼
   PUT /overlays/:id (Flask)
         │
         ▼
   Supabase Update
         │
         ▼
   Update React state
         │
         ▼
   Re-render overlay
```

## Technology Stack Details

### Frontend
- **React 18**: Component-based UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **react-draggable**: Drag and drop functionality
- **Lucide React**: Icon library

### Backend
- **Flask**: Lightweight Python web framework
- **flask-cors**: Cross-Origin Resource Sharing
- **Mongodb**:  database with APIs
- **python-dotenv**: Environment variable management

### Streaming
- **FFmpeg**: Video conversion (RTSP → HLS)
- **HLS**: HTTP Live Streaming protocol

## API Communication

All API calls use REST over HTTP with JSON payloads:

```
Frontend                    Backend
   │                          │
   ├─ GET /overlays ────────► │
   │◄──── JSON array ─────────┤
   │                          │
   ├─ POST /overlays ────────► │
   │  {type, content, ...}    │
   │◄──── Created overlay ────┤
   │                          │
   ├─ PUT /overlays/:id ─────► │
   │  {position, size, ...}   │
   │◄──── Updated overlay ────┤
   │                          │
   ├─ DELETE /overlays/:id ──► │
   │◄──── Success message ────┤
```

## Database Schema

```sql
overlays
├── id              uuid (PK)
├── type            text ('text' | 'image')
├── content         text
├── position        jsonb {x: number, y: number}
├── size            jsonb {width: number, height: number}
├── created_at      timestamptz
└── updated_at      timestamptz

Indexes:
  - overlays_type_idx (type)
  - overlays_created_at_idx (created_at DESC)

Security:
  - Row Level Security (RLS) enabled
  - Public read/write policies (demo mode)
```

## Key Features Implementation

### Drag and Drop
- Library: `react-draggable`
- Component: `DraggableOverlay.tsx`
- Updates position in database on drag stop

### Resize
- Custom implementation using mouse events
- Drag from bottom-right corner
- Min size: 100x50 pixels
- Updates size in database on resize complete

### Real-time Updates
- Changes immediately reflected in UI (optimistic updates)
- Background API call syncs with database
- Error handling with user feedback

### Video Player
- Native HTML5 video element
- Custom controls: Play/Pause, Volume
- Supports multiple formats (MP4, HLS)
- RTSP requires FFmpeg conversion

## Environment Configuration

### Backend (.env)
```env
mongodb url =

### Frontend (Vite)
Environment variables automatically loaded from `.env` files.
Access via `import.meta.env.VITE_*`

## Build Process

### Development
```bash
# Frontend hot reload
npm run dev → Vite dev server (port 5173)

# Backend hot reload
python app.py → Flask dev server (port 5000)
```

### Production
```bash
# Frontend
npm run build → Static files in dist/

# Backend
pip install gunicorn
gunicorn app:app → Production WSGI server
```

## Security Considerations

### Current Implementation (Development)
- Public API access (no authentication)
- CORS enabled for all origins
- Row Level Security with permissive policies

### Production Recommendations
- Add user authentication (JWT, OAuth)
- Restrict CORS to specific origins
- Implement proper RLS policies
- Add rate limiting
- Use HTTPS only
- Validate and sanitize all inputs
- Implement API key for backend access

## Performance Optimization

### Frontend
- React.memo for overlay components
- Debounce drag/resize updates
- Lazy loading for images
- Code splitting with Vite

### Backend
- Database connection pooling
- Query optimization with indexes
- Caching frequently accessed overlays
- Gzip compression for responses

### Streaming
- HLS adaptive bitrate streaming
- Low latency configuration
- CDN for stream delivery (production)

---

This document provides a complete overview of the application architecture.
For setup instructions, see [README.md](./README.md) 
