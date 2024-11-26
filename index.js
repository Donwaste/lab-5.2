let audio = new Audio();

let currentSongIndex = 0;
let isPlaying = false;

function loadSong(songIndex) {
  const song = songs[songIndex];
  document.getElementById("current-cover").src = song.cover;
  document.getElementById("current-artist").innerText = song.artist;
  document.getElementById("current-title").innerText = song.name;
  audio.src = song.path;
  audio.load();
}

function playPause() {
  if (isPlaying) {
      audio.pause();
      isPlaying = false;
      document.getElementById("play-pause-icon").src = "buttons/play.png";
  } else {
      audio.play();
      isPlaying = true;
      document.getElementById("play-pause-icon").src = "buttons/pause.png";
  }
}

function previous() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playPause();
}

function next() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playPause();
}

function adjustVolume(value) {
  audio.volume = value;
}

function seekTo(value) {
  audio.currentTime = value;
}

function updateSeekSlider() {
  const seekSlider = document.getElementById("seek-slider");
  
  if (!isNaN(audio.duration)) {
    seekSlider.max = audio.duration;
    seekSlider.value = audio.currentTime;
  
    document.getElementById("current-time").innerText = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return minutes + ":" + (secs < 10 ? "0" : "") + secs;
}

audio.addEventListener("timeupdate", updateSeekSlider);

function generateSongList() {
  const songListElement = document.getElementById("song-list");
  songs.forEach((song, index) => {
      const songElement = document.createElement("div");
      songElement.classList.add("song");
      songElement.innerHTML = `
          <img src="${song.cover}" alt="${song.name}">
          <div class="song-info">
              <p>${song.artist}</p>
              <p>${song.name}</p>
          </div>
          <button onclick="selectSong(${index})"><img src="buttons/play.png" alt="Play"></button>
      `;
      songListElement.appendChild(songElement);
  });
}

function selectSong(index) {
  currentSongIndex = index;
  loadSong(currentSongIndex);
  playPause();
}

window.onload = function() {
  loadSong(currentSongIndex);
  generateSongList();
};

let songs = JSON.parse(localStorage.getItem('songs')) || [];

if (songs.length === 0) {
    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            songs = data;
            localStorage.setItem('songs', JSON.stringify(songs));
            generateSongList();
        });
} else {
    generateSongList();
}

const modal = document.getElementById('modal');
document.getElementById('add-song-button').addEventListener('click', () => {
    modal.classList.add('active');
});

document.getElementById('close-modal').addEventListener('click', () => {
    modal.classList.remove('active');
});

document.getElementById('create-song').addEventListener('click', () => {
    const artist = document.getElementById('artist').value.trim();
    const songName = document.getElementById('song-name').value.trim();
    const songFile = document.getElementById('song-file').files[0];
    const coverFile = document.getElementById('cover-file').files[0];

    if (!artist || !songName || !songFile || !coverFile) {
        alert('Всі поля повинні бути заповненні !');
        return;
    }

    const newSong = {
        id: Date.now(),
        artist,
        name: songName,
        path: URL.createObjectURL(songFile),
        cover: URL.createObjectURL(coverFile),
    };

    songs.push(newSong);
    localStorage.setItem('songs', JSON.stringify(songs));
    generateSongList();
    modal.classList.remove('active');
});

function generateSongList() {
    const songListElement = document.getElementById('song-list');
    songListElement.innerHTML = '';
    songs.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.classList.add('song');
        songElement.innerHTML = `
            <img src="${song.cover}" alt="${song.name}">
            <div class="song-info">
                <p>${song.artist}</p>
                <p>${song.name}</p>
            </div>
            <button onclick="removeSong(${index})">Delete</button>
        `;
        songListElement.appendChild(songElement);
    });
}

function removeSong(index) {
    songs.splice(index, 1);
    localStorage.setItem('songs', JSON.stringify(songs));
    generateSongList();
}

document.addEventListener('DOMContentLoaded', function() {
  let storedSongs = JSON.parse(localStorage.getItem('songs'));

  if (!storedSongs || storedSongs.length === 0) {
    fetch('songs.json')
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('songs', JSON.stringify(data));
        songs = data;
        generateSongList(); 
      })
      .catch(error => console.error('JSON Fail:', error));
  } else {
    songs = storedSongs;
    generateSongList();
  }
});
