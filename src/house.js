import { TLONGDIAG, MAINTENANCE_LEVELS, getEl, houseNames, LOCATIONS } from "./globals";
import { imgs } from "./load";
import { randInt, randUniform, tileLocToScreenXY } from "./math";
import { map } from "./map";
import { shellNumber } from "./shell";
import { actionPanel } from "./actionPanel";
import { sounds } from "./load";
import { buyFlash, repairFlash } from "./buttons";
import { selectedTile } from "./cursor";
import { particleManager } from "./particles";
import { find, ufMap } from "./road";

const sandStretch = TLONGDIAG / 92; // imgs.sand.width

let availableHouseNames = JSON.parse(JSON.stringify(houseNames));

class AnemoneBase {
  constructor(i, j, basePrice) {
    const [x, y] = tileLocToScreenXY(i, j);
    this.x = x;
    this.y = y;
    this.i = i;
    this.j = j;

    this.moneyTimer = 0;
    this.moneyDur = 60;
    this.moneyAmount = 0;

    this.lastDelta = 0;

    if (availableHouseNames.length === 0) {
      availableHouseNames = JSON.parse(JSON.stringify(houseNames));
      availableHouseNames = availableHouseNames.filter((x) => map.mapData.flat().find((y) => y.name === x) === undefined);
    }

    this.basePrice = basePrice;
    this.tenant = null;
    this.owned = false;
    this.lastPriceAdj = Date.now();
    this.isHouse = true;
    this.broken = false;
    this.costToFix = 0;

    this.maintenance = Math.floor(Math.random() * MAINTENANCE_LEVELS.length);

    this.breakChance = 0.02 * (this.maintenance + 1);
  }

  get rent() {
    return Math.round(this.basePrice / 10);
  }

  buy() {
    if (this.owned) {
      return;
    }

    if (shellNumber.actual < this.basePrice) {
      buyFlash(500);
      return;
    }

    sounds.coins.currentTime = 0;
    sounds.coins.play();

    this.owned = true;
    shellNumber.change(-this.basePrice);
  }

  repair() {
    if (!this.owned || !this.broken) {
      return;
    }

    if (shellNumber.actual < this.costToFix) {
      repairFlash(500);
      return;
    }

    sounds.craft.currentTime = 0;
    sounds.craft.play();

    shellNumber.change(-this.costToFix);
    this.broken = false;
    getEl("repairBtn").disabled = true;
    getEl("occupant-property").innerText = this.tenant ? this.tenant.name + this.getTenantState() : "Vacant";
  }

  evict() {
    if (!this.tenant) {
      return;
    }

    this.tenant = null;
    // getEl("evictBtn").disabled = true;
    this.select();
  }

  sell() {
    if (!this.owned) {
      return;
    }
    sounds.moneybag.currentTime = 0;
    sounds.moneybag.play();

    this.owned = false;
    this.broken = false;
    this.tenant = null;
    shellNumber.change(this.basePrice);
  }

  payRent() {
    const node = ufMap[this.i][this.j];
    const ufHouses = find(node).houses;
    let bonus = 0;
    if (ufHouses > 2) {
      bonus = Math.round((ufHouses / 10) * this.rent);
      bonus = Math.min(bonus, this.basePrice / 3);
    }
    const amt = Math.round(this.rent) + bonus;
    particleManager.generate(this.x, this.y);

    shellNumber.change(amt);
    this.moneyAmount = amt;
    this.moneyTimer = this.moneyDur;
  }

  getTenantModifier() {
    let modifier = 0;
    if (this.tenant) {
      if (LOCATIONS[this.tenant.location] === this.getLocation()) {
        modifier += 0.2;
      } else {
        modifier -= 0.3;
      }

      if (this.tenant.maintenance > this.maintenance) {
        modifier += 0.15;
      } else if (this.tenant.maintenance === this.maintenance) {
        modifier += 0.1;
      } else {
        modifier -= 0.2;
      }

      if (this.tenant.color === this.color) {
        modifier += 0.2;
      } else {
        modifier -= 0.4;
      }
    }

    if (this.owned && this.broken) {
      modifier -= 0.9;
    }

    return modifier;
  }

  getTenantState() {
    let modifier = this.getTenantModifier();

    if (modifier < 0) {
      return " (😟)";
    }
    if (modifier < 0.25) {
      return " (😐)";
    }
    return " (😊)";
  }

