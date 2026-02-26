const audio = document.querySelector('#audio');
const playBtn = document.querySelector('#play-btn');
const volume = document.querySelector('#volume');

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener('play', () => {
  playBtn.textContent = '\u23F8';
  playBtn.classList.add('playing');
});

audio.addEventListener('pause', () => {
  playBtn.textContent = '\u25B6';
  playBtn.classList.remove('playing');
});

volume.addEventListener('input', () => {
  audio.volume = volume.value;
});
