import { SIZE, canvas, ctx, getEl, HALFSIZE, TILE_G, TILE_H, TILE_R, inBounds } from "./globals";
import GameState, { setupBtns, gameState } from "./state";
import { levelManager, LevelManager } from "./levelManager";
import { map } from "./map";
import { setupAssetLoader, imgSources, sounds } from "./load";
import { setupCursor, cursor, selectedTile, drawCursorTile } from "./cursor";
import { randInt, rotate45, rotate45CC, screenXYtoTileLoc } from "./math";
import { shell, shellNumber, shellPickup } from "./shell";
import { Applicant } from "./applicant";
import { applicantSpawner, ApplicantSpawner } from "./applicantSpawner";
import { denyFlash, laterFlash, setupButtons } from "./buttons";
import { actionPanel } from "./actionPanel";
import { cycleState, CycleState } from "./cycle";
import { MusicPlayer } from "./musicPlayer";
import { shark } from "./shark";
import { setupUF } from "./road";
import { welcomeState } from "./welcome";
import { particleManager } from "./particles";

let musicPlayer;

function loadTick(frac) {
  // console.log(frac);
}

const startingShells = 100;

export function startGame() {
  requestAnimationFrame(tick);
  actionPanel.openWelcomeBox();
  musicPlayer = musicPlayer || new MusicPlayer();
  musicPlayer.play();
  // for game restarts

  levelManager.reset();
  shellNumber.change(startingShells);
}

function tick() {
  update();
  draw();
  if (gameState.inState(GameState.GAME)) {
    requestAnimationFrame(tick);
  }
}
function update() {
  // Win
  if (
    map.mapData
      .flat()
      .filter((x) => x.isGrand)
      .every((x) => x.tenant)
  ) {
    levelManager.nextLevel();
    return;
  }

  shell.update();
  shellPickup.update();
  shellNumber.update();
  applicantSpawner.update();
  cycleState.update();
  musicPlayer.update();
  shark.update();
  particleManager.update();
}

function draw() {
  ctx.clearRect(0, 0, SIZE, SIZE);
  map.drawField(ctx);

  const [jj, ii] = screenXYtoTileLoc(cursor.x, cursor.y);
  const j = Math.round(jj);
  const i = Math.round(ii);

  drawCursorTile(ctx, i, j);

  if (inBounds(selectedTile.i, selectedTile.j)) {
    map.strokeLoc(ctx, selectedTile.i, selectedTile.j);

    if (actionPanel.currentPanelType == "applicant") {
      map.strokeLoc(ctx, selectedTile.i, selectedTile.j, "purple", 8);
    }
  }
  map.drawObjects(ctx);

  particleManager.draw(ctx);

  shellPickup.draw(ctx);
  shellNumber.draw();
  applicantSpawner.draw();
  shark.draw();
  ctx.font = "20px serif";
  ctx.fillStyle = "white";

  // debug text
  // ctx.fillText(applicantSpawner.spawnTimer, 100, 100);
  // ctx.fillText(selectedTile.i, 100, 200);
  // ctx.fillText(selectedTile.j, 100, 300);
}

export function onCanvasClick() {
  if (gameState.state != GameState.GAME) return;
  if (actionPanel.currentPanelType == "welcome") {
    welcomeState.nextStep();
    return;
  }

  const [jj, ii] = screenXYtoTileLoc(cursor.x, cursor.y);
  const i = Math.round(ii);
  const j = Math.round(jj);

  if (i == shell.i && j == shell.j) {
    const amount = shell.getAmount();
    shellNumber.change(amount);
    shell.pickup();
    shellPickup.trigger(cursor.x, cursor.y, amount);
    sounds.moneybag.currentTime = 0;
    sounds.moneybag.play();
    particleManager.generate(cursor.x, cursor.y);
  }

  if (actionPanel.currentPanelType == "applicant") {
    // in applicant view, only select owned houses and exit the function early.
    if (!inBounds(i, j)) {
      actionPanel.selectResidence(null);
      denyFlash(500);
      return;
    }
    let tile = map.mapData[i][j];
    if (tile?.owned) {
      actionPanel.selectResidence(tile);
      selectedTile.i = i;
      selectedTile.j = j;
    } else {
      denyFlash(500);
    }

    return;
  }

  if (actionPanel.currentPanelType == "eom") {
    if (!(i == shell.i && j == shell.j)) {
      laterFlash();
    }
    return;
  }

  if (!inBounds(i, j)) {
    actionPanel.closeAll();
    return;
  }
  let tile = map.mapData[i][j];
  selectedTile.i = i;
  selectedTile.j = j;
  if (tile?.select) {
    particleManager.generate(cursor.x, cursor.y);
    tile.select();
  }
}

window.addEventListener("load", () => {
  setupBtns();
  setupCursor();
  setupButtons();
  setupUF();
  shellNumber.change(1000);
});

setupAssetLoader(loadTick, () => (getEl("playBtn").disabled = false));
