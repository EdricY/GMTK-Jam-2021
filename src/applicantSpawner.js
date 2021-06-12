import { getEl, names } from "./globals";
import { Applicant } from "./applicant";

const applicantTime = 100;

export class ApplicantSpawner {
  constructor() {
    this.currentApplicant = 0;
    this.applicants = [];
    this.resetTimer();
    getEl("viewNextApplicantBtn").addEventListener("click", () => {
      this.viewNextApplicant();
    });
  }

  viewNextApplicant() {
    if (this.applicants.length === 0) {
      return;
    }

    this.applicants[this.currentApplicant].setApplicantInfo();
    this.currentApplicant++;
    if (this.currentApplicant >= this.applicants.length) {
      this.currentApplicant = 0;
    }
  }

  spawnApplicant() {
    this.resetTimer();
    let name = names[Math.floor(Math.random() * names.length)];
    if (Math.random() < 0.3) {
      let firstLast = name.split(" ");
      name = firstLast[0] + " & " + names[Math.floor(Math.random() * names.length)];
    }
    this.applicants.push(new Applicant(name));
  }

  resetTimer() {
    this.timer = applicantTime + Math.floor(Math.random() * applicantTime);
  }

  update() {
    this.timer--;
    if (this.timer <= 0) {
      this.spawnApplicant();
    }

    let expiredApplicantIndexes = [];
    this.applicants.forEach((applicant, index) => {
      applicant.expireTime--;
      if (applicant.expireTime <= 0) {
        expiredApplicantIndexes.push(index);
      }
    });

    expiredApplicantIndexes.forEach((applicantIndex, index) => {
      this.applicants[applicantIndex].expire();
      this.applicants.splice(applicantIndex - index, 1);
    });
  }
}

export const applicantSpawner = new ApplicantSpawner();
