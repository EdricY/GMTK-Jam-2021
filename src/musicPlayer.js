import { sounds } from "./load";
export const volumeMultplier = 0.75;

export class MusicPlayer {
  constructor() {
    this.musicTracks = this.shuffleMusic([sounds.background1]);
    this.currentTrack = Math.floor(Math.random() * this.musicTracks.length);
  }

  reset() {
    this.musicTracks[this.currentTrack].currentTime = 0;
  }

  play() {
    this.musicTracks[this.currentTrack].currentTime = 0;
    this.musicTracks[this.currentTrack].volume = volumeMultplier;
    this.musicTracks[this.currentTrack].play();
  }

  update() {
    let currentSong = this.musicTracks[this.currentTrack];
    if (currentSong.currentTime >= currentSong.duration) {
      this.currentTrack = (this.currentTrack + 1) % this.musicTracks.length;
      this.play();
    }
  }

  shuffleMusic(array) {
    var currentIndex = array.length,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }
}
