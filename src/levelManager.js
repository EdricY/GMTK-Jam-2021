import { triggerWinGame, gameState } from "./state";
import { map } from "./map";
import { actionPanel } from "./actionPanel";
import { applicantSpawner } from "./applicantSpawner";
import { cycleState } from "./cycle";
import { shellNumber } from "./shell";
import { TILE_H, TILE_S, TILE_W, TILE_T } from "./globals";
import { setupUF } from "./road";
import { shark } from "./shark";

export const level1 = [
  [TILE_S, TILE_T, TILE_S, TILE_S, TILE_W, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S],
  [TILE_H, TILE_S, TILE_T, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S],
  [TILE_T, TILE_S, TILE_T, TILE_S, TILE_S, TILE_S, TILE_S, TILE_T, TILE_S, TILE_S],
  [TILE_S, TILE_H, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_T, TILE_S, TILE_S],
  [TILE_H, TILE_S, TILE_H, TILE_H, TILE_S, TILE_S, TILE_T, TILE_S, TILE_S, TILE_T],
  [TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_H, TILE_T],
  [TILE_S, TILE_H, TILE_H, TILE_S, TILE_S, TILE_S, TILE_H, TILE_S, TILE_S, TILE_S],
  [TILE_S, TILE_S, TILE_S, TILE_S, TILE_H, TILE_S, TILE_S, TILE_H, TILE_S, TILE_S],
  [TILE_S, TILE_S, TILE_H, TILE_S, TILE_S, TILE_S, TILE_H, TILE_S, TILE_S, TILE_H],
  [TILE_S, TILE_S, TILE_S, TILE_H, TILE_S, TILE_S, TILE_S, TILE_H, TILE_S, TILE_S],
];

// export const level2 = [
//   [TILE_S, TILE_W, TILE_T, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S],
//   [TILE_W, TILE_S, TILE_S, TILE_S, TILE_T, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S],
//   [TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S],
//   [TILE_S, TILE_H, TILE_H, TILE_H, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S],
//   [TILE_S, TILE_H, TILE_H, TILE_H, TILE_S, TILE_S, TILE_S, TILE_T, TILE_S, TILE_S],
//   [TILE_S, TILE_H, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S],
//   [TILE_S, TILE_H, TILE_H, TILE_H, TILE_S, TILE_S, TILE_H, TILE_S, TILE_S, TILE_S],
//   [TILE_S, TILE_H, TILE_H, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S],
//   [TILE_S, TILE_S, TILE_S, TILE_H, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_H],
//   [TILE_S, TILE_S, TILE_S, TILE_H, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S],
// ];

export const levels = [level1];

export class LevelManager {
  constructor() {
    this.currentLevel = 0;
    this.mapNumbers = level1;
  }
  nextLevel() {
    let goToMenu = false;
    this.currentLevel++;
    if (this.currentLevel >= levels.length) {
      this.currentLevel = 0;
      goToMenu = true;
    }
    triggerWinGame(goToMenu);
    //while (gameState.state === gameState.WINNING) {}
    //actionPanel.closeAll();
    applicantSpawner.setup();
    cycleState.setup();
    this.mapNumbers = levels[this.currentLevel];
    map.setup();
    setupUF();
    shellNumber.setup();
    shark.setup();
  }

  reset() {
    this.currentLevel = 0;
    applicantSpawner.setup();
    cycleState.setup();
    this.mapNumbers = levels[this.currentLevel];
    map.setup();
    setupUF();
    shellNumber.setup();
    shark.setup();
  }
}

export const levelManager = new LevelManager();
map.setup();
