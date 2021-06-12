import { TLONGDIAG, availableHouseNames } from "./globals";
import { imgs } from "./load";
import { randInt, tileLocToScreenXY } from "./math";

const sandStretch = TLONGDIAG / 92; // imgs.sand.width

export default class BasicAnemone {
  constructor(i, j) {
    this.basePrice = 100 + randInt(-100, 100);
    this.tenant = null;
    const [x, y] = tileLocToScreenXY(i, j);
    this.x = x;
    this.y = y;

    let houseNameIndex = Math.floor(Math.random() * availableHouseNames.length);
    this.name = availableHouseNames[houseNameIndex];
    availableHouseNames.splice(houseNameIndex, 1);
    this.imgname = "anemone";

    this.isHouse = true;
  }

  cycle() {}

  draw(ctx) {
    ctx.drawImage(
      imgs.anemone,
      this.x - TLONGDIAG / 2,
      this.y - (imgs.anemone.height * sandStretch) / 2,
      TLONGDIAG,
      imgs.anemone.height * sandStretch
    );
    ctx.textAlign = "center";
    ctx.font = "bold 28px Verdana";
    ctx.fillStyle = "black";
    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 2;
    ctx.fillText(this.basePrice, this.x, this.y - 10);
    // ctx.strokeText(this.basePrice, this.x, this.y - 10);
  }
}
