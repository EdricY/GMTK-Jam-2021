import { getEl } from "./globals";
import { startGame } from "./main";
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
    startGame();
  });
  getEl("creditsBtn").addEventListener("click", () => {
    gameState.setState(GameState.CRED);
  });
  getEl("creditsBackBtn").addEventListener("click", () => {
    gameState.setState(GameState.MENU);
  });
};
