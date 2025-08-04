"use client";
import { useState, useRef, useEffect } from "react";
import { AudioTrack } from "@/types/audio";
import { Icon } from "@iconify/react";
import playIcon from "@iconify-icons/mdi/play";
import pauseIcon from "@iconify-icons/mdi/pause";
import skipNext from "@iconify-icons/mdi/skip-next";
import skipPrevious from "@iconify-icons/mdi/skip-previous";
import volumeIcon from "@iconify-icons/mdi/volume";
import volumeOffIcon from "@iconify-icons/mdi/volume-off";

export default function AudioPlayer({
  audioFiles,
}: {
  audioFiles: AudioTrack[];
}) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = audioFiles[currentTrackIndex];

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [prevVolume, setPrevVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    if (muted) {
      setVolume(prevVolume);
      if (audioRef.current) audioRef.current.volume = prevVolume;
      setMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
      setMuted(true);
    }
  };

  // Auto play when track changes and isPlaying is true
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, isPlaying]);

  const play = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const next = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % audioFiles.length);
  };

  const prev = () => {
    setCurrentTrackIndex((prev) =>
      prev === 0 ? audioFiles.length - 1 : prev - 1
    );
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setProgress(newTime);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-neutral-900 p-6 rounded-lg shadow-lg text-white max-w-3xl mx-auto box-shadow-hard">
      <div className="text-center mb-4">
        <h3 className="text-3xl md:text-5xl font-bold">
          {currentTrack.songName}
        </h3>
        <p className="text-xl text-gray-400">{currentTrack.artistName}</p>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            audioRef.current.volume = volume;
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
        }}
        src={currentTrack.audioUrl}
      />

      <div className="flex items-center gap-2 w-full">
        {/* Start Time */}
        <span className="text-lg text-gray-400 w-10 text-right">
          {formatTime(progress)}
        </span>

        {/* Progress Bar Wrapper */}
        <div className="relative w-full h-2 rounded bg-gray-600">
          {/* Filled Progress */}
          <div
            className="absolute h-2 bg-[var(--primary)] rounded"
            style={{ width: `${(progress / duration) * 100}%` }}
          />
          {/* Range Input on Top */}
          <input
            type="range"
            min={0}
            max={duration}
            value={progress}
            step={0.01}
            onChange={handleChange}
            className="absolute top-[-6px] left-0 w-full h-4 opacity-0 cursor-pointer"
          />
        </div>

        {/* End Time */}
        <span className="text-lg text-gray-400 w-10 text-left">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls container */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        {/* Playback controls */}
        <div className="flex justify-center gap-4 w-full md:w-auto">
          <button
            onClick={prev}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded"
          >
            <Icon icon={skipPrevious} width="24" />
          </button>

          {isPlaying ? (
            <button
              onClick={pause}
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded font-bold"
            >
              <Icon icon={pauseIcon} width="24" />
            </button>
          ) : (
            <button
              onClick={play}
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded font-bold"
            >
              <Icon icon={playIcon} width="24" />
            </button>
          )}

          <button
            onClick={next}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded"
          >
            <Icon icon={skipNext} width="24" />
          </button>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-2 w-full justify-center md:w-auto md:justify-end">
          <button onClick={toggleMute}>
            <Icon
              icon={muted ? volumeOffIcon : volumeIcon}
              width="24"
              className="cursor-pointer"
            />
          </button>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-40 h-2 cursor-pointer input-slider"
            style={{ "--value": `${volume * 100}` } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Playlist */}
      <div className="mt-6">
        <ul className="mt-2 space-y-2">
          {audioFiles.map((track, index) => (
            <li
              key={track._id}
              onClick={() => {
                if (index !== currentTrackIndex) {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true); // trigger playback only if it's a different track
                }
              }}
              className={`cursor-pointer px-2 py-1 rounded text-xl text-center ${
                index === currentTrackIndex
                  ? "bg-brand text-white"
                  : "hover:bg-neutral-800"
              }`}
            >
              {track.songName} — {track.artistName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
