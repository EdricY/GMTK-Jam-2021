export const getEl = (x) => document.getElementById(x);
export const SIZE = 1000;
export const N = 10;
export const HALFSIZE = SIZE / 2;
export const canvas = getEl("canvas");
canvas.width = SIZE;
canvas.height = SIZE;
export const ctx = canvas.getContext("2d");
export const TAU = Math.PI * 2;
export const HALFRT2 = Math.SQRT1_2;
export const TSIZE = SIZE / N; //TLONGDIAG / Math.SQRT2;
export const TLONGDIAG = TSIZE * Math.SQRT2;
// export const TSIDE = (TSIZE * Math.sqrt(5)) / 4;

export const lerp = (a, b, frac) => a * (1 - frac) + b * frac;
