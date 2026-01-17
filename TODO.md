# TODO List for RTSP Livestream Overlay Web Application

## Completed Tasks
- [x] Implement CRUD APIs for overlays (backend/app.py)
- [x] Build React frontend with VideoPlayer, DraggableOverlay, ControlPanel
- [x] Add drag-and-drop and resize functionality for overlays
- [x] Integrate MongoDB for data persistence
- [x] Add RTSP to HLS conversion using FFmpeg (backend/app.py)
- [x] Update frontend to handle RTSP URLs via API
- [x] Fix bugs in overlay management (use overlay.id instead of overlay._id)
- [x] Update README.md to reflect MongoDB instead of Supabase
- [x] Add API documentation for stream endpoint

## Remaining Tasks
- [x] Set up MongoDB connection (added default local MongoDB URI)
- [ ] Install FFmpeg on the system for RTSP conversion
- [ ] Install MongoDB locally or use cloud MongoDB
- [ ] Test backend APIs using curl or Postman
- [ ] Test frontend overlay functionality
- [ ] Test RTSP stream conversion (use a test RTSP URL)
- [ ] Create demo video showing all features
- [ ] Update README with any final setup instructions
