import { getEl, N, TILE_S, TLONGDIAG } from "./globals";
import { tileLocToScreenXY } from "./math";
import { imgs } from "./load";
import { mapData } from "./map";

const shellStretch = TLONGDIAG / 64; // imgs.grass.width

const shelltime = 100;

export class Shell {
  i = -1;
  j = -1;
  alive = false;
  timer = shelltime + Math.floor(Math.random() * shelltime);
  offsetI = Math.random() * -0.25 + 0.5;
  offsetJ = Math.random() * -0.25 + 0.5;

  place() {
    let tile = null;
    this.timer = shelltime + Math.floor(Math.random() * shelltime);
    this.offsetI = Math.random() * -0.5;
    this.offsetJ = Math.random() * -0.5;
    do {
      this.i = Math.floor(Math.random() * N);
      this.j = Math.floor(Math.random() * N);
      tile = mapData[this.i][this.j];
    } while (!(tile == 0 || tile == 1 || tile == TILE_S));
  }

  pickup() {
    this.alive = false;
    this.place();
    console.log("pickup");
  }

  update() {
    this.timer--;
    if (this.timer <= 0) {
      this.alive = !this.alive;
      this.timer = shelltime + Math.floor(Math.random() * shelltime);
      this.place();
    }
  }
  draw(ctx) {
    if (!this.alive) return;

    const [x, y] = tileLocToScreenXY(this.i, this.j);
    ctx.drawImage(
      imgs.shell,
      x - TLONGDIAG / 2 + this.offsetI,
      y - (imgs.shell.height * shellStretch) / 2 + this.offsetJ,
      TLONGDIAG,
      imgs.shell.height * shellStretch
    );
  }
}

export const shell = new Shell();

// pickup text animation
export class ShellPickup {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.timer = 0;
    this.timerlength = 120;
    this.amt = 0;
  }
  trigger(x, y, amt) {
    console.log(x, y, amt);
    this.x = x;
    this.y = y;
    this.timer = 120;
    this.amt = amt;
  }
  update() {
    if (this.timer > 0) this.timer--;
  }
  draw(ctx) {
    if (this.timer > 0) {
      ctx.font = "14px sans-serif";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText("+ " + this.amt + " shells", this.x, this.y - (120 - this.timer) / 10);
    }
  }
}
export const shellPickup = new ShellPickup();

// controller for the html text display
class ShellNumber {
  actual = 0;
  display = 0;

  step = 0;

  update() {
    if (this.step != 0) {
      this.display += this.step;
    }
    if (this.step > 0 && this.display >= this.actual) {
      this.display = this.actual;
      this.step = 0;
    }
    if (this.step < 0 && this.display <= this.actual) {
      this.display = this.actual;
      this.step = 0;
    }
  }

  draw() {
    getEl("shellCount").innerText = Math.floor(this.display);
  }

  change(delta) {
    if (this.actual + delta < 0) {
      console.log("not enough money");
      return;
    }

    this.actual += delta;
    this.step = delta / 60;
  }
}
export const shellNumber = new ShellNumber();
