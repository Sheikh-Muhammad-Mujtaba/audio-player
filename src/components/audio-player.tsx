'use client'

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, VolumeIcon, Volume2Icon, ListMusicIcon } from 'lucide-react'
import Image from "next/image"
import { parseBlob } from 'music-metadata-browser'

interface AudioPlayerProps {}

interface Track {
  title: string
  artist: string
  src: string
}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1)
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false)
  const [image, setImage] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newTracks: Track[] = []
      for (const file of Array.from(files)) {
        const metadata = await parseBlob(file)
        const title = metadata.common.title || file.name.replace(/\.[^/.]+$/, "")
        const artist = metadata.common.artist || "Unknown Artist"
        const picture = metadata.common.picture?.[0]
        const imageUrl = picture ? URL.createObjectURL(new Blob([picture.data])) : null
        newTracks.push({
          title,
          artist,
          src: URL.createObjectURL(file),
        })
        if (imageUrl) {
          setImage(imageUrl)
        }
      }
      setTracks((prevTracks) => [...prevTracks, ...newTracks])
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(error => {
          console.error("Error playing audio:", error)
        })
      }
    }
  }

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length)
  }

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    )
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0]
    setVolume(volumeValue)
    if (audioRef.current) {
      audioRef.current.volume = volumeValue
    }
  }

  const handleProgressChange = (newProgress: number[]) => {
    const progressValue = newProgress[0]
    setProgress(progressValue)
    if (audioRef.current) {
      audioRef.current.currentTime = (progressValue / 100) * audioRef.current.duration
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrackIndex]?.src || ""
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error)
        })
      }
      const currentTrack = tracks[currentTrackIndex]
      if (currentTrack) {
        const fetchMetadata = async () => {
          const response = await fetch(currentTrack.src)
          const blob = await response.blob()
          const metadata = await parseBlob(blob)
          const picture = metadata.common.picture?.[0]
          const imageUrl = picture ? URL.createObjectURL(new Blob([picture.data])) : null
          if (imageUrl) {
            setImage(imageUrl)
          }
        }
        fetchMetadata()
      }
    }
  }, [currentTrackIndex, tracks, isPlaying])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Audio Player</h1>
          <label className="flex items-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-2">
            <span className="mr-2">Upload</span>
            <input
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
        <Card className="bg-white/10 backdrop-blur-lg border-none">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0 w-full md:w-1/2 aspect-square relative overflow-hidden rounded-lg">
                <Image
                  src={image || "/image.png"}
                  alt="Album Cover"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 transform hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="flex flex-col justify-between w-full md:w-1/2">
                <div>
                  <h2 className="text-3xl font-bold mb-2 truncate w-[290px]">
                    {tracks[currentTrackIndex]?.title || "Audio Title"}
                  </h2>
                  <p className="text-xl text-gray-300 mb-6 w-[290px]">
                    {tracks[currentTrackIndex]?.artist || "Unknown Artist"}
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Slider
                      value={[progress]}
                      max={100}
                      step={0.1}
                      onValueChange={handleProgressChange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <Button variant="ghost" size="icon" onClick={handlePrevTrack}>
                      <SkipBackIcon className="w-8 h-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <PauseIcon className="w-8 h-8" />
                      ) : (
                        <PlayIcon className="w-8 h-8" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleNextTrack}>
                      <SkipForwardIcon className="w-8 h-8" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    {volume === 0 ? (
                      <VolumeIcon className="w-5 h-5" />
                    ) : (
                      <Volume2Icon className="w-5 h-5" />
                    )}
                    <Slider
                      value={[volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8">
          <Button
            variant="ghost"
            className="w-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setShowPlaylist(!showPlaylist)}
          >
            <ListMusicIcon className="w-5 h-5 mr-2" />
            {showPlaylist ? "Hide Playlist" : "Show Playlist"}
          </Button>
          {showPlaylist && (
            <div className="mt-4 bg-white/10 backdrop-blur-lg rounded-lg p-4 max-h-60 overflow-y-auto">
              {tracks.map((track, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                    index === currentTrackIndex ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                  onClick={() => setCurrentTrackIndex(index)}
                >
                  <div className="truncate">
                    <p className="font-semibold">{track.title}</p>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                  </div>
                  {index === currentTrackIndex && isPlaying && (
                    <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  )
}

export default AudioPlayer

