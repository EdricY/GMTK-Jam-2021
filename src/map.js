import { TAU, HALFRT2, TLONGDIAG, ctx } from "./globals";
import { imgs } from "./load";
import { tileLocToScreenXY } from "./math";

export const mapData = [
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
];

const grassStretch = TLONGDIAG / 32; // imgs.grass.width

class FieldMap {
  mapData = mapData;
  drawField(ctx) {
    for (let i = 0; i < mapData.length; i++) {
      for (let j = 0; j < mapData[0].length; j++) {
        const tile = mapData[i][j];

        const [xx, yy] = tileLocToScreenXY(i, j);

        if (tile) {
          ctx.drawImage(imgs.grass, xx - TLONGDIAG / 2, yy - (imgs.grass.height * grassStretch) / 2, TLONGDIAG, imgs.grass.height * grassStretch);
        }
        ctx.fillRect(xx, yy, 10, 10);
      }
    }
  }

  strokeLoc(i, j) {
    ctx.save();
    const [x, y] = tileLocToScreenXY(i, j);
    ctx.translate(x, y - TLONGDIAG / 4);
    ctx.beginPath();
    ctx.moveTo(0, TLONGDIAG / 2);
    ctx.lineTo(TLONGDIAG / 2, TLONGDIAG / 4);
    ctx.lineTo(TLONGDIAG, TLONGDIAG / 2);
    ctx.lineTo(TLONGDIAG / 2, (3 * TLONGDIAG) / 4);
    ctx.lineTo(0, TLONGDIAG / 2);
    ctx.closePath();
    ctx.strokeStyle = "yellow";
    ctx.stroke();

    ctx.restore();
  }
}

export const map = new FieldMap();
