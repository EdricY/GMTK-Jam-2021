import { HALFRT2, HALFSIZE, TSIZE, N, SIZE } from "./globals";

// rotate (x,y) 45 degrees clockwise(?) about (a,b)
export function rotate45(x, y, a = 0, b = 0) {
  let newX = a + HALFRT2 * (x - a) - HALFRT2 * (y - b);
  let newY = b + HALFRT2 * (x - a) + HALFRT2 * (y - b);
  return [newX, newY];
}

export function rotate45CC(x, y, a = 0, b = 0) {
  let newX = a + HALFRT2 * (x - a) + HALFRT2 * (y - b);
  let newY = b - HALFRT2 * (x - a) + HALFRT2 * (y - b);
  return [newX, newY];
}

export function tileLocToScreenXY(i, j) {
  const orthoX = j * TSIZE;
  const orthoY = i * TSIZE;
  const rotatedPt = rotate45(orthoX, orthoY, HALFSIZE, HALFSIZE);
  rotatedPt[1] = rotatedPt[1] / 2 + SIZE / 4;
  return rotatedPt;
}

export function screenXYtoTileLoc(x, y) {
  const scaledY = (y - HALFSIZE) * 2 + HALFSIZE;
  const rotatedPt = rotate45CC(x, scaledY, HALFSIZE, HALFSIZE);

  rotatedPt[0] /= TSIZE;
  rotatedPt[1] /= TSIZE;
  return rotatedPt;
}

// random integer x where a <= x <= b
export function randInt(a, b) {
  const range = b - a + 1;
  return Math.floor(a + Math.random() * range);
}

export function randNorm() {
  return Math.random() - Math.random();
}

export function randUniform() {
  return Math.random() * 2 - 1;
}
