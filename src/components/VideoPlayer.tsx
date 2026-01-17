import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

declare global {
  interface Window {
    Hls: typeof Hls;
  }
}

interface VideoPlayerProps {
  streamUrl: string;
}

export default function VideoPlayer({ streamUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    console.log('VideoPlayer: Initializing video with URL:', streamUrl);

    const handlePlay = () => {
      console.log('VideoPlayer: Play event');
      setIsPlaying(true);
    };
    const handlePause = () => {
      console.log('VideoPlayer: Pause event');
      setIsPlaying(false);
    };
    const handleLoadedData = () => {
      console.log('VideoPlayer: Loaded data');
      video.volume = volume;
      video.muted = isMuted;
    };
    const handleError = (e: Event) => {
      console.error('VideoPlayer: Video error', e);
    };
    const handleLoadStart = () => {
      console.log('VideoPlayer: Load start');
    };
    const handleCanPlay = () => {
      console.log('VideoPlayer: Can play');
    };
    const handleWaiting = () => {
      console.log('VideoPlayer: Waiting');
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);

    if (Hls.isSupported() && streamUrl.endsWith('.m3u8')) {
      console.log('Using HLS for stream');
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed');
        video.volume = volume;
        video.muted = isMuted;
        const onCanPlay = () => {
          video.play().catch(e => {
            console.error('Autoplay failed:', e);
          });
          video.removeEventListener('canplay', onCanPlay);
        };
        video.addEventListener('canplay', onCanPlay);
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
      });
      return () => {
        hls.destroy();
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('waiting', handleWaiting);
      };
    } else {
      console.log('Using native video for stream');
      video.src = streamUrl;
      video.volume = volume;
      video.muted = isMuted;
      video.addEventListener('loadeddata', () => {
        video.play().catch(e => {
          console.error('Autoplay failed for native video:', e);
        });
      });
      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('waiting', handleWaiting);
      };
    }
  }, [streamUrl, isMuted, volume]);

  const togglePlay = () => {
    console.log('togglePlay called, isPlaying:', isPlaying);
    if (!videoRef.current) {
      console.log('No video ref');
      return;
    }
    if (isPlaying) {
      console.log('Pausing video');
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      console.log('Playing video');
      setIsPlaying(true);
      if (videoRef.current.readyState >= 2) {
        videoRef.current.volume = volume;
        videoRef.current.muted = isMuted;
        videoRef.current.play().catch(e => {
          console.error('Play failed:', e);
          setIsPlaying(false);
        });
      } else {
        console.log('Video not ready, waiting for canplay');
        const onCanPlay = () => {
          if (videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted;
            videoRef.current.play().catch(e => {
              console.error('Play failed after canplay:', e);
              setIsPlaying(false);
            });
            videoRef.current.removeEventListener('canplay', onCanPlay);
          }
        };
        videoRef.current.addEventListener('canplay', onCanPlay);
      }
    }
  };

  const toggleMute = () => {
    console.log('toggleMute called, isMuted:', isMuted);
    if (!videoRef.current) {
      console.log('No video ref');
      return;
    }
    const newMuted = !isMuted;
    console.log('Setting muted to:', newMuted);
    videoRef.current.muted = newMuted;
    videoRef.current.volume = volume;
    setIsMuted(newMuted);
    // If unmuting and not playing, try to play
    if (!newMuted && !isPlaying) {
      console.log('Unmuting and not playing, trying to play');
      videoRef.current.play().catch(e => {
        console.error('Play failed after unmute:', e);
        setIsPlaying(false);
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    console.log('handleVolumeChange called, newVolume:', newVolume);
    setVolume(newVolume);
    if (videoRef.current) {
      console.log('Setting video volume to:', newVolume);
      videoRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        console.log('Unmuting because volume > 0');
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden min-h-64">
      <video
        ref={videoRef}
        className="w-full h-auto"
        controls={false}
        crossOrigin="anonymous"
        preload="metadata"
        poster="https://via.placeholder.com/640x360/000000/FFFFFF?text=Video+Loading..."
      />

      <div className="absolute bottom-4 left-4 flex gap-3 items-center bg-black bg-opacity-50 p-2 rounded">
        <button
          onClick={togglePlay}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded text-white"
          style={{ backgroundColor: 'transparent', border: 'none' }}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={toggleMute}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded text-white"
          style={{ backgroundColor: 'transparent', border: 'none' }}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-32 h-4 bg-blue-200 rounded-lg cursor-pointer"
          style={{ accentColor: '#3b82f6' }}
        />
      </div>

      <div className="absolute top-4 left-4 text-white text-sm">
        Status: {isPlaying ? 'Playing' : 'Paused'} | Volume: {Math.round(volume * 100)}% | Muted: {isMuted ? 'Yes' : 'No'}
      </div>
    </div>
  );
}
