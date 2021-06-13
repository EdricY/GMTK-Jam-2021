import { TAU, HALFRT2, TLONGDIAG, ctx, TILE_G, TILE_H, TILE_R, TILE_S, TILE_T, TILE_W } from "./globals";
import { BasicAnemone, TallAnemone, GrandAnemone } from "./house";
import { imgs } from "./load";
import { tileLocToScreenXY } from "./math";
import { find, ufMap } from "./road";
import { SandTile } from "./sand";
import { shell } from "./shell";
import { level1, levelManager } from "./levelManager";
import { particleManager } from "./particles";

const FieldNumbers = [TILE_S, TILE_R, TILE_G];

const ObjectNumbers = [TILE_H, TILE_T, TILE_W];
export const HouseNumbers = [TILE_H, TILE_T, TILE_W];

const sandStretch = TLONGDIAG / 92; // imgs.sand.width

class FieldMap {
  setup() {
    this.mapData = [];
    for (let i = 0; i < levelManager.mapNumbers.length; i++) {
      this.mapData.push([]);
      for (let j = 0; j < levelManager.mapNumbers[0].length; j++) {
        const tileNum = levelManager.mapNumbers[i][j];
        if (tileNum == TILE_H) {
          this.mapData[i][j] = new BasicAnemone(i, j);
        }
        if (tileNum == TILE_T) {
          this.mapData[i][j] = new TallAnemone(i, j);
        }
        if (tileNum == TILE_S) {
          this.mapData[i][j] = new SandTile(i, j);
        }
        if (tileNum == TILE_W) {
          this.mapData[i][j] = new GrandAnemone(i, j);
        }
      }
    }
  }

  drawField(ctx) {
    for (let i = 0; i < this.mapData.length; i++) {
      for (let j = 0; j < this.mapData[0].length; j++) {
        const tileNum = levelManager.mapNumbers[i][j];
        const tile = this.mapData[i][j];

        const [xx, yy] = tileLocToScreenXY(i, j);
        if (tileNum == TILE_S && tile?.draw) {
          tile.draw(ctx);
        } else {
          ctx.drawImage(imgs.sand, xx - TLONGDIAG / 2, yy - (imgs.sand.height * sandStretch) / 2, TLONGDIAG, imgs.sand.height * sandStretch);
        }

        // if (tileNum == TILE_R) {
        //   ctx.drawImage(imgs.road, xx - TLONGDIAG / 2, yy - (imgs.road.height * roadStretch) / 2, TLONGDIAG, imgs.road.height * roadStretch);
        // } else if (tileNum == TILE_G) {
        //   ctx.drawImage(imgs.grass, xx - TLONGDIAG / 2, yy - (imgs.grass.height * grassStretch) / 2, TLONGDIAG, imgs.grass.height * grassStretch);
        // } else if (tileNum == TILE_S) {
        //   tile.draw?.(ctx);
        //   // ctx.drawImage(imgs.sand, xx - TLONGDIAG / 2, yy - (imgs.sand.height * sandStretch) / 2, TLONGDIAG, imgs.sand.height * sandStretch);
        // } else {
        // }
      }
    }
  }

  drawObjects(ctx) {
    for (let i = 0; i < this.mapData.length; i++) {
      for (let j = 0; j < this.mapData[0].length; j++) {
        const tileNum = levelManager.mapNumbers[i][j];
        const tile = this.mapData[i][j];
        if (ObjectNumbers.includes(tileNum)) {
          tile?.draw?.(ctx);
        }

        if (shell.i == i && shell.j == j) {
          shell.draw(ctx);
        }

        const [xx, yy] = tileLocToScreenXY(i, j);
        const node = ufMap[i][j];
        const ufHouses = find(node).houses;

        if (ufHouses > 1) {
          let r = Math.min(2 + ufHouses / 2, 5);
          particleManager.generate(xx, yy, Math.random() < 0.1 ? 1 : 0, r);
          // ctx.font = "bold 30px Verdana";
          // ctx.fillStyle = "gray";
          // ctx.fillText(ufHouses, xx, yy);
        }
      }
    }
  }

  cycle(marketFrac) {
    for (let i = 0; i < this.mapData.length; i++) {
      for (let j = 0; j < this.mapData[0].length; j++) {
        const tile = this.mapData[i][j];
        const [xx, yy] = tileLocToScreenXY(i, j);
        if (tile?.cycle) {
          tile.cycle(marketFrac);
        }
      }
    }
  }

  strokeLoc(ctx, i, j, color = "green", lineWidth = 4) {
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

  getOwnedProperties() {
    return this.mapData.flat().filter((x) => x.owned);
  }
}

export const map = new FieldMap();
