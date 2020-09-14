"use strict";

import { Field, ItemType } from "./field.js";
import * as sound from "./sound.js";

export const Reason = Object.freeze({
  win: "win",
  lose: "lose",
  stop: "stop",
});

// Builder Pattern
// Object를 보기 쉽고 간편하게 설정할 수 있어요
export class GameBuilder {
  gameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  carrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  bunnyCount(num) {
    this.bunnyCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration, //
      this.carrotCount, //
      this.bunnyCount
    );
  }
}

class Game {
  constructor(gameDurationSec, carrotCount, bunnyCount) {
    this.gameDurationSec = gameDurationSec;
    this.carrotCount = carrotCount;
    this.bunnyCount = bunnyCount;

    this.started = false;
    this.score = 0;
    this.timer = undefined;

    this.gameField = new Field(this.carrotCount, this.bunnyCount);
    this.gameField.setClickListener(this._onItemClick);

    this.gameButton = document.querySelector(".game__button");
    this.gameTitle = document.querySelector(".game__title");
    this.gameTimer = document.querySelector(".game__timer");
    this.gameScore = document.querySelector(".game__score");
    this.gameButtonIcon = this.gameButton.querySelector(".fas");

    this.gameButton.addEventListener("click", () => {
      if (this.started) {
        this.stop(Reason.stop);
      } else {
        this.start();
      }
    });

    // GameRecord
    this.gameRecord = document.querySelector(".game__record");
    this.startTime = 0;
    this.endTime = 0;
  }

  setStopListener(onGameStop) {
    this.onStop = onGameStop;
  }

  _onItemClick = (item) => {
    if (!this.started) {
      return;
    }

    if (item === ItemType.carrot) {
      this.score++;
      this.updateScore();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bunny) {
      this.stop(Reason.lose);
    }
  };

  hideGameButton() {
    this.gameButton.style.visibility = "hidden";
  }

  showPlayButton() {
    this.gameButtonIcon.classList.add("fa-play");
    this.gameButtonIcon.classList.remove("fa-stop");
    this.gameButton.style.visibility = "visible";
  }

  showStopButton() {
    this.gameButtonIcon.classList.add("fa-stop");
    this.gameButtonIcon.classList.remove("fa-play");
    this.gameButton.style.visibility = "visible";
  }

  updateScore() {
    let carrotCount = document.querySelectorAll(".carrot").length;
    this.gameScore.innerText = `${carrotCount}`;
  }

  showTimerAndScore() {
    this.gameTitle.style.display = "none";
    this.gameTimer.style.display = "inline";
    this.gameScore.style.display = "flex";
  }

  startTimer() {
    let remainingTimeSec = this.gameDurationSec;
    this._updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      remainingTimeSec--;
      this._updateTimerText(remainingTimeSec);
      if (remainingTimeSec <= 0) {
        this.stop(Reason.lose);
      }
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  _updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }

  _initGame() {
    this.gameField.init();
    this.updateScore();
    this.score = 0;
  }

  start = () => {
    this.started = true;
    this.gameField.setGameState(this.started);
    sound.playBackground();
    this._initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startTimer();
    this.startTime = Date.now();
  };

  stop = (reason) => {
    this.endTime = Date.now();
    this.started = false;
    this.gameField.setGameState(this.started);
    this.showPlayButton();
    this.hideGameButton();
    this.stopGameTimer();
    this.onStop && this.onStop(reason);
    sound.stopBackground();

    if (reason === Reason.win) {
      this.updateRecord();
    }
  };

  // GameRecord
  getPlayTime = (startTime, endTime) => {
    return (endTime - startTime) / 1000;
  };

  updateRecord = () => {
    const userScore = this.getPlayTime(this.startTime, this.endTime);
    const userName = prompt("이름을 입력하세요", "AAA");

    const userRecord = document.createElement("li");
    userRecord.setAttribute("class", "user-record");
    userRecord.innerHTML = `
      <span class="user__name">이름: ${userName ? userName : "undefined"}</span>
      <span class="user__score">시간: ${userScore}초</span>
    `;
    this.gameRecord.querySelector(".user-record-list").append(userRecord);
  };
}
