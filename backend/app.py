from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from bson import json_util
import os
from datetime import datetime
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

app = Flask(__name__)
CORS(app)

mongo_client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/"))
db = mongo_client["overlay_db"]
overlays_collection = db["overlays"]

# RTSP to HLS conversion
running_streams = {}  # rtsp_url -> {'process': subprocess, 'output_dir': str, 'hls_url': str}


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/overlays', methods=['GET'])
def get_overlays():
    try:
        overlays = list(overlays_collection.find().sort('created_at', 1))
        for overlay in overlays:
            overlay['id'] = str(overlay['_id'])
            del overlay['_id']
        return jsonify(overlays), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/overlays', methods=['POST'])
def create_overlay():
    try:
        data = request.get_json()

        if not data.get('type') or not data.get('content'):
            return jsonify({'error': 'type and content are required'}), 400

        if data['type'] not in ['text', 'image']:
            return jsonify({'error': 'type must be either text or image'}), 400

        overlay = {
            'type': data['type'],
            'content': data['content'],
            'position': data.get('position', {'x': 0, 'y': 0}),
            'size': data.get('size', {'width': 200, 'height': 100}),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        result = overlays_collection.insert_one(overlay)

        # ✅ FIX RESPONSE FORMAT
        overlay_response = {
            'id': str(result.inserted_id),
            'type': overlay['type'],
            'content': overlay['content'],
            'position': overlay['position'],
            'size': overlay['size']
        }

        return jsonify(overlay_response), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    try:
        data = request.get_json()

        update_data = {}
        if 'type' in data:
            if data['type'] not in ['text', 'image']:
                return jsonify({'error': 'type must be either text or image'}), 400
            update_data['type'] = data['type']
        if 'content' in data:
            update_data['content'] = data['content']
        if 'position' in data:
            update_data['position'] = data['position']
        if 'size' in data:
            update_data['size'] = data['size']

        update_data['updated_at'] = datetime.utcnow()

        result = overlays_collection.update_one({'_id': ObjectId(overlay_id)}, {'$set': update_data})

        if result.matched_count == 0:
            return jsonify({'error': 'Overlay not found'}), 404

        overlay = overlays_collection.find_one({'_id': ObjectId(overlay_id)})
        overlay['id'] = str(overlay['_id'])
        del overlay['_id']
        return jsonify(overlay), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    try:
        overlays_collection.delete_one({'_id': ObjectId(overlay_id)})
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stream', methods=['POST'])
def create_stream():
    try:
        data = request.get_json()
        rtsp_url = data.get('rtsp_url')
        if not rtsp_url:
            return jsonify({'error': 'rtsp_url is required'}), 400

        if rtsp_url in running_streams:
            return jsonify({'hls_url': running_streams[rtsp_url]['hls_url']}), 200

        output_dir = tempfile.mkdtemp()
        hls_path = os.path.join(output_dir, 'stream.m3u8')

        # Start FFmpeg process
        cmd = [
            'ffmpeg',
            '-rtsp_transport', 'tcp',
            '-i', rtsp_url,
            '-c:v', 'libx264',
            '-preset', 'veryfast',
            '-tune', 'zerolatency',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-f', 'hls',
            '-hls_time', '2',
            '-hls_list_size', '3',
            '-hls_flags', 'delete_segments',
            hls_path
        ]

        process = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        hls_url = f'http://localhost:5000/hls/{os.path.basename(output_dir)}/stream.m3u8'

        running_streams[rtsp_url] = {
            'process': process,
            'output_dir': output_dir,
            'hls_url': hls_url
        }

        return jsonify({'hls_url': hls_url}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/hls/<path:filename>')
def serve_hls(filename):
    # filename is like tempdir/stream.m3u8 or tempdir/segment.ts
    parts = filename.split('/')
    if len(parts) < 2:
        return jsonify({'error': 'Invalid path'}), 400
    temp_dir = parts[0]
    file_path = '/'.join(parts[1:])
    # Find the output_dir that matches temp_dir
    for stream_info in running_streams.values():
        if os.path.basename(stream_info['output_dir']) == temp_dir:
            return send_from_directory(stream_info['output_dir'], file_path)
    return jsonify({'error': 'Stream not found'}), 404


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
