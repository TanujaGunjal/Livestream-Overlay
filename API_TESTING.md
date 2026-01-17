# API Testing Guide

Test the RTSP Livestream Overlay API using curl, Postman, or other HTTP clients.

## Base URL

```
http://localhost:5000
```

## Testing with curl

### 1. Health Check

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "healthy"
}
```

---

### 2. Get All Overlays

```bash
curl http://localhost:5000/overlays
```

**Expected Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "text",
    "content": "Breaking News",
    "position": {"x": 100, "y": 50},
    "size": {"width": 200, "height": 100},
    "created_at": "2024-01-16T10:30:00Z",
    "updated_at": "2024-01-16T10:30:00Z"
  }
]
```

---

### 3. Create Text Overlay

```bash
curl -X POST http://localhost:5000/overlays \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "content": "Live Breaking News",
    "position": {"x": 100, "y": 100},
    "size": {"width": 250, "height": 80}
  }'
```

**Expected Response:**
```json
{
  "id": "generated-uuid-here",
  "type": "text",
  "content": "Live Breaking News",
  "position": {"x": 100, "y": 100},
  "size": {"width": 250, "height": 80},
  "created_at": "2024-01-16T10:35:00Z",
  "updated_at": "2024-01-16T10:35:00Z"
}
```

---

### 4. Create Image Overlay

```bash
curl -X POST http://localhost:5000/overlays \
  -H "Content-Type: application/json" \
  -d '{
    "type": "image",
    "content": "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200",
    "position": {"x": 50, "y": 50},
    "size": {"width": 150, "height": 150}
  }'
```

**Expected Response:**
```json
{
  "id": "generated-uuid-here",
  "type": "image",
  "content": "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200",
  "position": {"x": 50, "y": 50},
  "size": {"width": 150, "height": 150},
  "created_at": "2024-01-16T10:40:00Z",
  "updated_at": "2024-01-16T10:40:00Z"
}
```

---

### 5. Update Overlay Position

Replace `OVERLAY_ID` with the actual ID from the create response:

```bash
curl -X PUT http://localhost:5000/overlays/OVERLAY_ID \
  -H "Content-Type: application/json" \
  -d '{
    "position": {"x": 200, "y": 150}
  }'
```

**Expected Response:**
```json
{
  "id": "OVERLAY_ID",
  "type": "text",
  "content": "Live Breaking News",
  "position": {"x": 200, "y": 150},
  "size": {"width": 250, "height": 80},
  "created_at": "2024-01-16T10:35:00Z",
  "updated_at": "2024-01-16T10:45:00Z"
}
```

---

### 6. Update Overlay Size

```bash
curl -X PUT http://localhost:5000/overlays/OVERLAY_ID \
  -H "Content-Type: application/json" \
  -d '{
    "size": {"width": 300, "height": 100}
  }'
```

---

### 7. Update Overlay Content

```bash
curl -X PUT http://localhost:5000/overlays/OVERLAY_ID \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated Breaking News"
  }'
```

---

### 8. Update Multiple Fields

```bash
curl -X PUT http://localhost:5000/overlays/OVERLAY_ID \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Final News Update",
    "position": {"x": 300, "y": 200},
    "size": {"width": 350, "height": 120}
  }'
```

---

### 9. Delete Overlay

```bash
curl -X DELETE http://localhost:5000/overlays/OVERLAY_ID
```

**Expected Response:**
```json
{
  "message": "Overlay deleted successfully"
}
```

---

## Testing with JavaScript (Browser Console)

Open your browser's developer console and run:

```javascript
// Get all overlays
fetch('http://localhost:5000/overlays')
  .then(res => res.json())
  .then(data => console.log(data));

// Create text overlay
fetch('http://localhost:5000/overlays', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    type: 'text',
    content: 'Test from Browser',
    position: {x: 100, y: 100},
    size: {width: 200, height: 100}
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Update overlay (replace OVERLAY_ID)
fetch('http://localhost:5000/overlays/OVERLAY_ID', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    position: {x: 150, y: 150}
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Delete overlay (replace OVERLAY_ID)
fetch('http://localhost:5000/overlays/OVERLAY_ID', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Testing with Python

```python
import requests
import json

BASE_URL = 'http://localhost:5000'

# Get all overlays
response = requests.get(f'{BASE_URL}/overlays')
print(response.json())

