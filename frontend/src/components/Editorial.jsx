import { useState, useRef, useEffect } from "react";
import { Pause, Play } from "lucide-react";

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    }
  }, []);

  return (
    <div
      className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl border border-base-300 bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video cursor-pointer bg-black"
      />

      {/* Controls */}
      <div
        className={`absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-200 ${
          isHovering || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top row */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-content hover:scale-105 transition"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <span className="text-xs font-medium text-white/80">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Progress */}
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => {
            if (videoRef.current) {
              videoRef.current.currentTime = Number(e.target.value);
            }
          }}
          className="range range-primary range-xs w-full"
        />
      </div>
    </div>
  );
};

export default Editorial;