  adjustPrice(marketFrac) {
    const maxMove = this.basePrice / 10;
    let frac = marketFrac + 0.5 * randUniform();

    if (this.tenant) {
      let modifier = this.getTenantModifier();
      frac += modifier;
      // this.basePrice = this.basePrice + ;
      // this.lastPriceAdj = Date.now();
      // this.basePrice = Math.max(this.basePrice, 1);
      // this.rent = Math.round(this.basePrice / 40);
      // this.rent = Math.max(this.rent, 1);
    }

    let delta = Math.round(frac * maxMove);

    if (this.color == "Pink" && delta + this.basePrice > 250) {
      delta = 0;
    }
    this.basePrice += delta;
    this.lastDelta = delta;
  }

  getLocation() {
    if (this.i < 6 && this.j < 6) {
      return "North";
    }
    if (this.i < 6 && this.j >= 6) {
      return "East";
    }
    if (this.i >= 6 && this.j < 6) {
      return "West";
    }
    return "South";
  }

  select() {
    actionPanel.openHouseBox(this);
    if (sounds.bubble.currentTime > 0) {
      sounds.bubble.currentTime = 0;
    }
    sounds.bubble.volume = 0.7;
    sounds.bubble.play();
  }

  cycle(marketFrac) {
    if (this.owned && this.tenant && Math.random() < this.breakChance && shellNumber.lifetimeMax > 300) {
      this.broken = true;
      this.costToFix = Math.round(this.basePrice / 10) + 1;
    }

    this.adjustPrice(marketFrac);
    if (selectedTile.i === this.i && selectedTile.j === this.j) {
      getEl("name-house").innerText = this.name;
      getEl("name-property").innerText = this.name;
      getEl("name-residence").innerText = this.name;
      getEl("value-house").innerText = Math.round(this.basePrice);
      getEl("value-property").innerText = Math.round(this.basePrice);
      getEl("value-residence").innerText = Math.round(this.basePrice);
      getEl("rent-house").innerText = Math.round(this.rent);
      getEl("rent-property").innerText = Math.round(this.rent);
      getEl("rent-residence").innerText = Math.round(this.rent);
      getEl("occupant-property").innerText = this.tenant ? this.tenant.name + this.getTenantState() : "Vacant";

      if (this.broken) {
        getEl("repairBtn").innerText = "Repair (" + this.costToFix + ")";
        getEl("repairBtn").disabled = false;
      }
    }
  }

  draw(ctx) {
    if (this.owned) {
      map.strokeLoc(ctx, this.i, this.j, "#ff00cc", 3);
    }
    if (!this.isGrand) {
      let imgname = this.imgname;
      if (this.imgframeNames) {
        const frame = Math.floor((Date.now() + this.offset) / 1500) % 4;
        imgname = this.imgframeNames[frame];
      }

      ctx.drawImage(
        imgs[imgname],
        this.x - TLONGDIAG / 2,
        this.y - (imgs[imgname].height * sandStretch) / 2,
        TLONGDIAG,
        imgs[imgname].height * sandStretch
      );
    } else {
      const frame = Math.floor(Date.now() / 1000) % 3;
      const imgname = ["anemone41", "anemone42", "anemone43"][frame];

      ctx.drawImage(
        imgs[imgname],
        this.x - TLONGDIAG,
        this.y - (imgs[imgname].height * sandStretch) / 2,
        TLONGDIAG * 2,
        imgs[imgname].height * sandStretch
      );
    }
    if (this.broken) {
      const offset = Math.sin(Date.now() / 100) * 5;
      ctx.drawImage(imgs.exclamation, this.x - imgs.exclamation.width / 2, this.y - imgs.exclamation.height - offset);
    }
    ctx.textAlign = "center";
    ctx.font = "bold 28px Verdana";

    ctx.fillStyle = "black";

    if (this.owned) {
      let tenantName = "Vacant";
      if (this.tenant) tenantName = this.tenant.name.split(" ").pop();
      ctx.fillText(tenantName, this.x, this.y - 15);
      ctx.fillText(this.basePrice, this.x, this.y + 15);
      // ctx.fillText(this.getTenantModifier(), this.x, this.y - 30);
    } else {
      let yoffset = this.isGrand ? 20 : 10;
      ctx.fillText(this.basePrice, this.x, this.y - yoffset);
    }

    if (this.moneyTimer > 0) {
      ctx.font = "bold 28px Verdana";
      ctx.fillStyle = "#89FFD2";

      this.moneyTimer--;
      const frac = this.moneyTimer / this.moneyDur;
      ctx.fillText("+" + this.moneyAmount, this.x, this.y - (1 - frac) * 50);
    }
  }
}

