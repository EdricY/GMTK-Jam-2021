import { actionPanel } from "./actionPanel";
import { TLONGDIAG } from "./globals";
import { imgs } from "./load";
import { randInt, tileLocToScreenXY } from "./math";
import { ufMap } from "./road";

const sandStretch = TLONGDIAG / 92; // imgs.sand.width

export class SandTile {
  constructor(i, j) {
    this.road = false;
    const [x, y] = tileLocToScreenXY(i, j);
    this.x = x;
    this.y = y;

    this.i = i;
    this.j = j;
    this.imgname = ["sand", "sand2", "sand3"][randInt(0, 2)];
  }

  changeToRoad() {
    this.road = true;
    // this.imgname = "road";
    this.imgname = ["road", "road2", "road3"][randInt(0, 2)];
  }

  draw(ctx) {
    ctx.drawImage(
      imgs[this.imgname],
      this.x - TLONGDIAG / 2,
      this.y - (imgs[this.imgname].height * sandStretch) / 2,
      TLONGDIAG,
      imgs[this.imgname].height * sandStretch
    );
  }

  select() {
    actionPanel.openSandBox(this);
  }
}
