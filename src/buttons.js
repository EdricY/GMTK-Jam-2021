import { actionPanel } from "./actionPanel";
import { applicantSpawner } from "./applicantSpawner";
import { selectedTile } from "./cursor";
import { getEl, inBounds } from "./globals";
import { sounds } from "./load";
import { map } from "./map";
import { buildUFRoad, roadCost } from "./road";
import { shark } from "./shark";
import { shellNumber } from "./shell";
import { welcomeState } from "./welcome";

export const setupButtons = () => {
  getEl("viewNextApplicantBtn").addEventListener("click", () => {
    if (sounds.bloop.currentTime > 0) {
      sounds.bloop.currentTime = 0;
    }
    sounds.bloop.volume = 0.3;
    sounds.bloop.speed = 4;
    sounds.bloop.play();
    applicantSpawner.viewNextApplicant();
  });

  getEl("buyBtn").onclick = () => {
    if (!inBounds(selectedTile.i, selectedTile.j)) return;
    const selectedHouse = map.mapData[selectedTile.i][selectedTile.j];
    if (!selectedHouse.basePrice) return;
    selectedHouse.buy();
    actionPanel.openPropertyBox(selectedHouse);
  };
  getEl("sellBtn").onclick = () => {
    if (!inBounds(selectedTile.i, selectedTile.j)) return;
    const selectedHouse = map.mapData[selectedTile.i][selectedTile.j];
    if (!selectedHouse.basePrice) return;
    selectedHouse.sell();
    actionPanel.closeAll();
  };
  getEl("repairBtn").onclick = () => {
    if (!inBounds(selectedTile.i, selectedTile.j)) return;
    const selectedHouse = map.mapData[selectedTile.i][selectedTile.j];
    if (!selectedHouse.basePrice) return;
    selectedHouse.repair();
  };

  getEl("welcomeBtn").onclick = () => {
    welcomeState.nextStep();
  };

  getEl("denyBtn").onclick = () => {
    actionPanel.closeAll();
    applicantSpawner.applicants[0].expireTimer = 0;
  };

  getEl("joinBtn").onclick = () => {
    const applicant = applicantSpawner.applicants[0];
    const house = map.mapData[selectedTile.i][selectedTile.j];
    if (!applicant || !house) return;
    house.evict();
    house.tenant = applicant;
    applicant.expireTimer = 0;
    actionPanel.closeAll();
    sounds.bloop.currentTime = 0;
    sounds.bloop.play();
  };
  getEl("evictBtn").onclick = () => {
    const house = map.mapData[selectedTile.i][selectedTile.j];
    if (!house) return;
    house.evict();
  };

  getEl("payEomBtn").onclick = () => {
    if (shellNumber.actual >= shark.cost) {
      shellNumber.change(-shark.cost);
      actionPanel.paidShark();
      sounds.coins.currentTime = 0;
      sounds.coins.play();
    } else {
      actionPanel.openDead("You can't fool me! There's not enough here. I never told you what happened to my last property manager...");
    }
  };
  getEl("laterBtn").onclick = () => {
    actionPanel.payLater();
  };
  getEl("dismissSharkBtn").onclick = () => {
    actionPanel.closeAll();
  };

  getEl("roadBtn").onclick = () => {
    if (shellNumber.actual < roadCost.cost) {
      buyRoadFlash(500);
      return;
    }
    sounds.coins.currentTime = 0;
    sounds.coins.play();
    shellNumber.change(-roadCost.cost);
    roadCost.cost += roadCost.increment;
    roadCost.increment += 10;
    const tile = map.mapData[selectedTile.i][selectedTile.j];
    if (tile.road) return;
    tile.changeToRoad();
    buildUFRoad(selectedTile.i, selectedTile.j);
    tile.select();
  };
};

// flashing....
let denyFlashStopTimeout;
export const denyFlash = (time = 500) => {
  // TODO: play a different sound probably.
  sounds.bloop2.currentTime = 0;
  sounds.bloop2.play();

  getEl("denyBtn").classList.add("flash");
  getEl("name-residence").classList.add("flash");
  clearTimeout(denyFlashStopTimeout);
  denyFlashStopTimeout = setTimeout(() => {
    getEl("name-residence").classList.remove("flash");
    getEl("denyBtn").classList.remove("flash");
  }, time);
};

let buyFlashStopTimeout;
export const buyFlash = (time = 500) => {
  // TODO: play a different sound probably.
  sounds.bloop2.currentTime = 0;
  sounds.bloop2.play();

  getEl("buyBtn").classList.add("flash");
  getEl("shellCount").classList.add("flash");
  clearTimeout(buyFlashStopTimeout);
  buyFlashStopTimeout = setTimeout(() => {
    getEl("shellCount").classList.remove("flash");
    getEl("buyBtn").classList.remove("flash");
  }, time);
};

let buyRoadFlashStopTimeout;
export const buyRoadFlash = (time = 500) => {
  // TODO: play a different sound probably.
  sounds.bloop2.currentTime = 0;
  sounds.bloop2.play();

  getEl("roadBtn").classList.add("flash");
  getEl("shellCount").classList.add("flash");
  clearTimeout(buyRoadFlashStopTimeout);
  buyRoadFlashStopTimeout = setTimeout(() => {
    getEl("shellCount").classList.remove("flash");
    getEl("roadBtn").classList.remove("flash");
  }, time);
};

let repairFlashStopTimeout;
export const repairFlash = (time = 500) => {
  // TODO: play a different sound probably.
  sounds.bloop2.currentTime = 0;
  sounds.bloop2.play();

  getEl("repairBtn").classList.add("flash");
  getEl("shellCount").classList.add("flash");
  clearTimeout(repairFlashStopTimeout);
  repairFlashStopTimeout = setTimeout(() => {
    getEl("shellCount").classList.remove("flash");
    getEl("repairBtn").classList.remove("flash");
  }, time);
};

let laterFlashStopTimeout;
export const laterFlash = (time = 500) => {
  // TODO: play a different sound probably.
  sounds.bloop2.currentTime = 0;
  sounds.bloop2.play();

  getEl("laterBtn").classList.add("flash");
  clearTimeout(laterFlashStopTimeout);
  laterFlashStopTimeout = setTimeout(() => {
    getEl("laterBtn").classList.remove("flash");
  }, time);
};
