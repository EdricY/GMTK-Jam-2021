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

  ctx.fillStyle = "purple";
  ctx.fillRect(cursor.x, cursor.y, 10, 10);

  const rotCurs = rotate45(cursor.x, cursor.y, HALFSIZE, HALFSIZE);
  ctx.fillStyle = "pink";
  ctx.fillRect(rotCurs[0], rotCurs[1], 10, 10);

  const rotCCCurs = rotate45CC(cursor.x, cursor.y, HALFSIZE, HALFSIZE);
  ctx.fillStyle = "white";
  ctx.fillRect(rotCCCurs[0], rotCCCurs[1], 10, 10);

  ctx.font = "30px sans-serif";
  const [j, i] = screenXYtoTileLoc(cursor.x, cursor.y);
  ctx.fillText(i, 100, 100);
  ctx.fillText(j, 100, 200);

  map.strokeLoc(Math.round(i), Math.round(j));
}

function update() {}

setupAssetLoader(loadTick, () => (getEl("playBtn").disabled = false));
setupBtns();
setupCursor();
