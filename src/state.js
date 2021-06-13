import { canvas, ctx, getEl, SIZE } from "./globals";
import { sounds } from "./load";
import { startGame } from "./main";
import { volumeMultplier } from "./musicPlayer";
export default class GameState {
  constructor() {
    this.state = 0;
  }
  static get MENU() {
    return 0;
  }
  static get CRED() {
    return 1;
  }
  static get GAME() {
    return 2;
  }
  static get DYING() {
    return 3;
  }
  static get WINNING() {
    return 4;
  }

  inState(num) {
    return this.state == num;
  }

  setState(num) {
    if (this.inState(num)) return;
    this.state = num;
    hideOuterDivs();
    divDict[num].classList.remove("nodisplay");
  }
}

export const gameState = new GameState();

const divDict = {};

divDict[GameState.GAME] = getEl("game");
divDict[GameState.MENU] = getEl("menu");
divDict[GameState.CRED] = getEl("credits");

export function hideOuterDivs() {
  divDict[GameState.GAME].classList.add("nodisplay");
  divDict[GameState.MENU].classList.add("nodisplay");
  divDict[GameState.CRED].classList.add("nodisplay");
}

export const setupBtns = () => {
  getEl("playBtn").addEventListener("click", () => {
    gameState.setState(GameState.GAME);
    if (sounds.bloop.currentTime > 0) {
      sounds.bloop.currentTime = 0;
    }
    sounds.bloop.volume = 0.3;
    sounds.bloop.speed = 4;
    sounds.bloop.play();
    startGame();
  });
  getEl("creditsBtn").addEventListener("click", () => {
    if (sounds.bloop.currentTime > 0) {
      sounds.bloop.currentTime = 0;
    }
    sounds.bloop.volume = 0.3;
    sounds.bloop.speed = 4;
    sounds.bloop.play();
    gameState.setState(GameState.CRED);
  });
  getEl("creditsBackBtn").addEventListener("click", () => {
    if (sounds.bloop.currentTime > 0) {
      sounds.bloop.currentTime = 0;
    }
    sounds.bloop.volume = 0.3;
    sounds.bloop.speed = 4;
    sounds.bloop.play();
    gameState.setState(GameState.MENU);
  });
};

const endDuration = 500;
let endTimer = endDuration;
let finalImg;
export function triggerEndGame() {
  finalImg = document.createElement("img");
  finalImg.src = canvas.toDataURL();
  gameState.state = GameState.DYING;
  endTimer = endDuration;
  endgameTick();
}
function endgameTick() {
  endTimer--;
  if (endTimer > 0) {
    ctx.globalAlpha = 1;
    ctx.drawImage(finalImg, 0, 0);

    ctx.globalAlpha = (endDuration - endTimer) / endDuration;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, SIZE, SIZE);
    requestAnimationFrame(endgameTick);
    sounds.background1.volume = (volumeMultplier * endTimer) / endDuration;
  } else {
    ctx.fillStyle = "black";
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, SIZE, SIZE);
    sounds.uhoh.currentTime = 0;
    sounds.uhoh.play();

    sounds.background1.pause();
    sounds.background1.volume = volumeMultplier;

    // reset game, return to menu
    setTimeout(() => {
      gameState.setState(GameState.MENU);
    }, 500);
  }
}

let shouldGoToMenu = false;
export function triggerWinGame(goToMenu) {
  finalImg = document.createElement("img");
  finalImg.src = canvas.toDataURL();
  gameState.state = GameState.WINNING;
  endTimer = endDuration;
  shouldGoToMenu = goToMenu;
  wingameTick();
}
function wingameTick() {
  endTimer--;
  if (endTimer > 0) {
    ctx.globalAlpha = 1;
    ctx.drawImage(finalImg, 0, 0);

    ctx.globalAlpha = (endDuration - endTimer) / endDuration;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, SIZE, SIZE);
    requestAnimationFrame(wingameTick);
    sounds.background1.volume = (volumeMultplier * endTimer) / endDuration;
  } else {
    ctx.fillStyle = "white";
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, SIZE, SIZE);

    sounds.background1.pause();
    sounds.background1.volume = volumeMultplier;

    // reset game, return to menu
    if (shouldGoToMenu) {
      setTimeout(() => {
        getEl("winner").classList.remove("nodisplay");
        gameState.setState(GameState.CRED);
      }, 500);
    } else {
      setTimeout(() => {
        gameState.setState(GameState.GAME);
        if (sounds.bloop.currentTime > 0) {
          sounds.bloop.currentTime = 0;
        }
        sounds.bloop.volume = 0.3;
        sounds.bloop.speed = 4;
        sounds.bloop.play();
        startGame();
      }, 500);
    }
  }
}
