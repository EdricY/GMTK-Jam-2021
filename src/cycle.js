import { actionPanel } from "./actionPanel";
import { CYCLE_MILISECONDS, getEl, MONTHS } from "./globals";
import { map } from "./map";
import { randUniform } from "./math";

const MONTH_DUR = 28;

export class CycleState {
  constructor() {
    this.setup();
  }

  setup() {
    this.cycleStart = Date.now();
    this.pauseTime = 0;
    this.paused = false;
    this.day = 0;
    this.month = 0;
  }

  pause() {
    this.pauseTime = Date.now();
    this.paused = true;
  }

  unPause() {
    this.cycleStart = Date.now() - (this.pauseTime - this.cycleStart);
    this.paused = false;
  }

  update() {
    if (this.paused) {
      return;
    }

    if (Date.now() - this.cycleStart > CYCLE_MILISECONDS) {
      this.cycle();
    }
  }

  cycle() {
    this.cycleStart = Date.now();
    this.day++;

    let housesWithTenants = map.mapData.flat().filter((x) => x.isHouse && x.tenant);
    housesWithTenants.forEach((house) => house.payRent());

    if (this.day > MONTH_DUR) {
      this.month = (this.month + 1) % 12;
      this.day = 1;

      actionPanel.openEOM();
    }

    const marketFrac = 0.1 + randUniform() * 0.5; // skew towards positive
    map.cycle(marketFrac);

    let date = getEl("date");
    date.innerText = MONTHS[this.month] + " " + this.day;
  }
}

export const cycleState = new CycleState();
