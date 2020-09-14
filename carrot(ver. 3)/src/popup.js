"use strict";

export default class PopUp {
  constructor() {
    this.popUp = document.querySelector(".pop-up");
    this.popUpMessage = document.querySelector(".pop-up__message");
    this.popUpRefresh = document.querySelector(".pop-up__refrash");

    this.popUpRefresh.addEventListener("click", () => {
      this.onClick && this.onClick();
      this._hide();
    });
  }
  setClickListener(onClick) {
    this.onClick = onClick;
  }

  _hide() {
    this.popUp.classList.add("pop-up--hide");
    this.popUpMessage.innerText = "";
  }

  showWithText = (message) => {
    this.popUp.classList.remove("pop-up--hide");
    this.popUpMessage.innerText = message;
  };
}
