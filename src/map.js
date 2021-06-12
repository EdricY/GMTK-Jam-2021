import { TAU, HALFRT2, TLONGDIAG, ctx, TILE_G, TILE_H, TILE_R, TILE_S } from "./globals";
import BasicAnemone from "./house";
import { imgs } from "./load";
import { tileLocToScreenXY } from "./math";
import { shell } from "./shell";

export const mapData = [
  [TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_R, TILE_S, TILE_S, TILE_S, TILE_S],
  [TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_R, TILE_S, TILE_S, TILE_S, TILE_S],
  [TILE_S, TILE_S, TILE_R, TILE_S, TILE_S, TILE_R, TILE_S, TILE_S, TILE_S, TILE_S],
  [TILE_R, TILE_H, TILE_H, TILE_H, TILE_S, TILE_R, TILE_S, TILE_S, TILE_S, TILE_S],
  [TILE_R, TILE_H, TILE_H, TILE_H, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S, TILE_S],
  [TILE_R, TILE_H, TILE_S, TILE_R, TILE_S, TILE_R, TILE_S, TILE_S, TILE_S, TILE_S],
  [TILE_R, TILE_H, TILE_H, TILE_H, TILE_S, TILE_R, TILE_H, TILE_S, TILE_S, TILE_S],
  [TILE_R, TILE_H, TILE_H, TILE_S, TILE_S, TILE_R, TILE_S, TILE_S, TILE_R, TILE_S],
  [TILE_R, TILE_H, TILE_R, TILE_H, TILE_S, TILE_R, TILE_G, TILE_G, TILE_G, TILE_H],
  [TILE_R, TILE_H, TILE_H, TILE_H, TILE_G, TILE_R, TILE_G, TILE_G, TILE_G, TILE_G],
];

for (let i = 0; i < mapData.length; i++) {
  for (let j = 0; j < mapData[0].length; j++) {
    const tile = mapData[i][j];
    if (tile == TILE_H) {
      mapData[i][j] = new BasicAnemone(i, j);
    }
  }
}

const grassStretch = TLONGDIAG / 32; // imgs.grass.width
const roadStretch = TLONGDIAG / 128; // imgs.road.width
const sandStretch = TLONGDIAG / 92; // imgs.sand.width

class FieldMap {
  mapData = mapData;
  drawField(ctx) {
    for (let i = 0; i < mapData.length; i++) {
      for (let j = 0; j < mapData[0].length; j++) {
        const tile = mapData[i][j];

        const [xx, yy] = tileLocToScreenXY(i, j);

        if (tile == TILE_R) {
          ctx.drawImage(imgs.road, xx - TLONGDIAG / 2, yy - (imgs.road.height * roadStretch) / 2, TLONGDIAG, imgs.road.height * roadStretch);
        } else if (tile == TILE_G) {
          ctx.drawImage(imgs.grass, xx - TLONGDIAG / 2, yy - (imgs.grass.height * grassStretch) / 2, TLONGDIAG, imgs.grass.height * grassStretch);
        } else if (tile == TILE_S) {
          ctx.drawImage(imgs.sand, xx - TLONGDIAG / 2, yy - (imgs.sand.height * sandStretch) / 2, TLONGDIAG, imgs.sand.height * sandStretch);
        } else {
          ctx.drawImage(imgs.sand, xx - TLONGDIAG / 2, yy - (imgs.sand.height * sandStretch) / 2, TLONGDIAG, imgs.sand.height * sandStretch);
        }
      }
    }
  }
  drawObjects(ctx) {
    for (let i = 0; i < mapData.length; i++) {
      for (let j = 0; j < mapData[0].length; j++) {
        const tile = mapData[i][j];
        const [xx, yy] = tileLocToScreenXY(i, j);
        if (tile.draw) {
          tile.draw(ctx);
        }
        if (shell.i == i && shell.j == j) {
          shell.draw(ctx);
        }
      }
    }
  }

  strokeLoc(i, j, color = "green", lineWidth = 4) {
    ctx.save();
    const [x, y] = tileLocToScreenXY(i, j);
    ctx.translate(x - TLONGDIAG / 2, y - TLONGDIAG / 2);
    ctx.beginPath();
    ctx.moveTo(0, TLONGDIAG / 2);
    ctx.lineTo(TLONGDIAG / 2, TLONGDIAG / 4);
    ctx.lineTo(TLONGDIAG, TLONGDIAG / 2);
    ctx.lineTo(TLONGDIAG / 2, (3 * TLONGDIAG) / 4);
    ctx.lineTo(0, TLONGDIAG / 2);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    ctx.restore();
  }
}

export const map = new FieldMap();
