const sound = {};
sound.bgm = new Audio("sound/bg.mp3");
sound.bunny = new Audio("sound/bug_pull.mp3");
sound.carrot = new Audio("sound/carrot_pull.mp3");
sound.alert = new Audio("sound/alert.wav");
sound.win = new Audio("sound/game_win.mp3");

export function playCarrot() {
  playSound(sound.carrot);
}
export function playBunny() {
  playSound(sound.bunny);
}
export function playAlert() {
  playSound(sound.alert);
}
export function playWin() {
  playSound(sound.win);
}
export function playBackground() {
  playSound(sound.bgm);
}
export function stopBackground() {
  stopSound(sound.bgm);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
