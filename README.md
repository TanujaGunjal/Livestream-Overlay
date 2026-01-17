
# RTSP Livestream Overlay Web Application

A full-stack web application that plays a livestream video and allows users to create, manage, and display real-time text and image overlays on top of the video.

Built using **React**, **Python Flask**, and **MongoDB**.

---

## 🚀 Features

* **Livestream Playback**

  * RTSP-compatible livestream playback (via HLS conversion)
  * Play, Pause, and Volume controls
* **Overlay Management**

  * Add text overlays
  * Add image/logo overlays using image URLs
  * Drag-and-drop overlays anywhere on the video
  * Resize overlays using a resize handle
  * Delete overlays instantly
* **Real-time Updates**

  * Overlay changes are reflected immediately on the video
* **CRUD REST APIs**

  * Create, Read, Update, Delete overlays using Flask APIs
* **Persistent Storage**

  * Overlay data stored in MongoDB

---

## 🛠 Tech Stack

### Frontend

* React 18 (TypeScript)
* Vite
* Tailwind CSS
* react-draggable
* hls.js (for HLS livestream playback)
* Lucide React Icons

### Backend

* Python Flask
* Flask-CORS
* MongoDB (via PyMongo)

### Database

* MongoDB (Local or Atlas)

---

## 📁 Project Structure

```
LiveSetters/
├── backend/                 # Flask backend
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variable template
│
├── src/                    # React frontend
│   ├── components/
│   │   ├── VideoPlayer.tsx
│   │   ├── DraggableOverlay.tsx
│   │   └── ControlPanel.tsx
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── README.md
└── .gitignore
```

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js (v18+)
* Python (v3.8+)
* MongoDB (local or MongoDB Atlas)
* FFmpeg (optional – for RTSP → HLS conversion)

---

## 🔧 Backend Setup (Flask + MongoDB)

1. Navigate to backend directory:

```bash
cd backend
```

2. Create and activate virtual environment:

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/overlay_db
```

> ⚠️ Do NOT commit `.env` to GitHub.

5. Run Flask server:

```bash
python app.py
```

Backend runs at:

```
http://localhost:5000
```

---

## 🎨 Frontend Setup (React)

1. Go to project root:

```bash
cd ..
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## ▶️ Using the Application

### Livestream Playback

* The app uses an **HLS stream** for browser compatibility.
* Default demo stream is preconfigured.
* Play, pause, and volume controls are available.

### Adding Overlays

* Click **Add Text Overlay** → enter text → Add
* Click **Add Image Overlay** → enter image URL → Add

### Managing Overlays

* **Move**: Drag the overlay
* **Resize**: Use bottom-right resize handle
* **Delete**: Hover and click delete icon

All changes update in real time.

## 📜 License

MIT License

---

## 👤 Author

**Tanuja**
Internship Assignment – RTSP Livestream Overlay Web Application

