// Open fullscreen (default = whole page)
export function openFullscreen(element = document.documentElement) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) { // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) { // Chrome, Safari, Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { // IE/Edge (legacy)
    element.msRequestFullscreen();
  }
}

// Close fullscreen
export function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // IE/Edge (legacy)
    document.msExitFullscreen();
  }
}
