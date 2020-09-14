"use strict";

import * as sound from "./sound.js";

const ITEM_SIZE = 60;

export const ItemType = Object.freeze({
  carrot: "carrot",
  bunny: "bunny",
});

// binding 해결 방법
// 클래스 안에 있는 어떤 함수를 다른 콜백으로 전달할 때 binding 문제가 발생합니다.
// 여기에서는 onClick안에 들어있는 클래스의 내용인 onItemClick 함수에 대한 정보가 없어지기 때문에
// undefind로 나타나게 되고, 이를 해결하기 위한 방법으로는
// 1. this.onClick = this.onClick.bing(this) (이 함수는 class와 엮여있어)
// 2. addEventListener에 arrow function을 사용 (이 함수는 따로 this를 갖지 않아)
// 3. onClick 메서드를 arrow function으로 만듬

export class Field {
  constructor(carrotCount, bunnyCount) {
    this.carrotCount = carrotCount;
    this.bunnyCount = bunnyCount;

    this.gameField = document.querySelector(".game__field");
    this.gameFieldRect = this.gameField.getBoundingClientRect();

    this.gameField.addEventListener("click", this._onClick);
  }

  setGameState(started) {
    this.started = started;
  }

  init() {
    this.gameField.innerHTML = ``;
    this._addItem(ItemType.carrot, this.carrotCount, "img/carrot.png");
    this._addItem(ItemType.bunny, this.bunnyCount, "img/bunny.jpg");
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  _addItem(className, count, imgPath) {
    for (let i = 0; i < count; i++) {
      const x = randomNumber(0, this.gameFieldRect.width - ITEM_SIZE);
      const y = randomNumber(0, this.gameFieldRect.height - ITEM_SIZE);
      const item = document.createElement("img");
      item.setAttribute("class", className);
      item.src = imgPath;
      item.style.top = `${y}px`;
      item.style.left = `${x}px`;
      this.gameField.appendChild(item);
    }
  }

  _onClick = (event) => {
    if (!this.started) return;
    const { target } = event;
    if (target.matches(".carrot")) {
      target.remove();
      sound.playCarrot();
      // this binding 🐶
      this.onItemClick && this.onItemClick(ItemType.carrot);
    } else if (target.matches(".bunny")) {
      sound.playBunny();
      this.onItemClick && this.onItemClick(ItemType.bunny);
    }
  };
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1));
}