# Create overlay
overlay_data = {
    'type': 'text',
    'content': 'Python Test',
    'position': {'x': 100, 'y': 100},
    'size': {'width': 200, 'height': 100}
}
response = requests.post(f'{BASE_URL}/overlays', json=overlay_data)
created_overlay = response.json()
print(created_overlay)

# Update overlay
overlay_id = created_overlay['id']
update_data = {'position': {'x': 150, 'y': 150}}
response = requests.put(f'{BASE_URL}/overlays/{overlay_id}', json=update_data)
print(response.json())

# Delete overlay
response = requests.delete(f'{BASE_URL}/overlays/{overlay_id}')
print(response.json())
```

---

## Postman Collection

### Import into Postman

Create a new collection with these requests:

**Collection: RTSP Overlay API**

1. **Health Check**
   - Method: GET
   - URL: `{{base_url}}/health`

2. **Get All Overlays**
   - Method: GET
   - URL: `{{base_url}}/overlays`

3. **Create Text Overlay**
   - Method: POST
   - URL: `{{base_url}}/overlays`
   - Body (JSON):
     ```json
     {
       "type": "text",
       "content": "Sample Text",
       "position": {"x": 100, "y": 100},
       "size": {"width": 200, "height": 100}
     }
     ```

4. **Create Image Overlay**
   - Method: POST
   - URL: `{{base_url}}/overlays`
   - Body (JSON):
     ```json
     {
       "type": "image",
       "content": "https://example.com/image.png",
       "position": {"x": 50, "y": 50},
       "size": {"width": 150, "height": 150}
     }
     ```

5. **Update Overlay**
   - Method: PUT
   - URL: `{{base_url}}/overlays/{{overlay_id}}`
   - Body (JSON):
     ```json
     {
       "position": {"x": 200, "y": 150}
     }
     ```

6. **Delete Overlay**
   - Method: DELETE
   - URL: `{{base_url}}/overlays/{{overlay_id}}`

**Environment Variables:**
- `base_url`: `http://localhost:5000`
- `overlay_id`: (set after creating an overlay)

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "type and content are required"
}
```

### 404 Not Found
```json
{
  "error": "Overlay not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database connection failed"
}
```

---

## Validation Rules

### Type Field
- **Required**: Yes
- **Type**: string
- **Values**: "text" or "image"
- **Error**: "type must be either text or image"

### Content Field
- **Required**: Yes
- **Type**: string
- **Min Length**: 1
- **Error**: "type and content are required"

### Position Object
- **Required**: No (defaults to {x: 0, y: 0})
- **Type**: object
- **Properties**:
  - `x`: number
  - `y`: number

### Size Object
- **Required**: No (defaults to {width: 200, height: 100})
- **Type**: object
- **Properties**:
  - `width`: number (min: 100)
  - `height`: number (min: 50)

---

## Quick Test Script

Save this as `test_api.sh` and run `bash test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "=== Testing API ==="

echo -e "\n1. Health Check:"
curl -s $BASE_URL/health | jq

echo -e "\n2. Creating text overlay:"
RESPONSE=$(curl -s -X POST $BASE_URL/overlays \
  -H "Content-Type: application/json" \
  -d '{"type":"text","content":"Test Overlay","position":{"x":100,"y":100},"size":{"width":200,"height":100}}')
echo $RESPONSE | jq
OVERLAY_ID=$(echo $RESPONSE | jq -r '.id')

echo -e "\n3. Getting all overlays:"
curl -s $BASE_URL/overlays | jq

echo -e "\n4. Updating overlay:"
curl -s -X PUT $BASE_URL/overlays/$OVERLAY_ID \
  -H "Content-Type: application/json" \
  -d '{"position":{"x":150,"y":150}}' | jq

echo -e "\n5. Deleting overlay:"
curl -s -X DELETE $BASE_URL/overlays/$OVERLAY_ID | jq

echo -e "\n=== Test Complete ==="
```

---

## Troubleshooting

**Connection Refused**
- Ensure Flask server is running: `python backend/app.py`
- Check port 5000 is not in use: `lsof -i :5000`

**CORS Errors**
- Verify flask-cors is installed: `pip install flask-cors`
- Check CORS is enabled in app.py

**404 Errors**
- Verify the endpoint URL is correct
- Check Flask routes are registered: Look for route logs in terminal

**500 Errors**
- Check Supabase credentials in `.env`
- Verify database connection
- Check Flask terminal for error logs

---

For more information, see [README.md](./README.md)
