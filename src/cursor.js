import { actionPanel } from "./actionPanel";
import { canvas, inBounds } from "./globals";
import { onCanvasClick } from "./main";
import { map } from "./map";

export const cursor = { x: -1, y: -1 };

export const selectedTile = { i: -1, j: -1 };

function getCanvasXY(e) {
  const x = Math.round((e.offsetX * canvas.width) / canvas.clientWidth);
  const y = Math.round((e.offsetY * canvas.height) / canvas.clientHeight);
  return [x, y];
}

export const setupCursor = () => {
  canvas.addEventListener("mousemove", (e) => {
    const pt = getCanvasXY(e);
    cursor.x = pt[0];
    cursor.y = pt[1];
  });
  canvas.addEventListener("click", (e) => {
    onCanvasClick();
  });
};

export function drawCursorTile(ctx, i, j) {
  if (!inBounds(i, j)) return;
  if (actionPanel.currentPanelType == "eom") {
    return;
  }
  if (actionPanel.currentPanelType == "applicant") {
    if (map.mapData[i][j]?.owned) {
      map.strokeLoc(ctx, i, j, "red", 5);
    }
    return;
  }
  map.strokeLoc(ctx, i, j, "red", 2);
  return;
}
