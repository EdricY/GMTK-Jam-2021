import { getEl, names } from "./globals";
import { Applicant } from "./applicant";
import { actionPanel, ActionPanel } from "./actionPanel";
import { sounds, imgSources } from "./load";
import { selectedTile } from "./cursor";
import { map } from "./map";

const fishPics = ["fish1", "fish2", "fish3", "fish4", "fish5", "fish6"];
const fishCouplePics = ["couple1", "couple2", "couple3", "couple4", "couple5", "couple6", "couple7", "couple8", "couple9"];

export let applicantDelay = 1700;
export const applicationExpireTime = 3000;

let firstApplicant = true;

export class ApplicantSpawner {
  constructor() {
    this.setup();
  }

  setup() {
    this.nextApplicant = 0;
    this.applicants = [];
    this.resetTimer();
  }

  resetTimer() {
    this.spawnTimer = applicantDelay + Math.floor((Math.random() * applicantDelay) / 2);
  }

  viewNextApplicant() {
    selectedTile.i = -1;
    selectedTile.j = -1;
    if (this.applicants.length === 0) {
      return;
    }
    // give some extra time for the selected one
    this.applicants[0].expireTimer = Math.min(applicationExpireTime, this.applicants[0].expireTimer + applicationExpireTime / 4);
    actionPanel.openApplicantBox(this.applicants[0]);
  }

  spawnApplicant() {
    const ownedNum = map.getOwnedProperties().length;
    if (ownedNum == 0) {
      this.resetTimer();
      return;
    }
    this.resetTimer();
    let name = names[Math.floor(Math.random() * names.length)];
    let img = fishPics[Math.floor(Math.random() * fishPics.length)];
    if (Math.random() < 0.3) {
      let firstLast = name.split(" ");
      name = firstLast[0] + " & " + names[Math.floor(Math.random() * names.length)];
      img = fishCouplePics[Math.floor(Math.random() * fishCouplePics.length)];
    }
    this.applicants.push(new Applicant(name, img));
    this.setButtonState();

    applicantDelay = 1700 - 1000 * (ownedNum / 25);
  }

  setButtonState() {
    if (this.applicants.length == 0) {
      getEl("viewNextApplicantBtn").disabled = true;
    } else if (actionPanel.currentPanelType == "applicant") {
      getEl("viewNextApplicantBtn").disabled = true;
    } else if (actionPanel.currentPanelType == "eom") {
      getEl("viewNextApplicantBtn").disabled = true;
    } else {
      getEl("viewNextApplicantBtn").disabled = false;
      if (firstApplicant) {
        firstApplicant = false;
        getEl("viewNextApplicantBtn").classList.add("flash");
        setTimeout(() => {
          getEl("viewNextApplicantBtn").classList.remove("flash");
        }, 2000);
      }
    }
  }

  update() {
    this.spawnTimer--;
    if (this.spawnTimer <= 0) {
      this.spawnApplicant();
    }

    for (let i = 0; i < this.applicants.length; i++) {
      const applicant = this.applicants[i];
      applicant.update();
      if (this.applicants[0].expireTimer <= 0) {
        if (i == 0 && actionPanel.currentPanelType == "applicant") {
          actionPanel.closeAll();
        }
        this.applicants.splice(i--, 1);
      }
    }
    // let expiredApplicantIndexes = [];
    // this.applicants.forEach((applicant, index) => {
    //   applicant.expireTime--;
    //   if (applicant.expireTime <= 0) {
    //     expiredApplicantIndexes.push(index);
    //   }
    // });

    // expiredApplicantIndexes.forEach((applicantIndex, index) => {
    //   this.applicants[applicantIndex].expire();
    //   this.applicants.splice(applicantIndex - index, 1);
    // });

    // if (this.nextApplicant >= this.applicants.length) {
    //   this.nextApplicant = 0;
    // }

    if (this.applicants.length === 0) {
      getEl("viewNextApplicantBtn").disabled = true;
    }
  }

  draw() {
    getEl("applicantCount").innerText = this.applicants.length;
    if (actionPanel.currentPanelType == "applicant") {
      const frac = this.applicants[0].expireTimer / applicationExpireTime;
      getEl("appProgress").style.width = frac * 100 + "%";
    }
  }
}

export const applicantSpawner = new ApplicantSpawner();
