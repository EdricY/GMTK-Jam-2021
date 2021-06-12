import { SIZE, canvas, ctx, getEl, HALFSIZE } from "./globals";
import GameState, { setupBtns, gameState } from "./state";
import { map } from "./map";
import { setupAssetLoader } from "./load";
import { setupCursor, cursor } from "./cursor";
import { rotate45, rotate45CC, screenXYtoTileLoc } from "./math";

function loadTick(frac) {
  console.log(frac);
}

export function startGame() {
  requestAnimationFrame(tick);
}

function tick() {
  update();
  draw();
  if (gameState.inState(GameState.GAME)) {
    requestAnimationFrame(tick);
  }
}

function draw() {
  ctx.clearRect(0, 0, SIZE, SIZE);
  map.drawField(ctx);

  const [j, i] = screenXYtoTileLoc(cursor.x, cursor.y);
  map.strokeLoc(Math.round(i), Math.round(j));
}

function update() {}

setupAssetLoader(loadTick, () => (getEl("playBtn").disabled = false));
setupBtns();
setupCursor();
