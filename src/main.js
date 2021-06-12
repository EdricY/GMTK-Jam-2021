import { SIZE, canvas, ctx, getEl, HALFSIZE, TILE_G, TILE_H, TILE_R, inBounds } from "./globals";
import GameState, { setupBtns, gameState } from "./state";
import { map, mapData } from "./map";
import { setupAssetLoader, imgSources } from "./load";
import { setupCursor, cursor, selectedTile } from "./cursor";
import { randInt, rotate45, rotate45CC, screenXYtoTileLoc } from "./math";
import { shell, shellNumber, shellPickup } from "./shell";
import { Applicant } from "./applicant";
import { applicantSpawner, ApplicantSpawner } from "./applicantSpawner";
import { setupButtons } from "./buttons";
import { actionPanel, ActionPanel } from "./actionPanel";

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
function update() {
  shell.update();
  shellPickup.update();
  shellNumber.update();
  applicantSpawner.update();
}

function draw() {
  ctx.clearRect(0, 0, SIZE, SIZE);
  map.drawField(ctx);

  const [jj, ii] = screenXYtoTileLoc(cursor.x, cursor.y);
  const j = Math.round(jj);
  const i = Math.round(ii);
  if (inBounds(i, j)) {
    map.strokeLoc(i, j, "red", 2);
  }

  if (inBounds(selectedTile.i, selectedTile.j)) {
    map.strokeLoc(selectedTile.i, selectedTile.j);
  }
  map.drawObjects(ctx);

  shellPickup.draw(ctx);
  shellNumber.draw();
  ctx.font = "20px serif";
  ctx.fillStyle = "white";
  ctx.fillText(shell.timer, 100, 100);
  ctx.fillText(shell.i, 100, 200);
  ctx.fillText(shell.j, 100, 300);
}

export function onCanvasClick() {
  const [jj, ii] = screenXYtoTileLoc(cursor.x, cursor.y);
  const i = Math.round(ii);
  const j = Math.round(jj);
  selectedTile.i = i;
  selectedTile.j = j;
  let tile = null;
  if (inBounds(i, j)) {
    tile = mapData[i][j];
  } else {
    actionPanel.setCompareInfo();
  }

  if (i == shell.i && j == shell.j) {
    const amount = randInt(10, 100);
    shellNumber.change(amount);
    shell.pickup();
    shellPickup.trigger(cursor.x, cursor.y, amount);
  }

  let infoContent = getEl("infoContent");
  let infoImg = getEl("infoImage");
  let infoName = getEl("infoName");

  if (tile.draw) {
    if (actionPanel.currentObj) {
      actionPanel.setCompareInfo(imgSources.anemone, "Anemone", "Stuff");
    } else {
      actionPanel.setInfo(imgSources.anemone, "Anemone", "Stuff");
    }
    // populate info box...
    // infoContent.innerText = "This is grass, it doesn't do much.";
    // infoName.innerText = "Grass";
    // infoImg.src = imgSources.grass;
  } else {
    actionPanel.setCompareInfo();
  }
}

setupAssetLoader(loadTick, () => (getEl("playBtn").disabled = false));
setupBtns();
setupCursor();
setupButtons();

shellNumber.change(1000);
