"use strict";

import { GameBuilder, Reason } from "./game.js";
import PopUp from "./popup.js";
import * as sound from "./sound.js";

const game = new GameBuilder()
  .gameDuration(20)
  .carrotCount(2)
  .bunnyCount(10)
  .build();
const gameFinishBanner = new PopUp();

game.setStopListener((reason) => {
  let message = "";
  switch (reason) {
    case Reason.stop:
      message = "다시 시작할까요?";
      sound.playAlert();
      break;
    case Reason.win:
      message = "손가락이 정말 빠른데요?";
      sound.playWin();
      break;
    case Reason.lose:
      message = "실력이... 쓰읍;;;";
      sound.playBunny();
      break;
    default:
      throw new Error("잘못된 접근 경로입니다");
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(game.start);
