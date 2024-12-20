# Audio Player Application

This is a fully-featured Audio Player application built using **React** and **Next.js**. The app allows users to upload and play audio files, view metadata like title and artist, and manage a playlist. It also supports dynamic album art display when available.

---

## **Features**
- **Audio Upload:** Users can upload multiple audio files.
- **Metadata Extraction:** Automatically extracts metadata (title, artist, album art) using `music-metadata-browser`.
- **Dynamic Album Art:** Displays the album cover if available; otherwise, uses a default image.
- **Playback Controls:**
  - Play/Pause audio
  - Skip to the next or previous track
- **Volume Control:** Adjustable volume slider.
- **Progress Bar:** Interactive progress bar to seek through the track.
- **Playlist Management:** Displays uploaded tracks and allows switching between them.

---

## **Technologies Used**
- **React:** For building the user interface
- **Next.js:** Framework for server-side rendering and optimized build
- **TypeScript:** For type safety and better development experience
- **Tailwind CSS:** For styling the UI
- **music-metadata-browser:** To extract audio metadata from uploaded files
- **Lucide Icons:** For consistent and visually appealing icons

---

## **Getting Started**

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Sheikh-Muhammad-Mujtaba/
   ```

2. Navigate to the project directory:
   ```bash
   cd audio-player
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

---


## **Usage**

### Uploading Audio Files
1. Click the **Upload** button to select audio files from your device.
2. Supported audio formats: `mp3`, `wav`, and other common formats.

### Controls
- **Play/Pause:** Toggle playback of the current track.
- **Skip Forward/Backward:** Navigate between tracks in the playlist.
- **Progress Bar:** Drag the slider to seek to a specific part of the track.
- **Volume Slider:** Adjust the playback volume.

### Playlist Management
- Uploaded tracks will appear in the playlist.
- Click on a track to play it.
