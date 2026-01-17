RTSP_URL = "rtsp://your-rtsp-stream-url"

HLS_OUTPUT_DIR = "./hls_output"

FFMPEG_COMMAND_TEMPLATE = """
ffmpeg -rtsp_transport tcp -i {rtsp_url} \
  -c:v libx264 -preset veryfast -tune zerolatency \
  -c:a aac -b:a 128k \
  -f hls \
  -hls_time 2 \
  -hls_list_size 3 \
  -hls_flags delete_segments \
  {output_path}/stream.m3u8
""".strip()
