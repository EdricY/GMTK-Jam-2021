import { applicantSpawner } from "./applicantSpawner";
import { getEl, LOCATIONS, MAINTENANCE_LEVELS } from "./globals";
import { imgs, imgSources, sounds } from "./load";
import { roadCost } from "./road";
import { shark } from "./shark";
import { triggerEndGame } from "./state";
import { welcomeState } from "./welcome";

const allBoxes = [
  // all infoBox divs
  getEl("infoBox-welcome"),
  getEl("infoBox-house"),
  getEl("infoBox-applicant"),
  getEl("infoBox-sand"),
  getEl("infoBox-property"),
  getEl("infoBox-eom"),
  getEl("infoBox-dead"),
];

export class ActionPanel {
  constructor() {
    this.currentPanelType = "";
    allBoxes.forEach((b) => b.classList.add("nodisplay"));
  }

  closeAll() {
    this.currentPanelType = "";
    allBoxes.forEach((b) => b.classList.add("nodisplay"));
    applicantSpawner.setButtonState();
  }

  openWelcomeBox() {
    this.currentPanelType = "welcome";
    allBoxes.forEach((b) => b.classList.add("nodisplay"));
    getEl("infoBox-welcome").classList.remove("nodisplay");

    welcomeState.step = -1;
    welcomeState.nextStep();
  }

  openHouseBox(house) {
    if (house.owned) {
      this.openPropertyBox(house);
      return;
    }
    this.currentPanelType = "house";
    allBoxes.forEach((b) => b.classList.add("nodisplay"));
    getEl("infoBox-house").classList.remove("nodisplay");
    getEl("image-house").src = imgSources[house.imgname];
    getEl("name-house").innerText = house.name;
    getEl("value-house").innerText = Math.round(house.basePrice);
    getEl("rent-house").innerText = Math.round(house.rent);
    getEl("location-house").innerText = house.getLocation();
    getEl("maintenance-house").innerText = MAINTENANCE_LEVELS[house.maintenance];
    getEl("occupant-house").innerText = house.tenant ? house.tenant.name + house.getTenantState() : "Vacant";
  }

  openPropertyBox(property) {
    if (!property.owned) {
      this.openHouseBox(property);
      return;
    }
    this.currentPanelType = "property";
    allBoxes.forEach((b) => b.classList.add("nodisplay"));
    getEl("infoBox-property").classList.remove("nodisplay");
    getEl("image-property").src = imgSources[property.imgname];
    getEl("name-property").innerText = property.name;
    getEl("value-property").innerText = Math.round(property.basePrice);
    getEl("rent-property").innerText = Math.round(property.rent);
    getEl("location-property").innerText = property.getLocation();
    getEl("maintenance-property").innerText = MAINTENANCE_LEVELS[property.maintenance];
    getEl("occupant-property").innerText = property.tenant ? property.tenant.name + property.getTenantState() : "Vacant";

    getEl("evictBtn").disabled = !property.tenant;
    getEl("repairBtn").disabled = !property.broken;
    getEl("repairBtn").innerText = "Repair" + (property.broken ? " (" + property.costToFix + ")" : "");
  }

  openSandBox(sandTile) {
    this.currentPanelType = "sand";

    allBoxes.forEach((b) => b.classList.add("nodisplay"));
    getEl("infoBox-sand").classList.remove("nodisplay");
    if (sandTile.road) {
      getEl("image-sand").src = imgSources[sandTile.imgname];
      getEl("name-sand").innerText = "Shell Road";
      getEl("details-sand").innerText = "A road paved with shells";
      getEl("roadBtnRow").classList.add("nodisplay");
    } else {
      getEl("image-sand").src = imgSources[sandTile.imgname];
      getEl("name-sand").innerText = "Sand";
      getEl("details-sand").innerText = "A large patch of sand.";
      getEl("roadBtnRow").classList.remove("nodisplay");
      getEl("roadCost").innerText = roadCost.cost;
    }
  }

