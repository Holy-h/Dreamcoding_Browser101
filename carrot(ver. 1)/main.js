const gameBtn = document.querySelector(".info__button");
const timeBox = document.querySelector(".info__time");
const farm = document.querySelector(".farm");
const countBox = document.querySelector(".info__count");
const modalWrapper = document.querySelector(".modal-wrapper");
const boardBox = document.querySelector(".board");
const boardList = document.querySelector(".board__list");

const audio = {};
audio.bgm = new Audio("./sound/bg.mp3");
audio.alert = new Audio("./sound/alert.wav");
audio.bugPull = new Audio("./sound/bug_pull.mp3");
audio.carrotPull = new Audio("./sound/carrot_pull.mp3");
audio.gameWin = new Audio("./sound/game_win.mp3");

let isGameStarted = false;
const timer = {};

const scoreBoard = [];

gameBtn.addEventListener("click", () => {
  if (isGameStarted) {
    // ^ 게임 종료
    endGame();
  } else {
    // ^ 게임 시작
    startGame();
  }
});

function endGame(modalText) {
  audio.bgm.pause();

  audio.alert.currentTime = 0;
  audio.alert.play();

  gameBtn.innerText = "시작";
  timeBox.innerHTML = "10:00";

  clearInterval(timer.interval);
  clearTimeout(timer.timeout);

  farm.removeEventListener("click", handleFarmClickEvent);

  handleModal(modalText);

  isGameStarted = false;
}

function startGame() {
  isGameStarted = true;

  audio.bgm.currentTime = 0;
  audio.bgm.play();

  gameBtn.innerText = "종료";

  farm.addEventListener("click", handleFarmClickEvent);

  clearInterval(timer.interval);
  clearTimeout(timer.timeout);

  let totalTime = 10;
  timer.interval = setInterval(() => {
    totalTime--;
    timeBox.innerText = `${totalTime}:00`;
    console.log("totalTime");
  }, 1000);

  timer.timeout = setTimeout(() => {
    endGame();
    clearInterval(timer.interval);
  }, 10000);

  let bugs = "";
  for (let i = 0; i < 10; i++) {
    const top =
      Math.floor(Math.random() * (farm.clientHeight - 60 - 60 + 1)) + 60;
    const left =
      Math.floor(Math.random() * (farm.clientWidth - 60 - 60 + 1)) + 60;
    bugs += `<img class="bug" src="./img/bug.png" style="top: ${top}px; left: ${left}px" />`;
  }

  let carrots = "";
  for (let i = 0; i < 10; i++) {
    const top =
      Math.floor(Math.random() * (farm.clientHeight - 60 - 60 + 1)) + 60;
    const left =
      Math.floor(Math.random() * (farm.clientWidth - 60 - 60 + 1)) + 60;
    carrots += `<img class="carrot" src="./img/carrot.png" style="top: ${top}px; left: ${left}px" />`;
  }

  farm.innerHTML = bugs + carrots;

  timer.startTime = new Date();

  updateCounter();
}

function handleFarmClickEvent(event) {
  const target = event.target;

  if (target.className === "carrot") {
    audio.carrotPull.currentTime = 0;
    audio.carrotPull.play();
    farm.removeChild(target);
    updateCounter();
  } else if (target.className === "bug") {
    audio.bugPull.currentTime = 0;
    audio.bugPull.play();
  }
}

function updateBoard() {
  const time = (timer.endTime - timer.startTime) / 1000;
  scoreBoard.push(time);
  scoreBoard.sort((a, b) => a - b);

  boardList.innerHTML = "";

  scoreBoard.forEach((score) => {
    const boardItem = `
      <li class="board__item">${score}초</li>
    `;
    boardList.innerHTML += boardItem;
  });
}

function updateCounter() {
  const carrotCount = document.querySelectorAll(".carrot").length;
  countBox.innerText = carrotCount;

  if (carrotCount === 0) {
    timer.endTime = new Date();
    endGame("🎉성공🎉");
    audio.gameWin.play();
    updateBoard();
  }
}

function handleModal(modalText = "실패했습니다!") {
  modalWrapper.style = "display: block;";

  const modalBtn = document.querySelector(".modal__button");
  const modalTextBox = document.querySelector(".modal__text");

  modalTextBox.innerText = modalText;

  modalBtn.addEventListener("click", () => {
    modalWrapper.style = "display: none;";
    startGame();
  });
}
