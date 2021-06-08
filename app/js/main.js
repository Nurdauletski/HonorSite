
let video = document.getElementById('video__media');
let video_image = document.querySelector('.video__image');
let paused = true;
let video_button = document.getElementById('video__button--parent');
video_button.addEventListener('click', () => {
  if(paused) {
    video.play();
    paused = false;
    video_image.classList.toggle('video__image--toggle');
  } else {
    video.pause();
    paused = true;
    video_image.classList.toggle('video__image--toggle');
  }
})
