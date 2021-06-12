import { getEl } from "./globals";

const applicationExpireTime = 500;

export class Applicant {
  constructor(name) {
    this.name = name;
    this.img = "./assets/house.png"
    this.content = "<ul><li>A thing</li><li>Another thing</li></ul>"
    this.expireTime = applicationExpireTime * Math.random();
    this.addToApplicants();
  }

  addToApplicants() {
    let applicantCount = getEl("applicantCount");
    applicantCount.innerText = Number(applicantCount.innerText) + 1;
  }

  expire() {
    let applicantCount = getEl("applicantCount");
    applicantCount.innerText = Number(applicantCount.innerText) - 1;
  }
}
