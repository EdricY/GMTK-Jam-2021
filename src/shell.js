import { getEl, N, TILE_S, TLONGDIAG } from "./globals";
import { randInt, tileLocToScreenXY } from "./math";
import { imgs } from "./load";
import { levelManager } from "./levelManager";

const shellStretch = TLONGDIAG / 64; // imgs.grass.width

const shelltime = 1000;

export class Shell {
  i = -1;
  j = -1;
  alive = false;
  timer = shelltime + Math.floor(Math.random() * shelltime);
  offsetI = Math.random() * -0.25 + 0.5;
  offsetJ = Math.random() * -0.25 + 0.5;

  imgname = "shell";

  place() {
    this.imgname = ["shell", "shell2", "shell3", "shell4"][randInt(0, 3)];
    let tile = null;
    this.timer = shelltime + Math.floor(Math.random() * shelltime);
    this.offsetI = Math.random() * -0.5;
    this.offsetJ = Math.random() * -0.5;
    do {
      this.i = Math.floor(Math.random() * N);
      this.j = Math.floor(Math.random() * N);
      tile = levelManager.mapNumbers[this.i][this.j];
    } while (!(tile == TILE_S));
  }

  pickup() {
    this.alive = false;
    this.place();
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
      imgs[this.imgname],
      x - TLONGDIAG / 2 + this.offsetI,
      y - (imgs.shell.height * shellStretch) / 2 + this.offsetJ,
      TLONGDIAG,
      imgs.shell.height * shellStretch
    );
  }
  getAmount() {
    const base = shellNumber.lifetimeMax / 20;
    return randInt(base / 2, base);
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
      ctx.font = "bold 28px Verdana";
      ctx.fillStyle = "#89FFD2";
      ctx.textAlign = "center";

      ctx.fillText("+ " + this.amt, this.x, this.y - (120 - this.timer) / 10);
    }
  }
}
export const shellPickup = new ShellPickup();

// controller for the html text display
class ShellNumber {
  constructor() {
    this.setup();
  }

  setup() {
    this.actual = 0;
    this.display = 0;
    this.step = 0;
    this.lifetimeMax = 0;
  }

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
    this.display = this.actual;
    this.actual += delta;
    this.step = delta / 60;

    if (this.actual > this.lifetimeMax) {
      this.lifetimeMax = this.actual;
    }
  }
}
export const shellNumber = new ShellNumber();
