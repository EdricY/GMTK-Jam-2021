import { actionPanel } from "./actionPanel";
import { getEl } from "./globals";
import { sounds } from "./load";
import { shellNumber } from "./shell";

const sharkDur = 2000;

class Shark {
  constructor() {
    this.setup();
  }
  setup() {
    this.timer = sharkDur;
    this.numSkipped = 0;
    this.cost = 100;
  }
  update() {
    if (actionPanel.currentPanelType == "eom") {
      this.timer--;
    } else {
      this.timer = sharkDur;
    }

    if (this.timer == 0) {
      actionPanel.payLater();
    }
  }
  skip() {
    this.numSkipped++;
    if (this.numSkipped >= 3) {
      actionPanel.openDead("Sorry bud. Not this time. I never told you what happened to my last property manager...");
    }
    this.cost = Math.max(this.cost * 5, Math.floor(shellNumber.lifetimeMax * 1.5));
  }

  paid() {
    this.cost = Math.max(this.cost * 4, Math.floor(shellNumber.lifetimeMax * 1.5));
  }

  getMessage() {
    if (this.numSkipped == 1) {
      return "Okay... but you'll be paying an extra premium next time...";
    }
    if (this.numSkipped == 2) {
      return "You knew the end of the month was coming, right? You're pushing the limit here...";
    }
    if (this.numSkipped == 3) {
      return "I won't be so forgiving next time.";
    }
  }

  draw() {
    getEl("sharkProgress").style.width = (100 * this.timer) / sharkDur + "%";
  }
}

export const shark = new Shark();
