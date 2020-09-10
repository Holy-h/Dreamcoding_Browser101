"use strict";

const ITEM_SIZE = 60;
const CARROT_COUNT = 5;
const BUNNY_COUNT = 5;
let GAME_DURATION_SEC = 5;

const gameField = document.querySelector(".game__field");
const gameFieldRect = gameField.getBoundingClientRect();
// #1 : getBoundingClientRect() 사용

const gameButton = document.querySelector(".game__button");
const gameTitle = document.querySelector(".game__title");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const popUp = document.querySelector(".pop-up");
const popUpMessage = document.querySelector(".pop-up__message");
const popUpRefresh = document.querySelector(".pop-up__refrash");

const sound = {};
sound.bgm = new Audio("./sound/bg.mp3");
sound.bugPull = new Audio("./sound/bug_pull.mp3");
sound.carrotPull = new Audio("./sound/carrot_pull.mp3");
sound.lose = new Audio("./sound/alert.wav");
sound.win = new Audio("./sound/game_win.mp3");

// #5 : 상태 값 선언
let started = false;
let score = 0;
let timer = undefined;

gameButton.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpRefresh.addEventListener("click", () => {
  if (!started) {
    startGame();
    hidePopUp();
    addClickField();
  }
});

function addClickField() {
  // gameField.addEventListener("click", (event) => onFieldClick(event))
  gameField.addEventListener("click", onFieldClick);
}

function onFieldClick(event) {
  // removeEventListener 대신 started 상태를 이용하여 동작하지 않도록 함
  if (started == false) {
    return;
  }

  const { target } = event;
  // (1) target.className === "bunny"
  // (2) target.matches(".bunny")
  if (target.matches(".bunny")) {
    sound.carrotPull.currentTime = 0;
    sound.bugPull.play();
    finishGame(false);
    started = false;
  } else if (target.matches(".carrot")) {
    sound.carrotPull.currentTime = 0;
    sound.carrotPull.play();
    gameField.removeChild(target);
    score++;
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  }
}

function initGame() {
  gameField.innerHTML = ``;
  addItem("carrot", CARROT_COUNT, "./img/carrot.png");
  addItem("bunny", BUNNY_COUNT, "./img/bunny.jpg");
  updateScoreBoard();
  score = 0;
}

function preventClickField() {
  gameField.removeEventListener("click", onFieldClick);
}

function updateScoreBoard() {
  let carrotCount = document.querySelectorAll(".carrot").length;
  gameScore.innerText = `${carrotCount}`;
}

// #2 : 반복되는 for문(토끼, 당근 생성)을 위해 함수 생성
function addItem(className, count, imgPath) {
  for (let i = 0; i < count; i++) {
    const x = randomNumber(0, gameFieldRect.width - ITEM_SIZE);
    const y = randomNumber(0, gameFieldRect.height - ITEM_SIZE);

    const item = document.createElement("img");
    // #3 : document.createElement

    item.setAttribute("class", className);
    item.src = imgPath;
    // Element 종류에 따라 정규 프로퍼티가 다르다
    // HTMLImageElement에는 src 프로퍼티가 있음
    item.style.top = `${y}px`;
    item.style.left = `${x}px`;
    // style 프로퍼티도 object다

    gameField.append(item);
  }
}

// #4 : 랜덤 넘버 생성기
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1));
}

function startGame() {
  started = true;
  sound.bgm.play();
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  addClickField();
}

function finishGame(isClear = false) {
  let message = isClear
    ? "정말 빠른 손가락이군요!"
    : "손가락이 너무 느린걸요? 풉ㅋ";

  started = false;
  if (isClear) {
    sound.win.play();
  } else {
    sound.lose.play();
  }

  hideGameButton();
  showPlayButton();
  stopGameTimer();
  showPopUp(message);

  sound.bgm.pause();
  sound.bgm.currentTime = 0;
}

function stopGame() {
  started = false;
  hideGameButton();
  showPlayButton();
  stopGameTimer();
  showPopUp("다시 시작?");
  sound.bgm.pause();
  sound.bgm.currentTime = 0;
}

function showPopUp(message) {
  popUp.classList.remove("pop-up--hide");
  popUpMessage.innerText = message;
}

function hidePopUp() {
  popUp.classList.add("pop-up--hide");
  popUpMessage.innerText = "";
}

function showStopButton() {
  const icon = gameButton.querySelector(".fas");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
  gameButton.style.visibility = "visible";
}

function showPlayButton() {
  const icon = gameButton.querySelector(".fas");
  icon.classList.add("fa-play");
  icon.classList.remove("fa-stop");
  gameButton.style.visibility = "visible";
}

function hideGameButton() {
  gameButton.style.visibility = "hidden";
}

function showTimerAndScore() {
  gameTitle.style.display = "none";
  gameTimer.style.display = "inline";
  gameScore.style.display = "flex";
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    remainingTimeSec--;
    // setInterval 안에서 clearInterval을 호출
    if (remainingTimeSec <= 0) {
      updateTimerText(remainingTimeSec);
      finishGame(false);
      return;
    }
    updateTimerText(remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}