export class BasicAnemone extends AnemoneBase {
  constructor(i, j) {
    let basePrice = 50 + randInt(-25, 25);
    super(i, j, basePrice);
    this.imgname = ["anemone11", "anemone12", "anemone13"][randInt(0, 2)];
    this.imgframeNames = ["anemone11", "anemone12", "anemone13", "anemone12"];
    this.offset = randInt(0, 4000);

    this.color = "Pink";
    this.name = pinkHouseNames[pinkHouseCounter];
    pinkHouseCounter = (pinkHouseCounter + 1) % pinkHouseNames.length;
  }
}

export class TallAnemone extends AnemoneBase {
  constructor(i, j) {
    let basePrice = 1000 + randInt(-50, 50);
    super(i, j, basePrice);
    this.imgname = ["anemone21", "anemone22", "anemone23"][randInt(0, 2)];
    this.imgframeNames = ["anemone21", "anemone22", "anemone23", "anemone22"];
    this.offset = randInt(0, 4000);
    this.name = grayHouseNames[grayHouseCounter];
    grayHouseCounter = (grayHouseCounter + 1) % grayHouseNames.length;

    this.color = "Gray";
  }
}

export class GrandAnemone extends AnemoneBase {
  constructor(i, j) {
    let basePrice = 99999;
    super(i, j, basePrice);
    this.imgname = ["anemone41", "anemone42", "anemone43"][randInt(0, 2)];

    this.name = "Grand Anemone";
    this.isGrand = true;
  }

  // Don't want the price to change.
  cycle() {}
}

let pinkHouseCounter = 0;
const pinkHouseNames = [
  "Anemone Corner",
  "Fishers Commons",
  "Riverswood Cottage",
  "Stonewill Gables",
  "Wild Willow Place",
  "Troutriver Place",
  "Beechbury Residence",
  "Foreherd House",
  "Suldal Place",
  "Remlins Residence",
  "Pardel Pad",
  "Nordon House",
  "Graceville Loft",
  "Edgeriver Commons",
  "Froglake Place",
  "Beechbury Residence",

  "Foreherd House",
  "Suldal Place",
  "Remlins Residence",
  "Pardel Loft",
  "Nordon House",
  "Grapevine Loft",
  "Graceville Loft",
  "Edgeriver Loft",
  "Edgeriver Loft",
  "Froglake Place",
  "Beechbury Residence",
  "Foreherd House",
  "Suldal Place",
  "Remlins Residence",
  "Pardel Loft",
  "Nordon House",
  "Grapevine Loft",
  "Graceville Loft",
  "Edgeriver Loft",
];

let grayHouseCounter = 0;
const grayHouseNames = [
  "Foreherd Chateau",
  "Suldal Estate",
  "Remlins Residence",
  "Pardel Manor",
  "Nordon Chateau",
  "Grapevine Manor",
  "Graceville Manor",
  "Edgeriver Manor",
  "Froglake Estate",
  "Summergrove Chateau",
  "Livingtero Manor",
  "Fullercard Chateau",
  "Consworth Chateau",
  "Sinrett Chateau",
  "Buckfort Chateau",
  "Ivywood Mansion",
  "Newpoint Mansion",
  "Eastmeadow Chateau",
  "Gracewoods Estate",
  "Seapoint Residence",
  "Mauner Manor",
  "Mulsay Residence",
  "Pakennelly Mansion",
  "Colerene Chateau",
  "Rothsnor Residence",
  "Castle Hill Residence",
  "Starlight Residence",
  "Evergreen Valley Estate",
  "Crow Valley Chateau",
  "Blossomfall Mansion",
  "Blanson Manor",
  "Goldrow Manor",
  "Rainnell Estate",
  "Warridge Manor",
  "Coulton Manor",
];
