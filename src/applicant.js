import { applicationExpireTime } from "./applicantSpawner";
import { getEl, MAINTENANCE_LEVELS, LOCATIONS } from "./globals";

export class Applicant {
  constructor(name, img) {
    this.name = name;
    this.imgname = img;
    this.content = "<ul><li>A thing</li><li>Another thing</li></ul>";
    this.expireTimer = applicationExpireTime;

    this.maintenance = Math.floor(Math.random() * MAINTENANCE_LEVELS.length);
    this.location = Math.floor(Math.random() * LOCATIONS.length);
    this.color = Math.random() < 0.2 ? "Gray" : "Pink";

    // this.maintenance = 0;
    // this.location = 3;
    // this.color = "Pink";
  }

  update() {
    this.expireTimer--;
  }
}