  openApplicantBox(applicant) {
    this.currentPanelType = "applicant";
    allBoxes.forEach((b) => b.classList.add("nodisplay"));
    getEl("infoBox-applicant").classList.remove("nodisplay");
    applicantSpawner.setButtonState();

    getEl("image-applicant").src = imgSources[applicant.imgname];
    getEl("name-applicant").innerText = applicant.name;
    getEl("location-applicant").innerText = LOCATIONS[applicant.location];
    getEl("maintenance-applicant").innerText = MAINTENANCE_LEVELS[applicant.maintenance];
    getEl("color-applicant").innerText = applicant.color;

    getEl("image-residence").src = imgSources.question;
    getEl("name-residence").src = "Select an owned Residence";
    getEl("joinBtn").disabled = true;

    // reset residence half
    this.selectResidence(null);
  }

  selectResidence(residence) {
    if (this.currentPanelType != "applicant") return;
    if (!residence || !residence.owned) {
      getEl("image-residence").src = imgSources.question;
      getEl("name-residence").innerText = "Select an owned Residence";
      getEl("joinBtn").disabled = true;
      getEl("value-residence").innerText = "?";
      getEl("rent-residence").innerText = "?";
      getEl("location-residence").innerText = "?";
      getEl("maintenance-residence").innerText = "?";
      getEl("occupant-residence").innerText = "?";
      return;
    }

    getEl("joinBtn").disabled = false;

    if (!residence.tenant) {
      getEl("joinBtn").innerText = "Join";
    } else {
      getEl("joinBtn").innerText = "Evict & Join";
    }

    getEl("image-residence").src = imgSources[residence.imgname];
    getEl("name-residence").innerText = residence.name;
    getEl("value-residence").innerText = Math.round(residence.basePrice);
    getEl("rent-residence").innerText = Math.round(residence.rent);
    getEl("location-residence").innerText = residence.getLocation();
    getEl("maintenance-residence").innerText = MAINTENANCE_LEVELS[residence.maintenance];
    getEl("occupant-residence").innerText = residence.tenant ? residence.tenant.name + residence.getTenantState() : "Vacant";
  }

  openEOM() {
    this.currentPanelType = "eom";
    sounds.speech.currentTime = 0;
    sounds.speech.play();
    allBoxes.forEach((b) => b.classList.add("nodisplay"));
    getEl("infoBox-eom").classList.remove("nodisplay");
    applicantSpawner.setButtonState();

    getEl("sharkMsg").innerHTML = "I'm back. This month's payment is...<br>" + shark.cost;
    getEl("sharkProgressBorder").classList.remove("nodisplay");
    getEl("sharkMsgBtns").classList.add("nodisplay");
    getEl("sharkPayBtns").classList.add("nodisplay");
    setTimeout(() => {
      getEl("sharkPayBtns").classList.remove("nodisplay");
    }, 1000);
  }

  payLater() {
    this.currentPanelType = "";
    shark.skip();
    getEl("sharkPayBtns").classList.add("nodisplay");
    getEl("sharkProgressBorder").classList.add("nodisplay");

    getEl("sharkMsg").innerText = shark.getMessage();
    getEl("sharkMsgBtns").classList.remove("nodisplay");
  }

  paidShark() {
    this.currentPanelType = "";
    shark.paid();

    getEl("sharkPayBtns").classList.add("nodisplay");
    getEl("sharkProgressBorder").classList.add("nodisplay");

    getEl("sharkMsg").innerText = "Thanks bud! Same time next month. Hahaha!";
    getEl("sharkMsgBtns").classList.remove("nodisplay");
  }

  openDead(msg) {
    this.currentPanelType = "eom";
    allBoxes.forEach((b) => b.classList.add("nodisplay"));
    getEl("infoBox-dead").classList.remove("nodisplay");
    getEl("deadMsg").innerText = msg;
    triggerEndGame();
  }
}

export const actionPanel = new ActionPanel();
