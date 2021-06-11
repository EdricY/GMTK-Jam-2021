import { canvas } from "./globals";

export const cursor = { x: -1, y: -1 };

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
};
