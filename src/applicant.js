import { getEl } from "./globals";

const applicationExpireTime = 500;

export class Applicant {
  constructor(name) {
    this.name = name;
    this.expireTime = applicationExpireTime * Math.random();
    this.addToApplicants();
  }

  addToApplicants() {
    let applicantCount = getEl("applicantCount");
    applicantCount.innerText = Number(applicantCount.innerText) + 1;
  }

  setApplicantInfo() {
    let infoContent = getEl("infoContent");
    let infoImg = getEl("infoImage");
    let infoName = getEl("infoName");

    infoContent.innerText = "More Details";
    infoImg.src = "";
    infoName.innerText = this.name;
  }

  expire() {
    let applicantCount = getEl("applicantCount");
    applicantCount.innerText = Number(applicantCount.innerText) - 1;
  }
}
