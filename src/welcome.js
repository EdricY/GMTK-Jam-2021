import { actionPanel } from "./actionPanel";
import { getEl } from "./globals";
import { sounds } from "./load";

const messages = [
  "Looks like you're in pretty deep, huh?",
  "Lucky for you, my rental manager position just opened up.\
  But I think you'll be here a while before you can pay off what you owe.",
  "We're always getting plenty of applicants, so just scoop up some property, approve some folks, and start collecting rent.",
  "I'll come by at the end of the month to collect what you owe. I hear that shell debt you've racked up is raking in quite a bit of interest, haha!",
  "You better be able to cover your monthly payments. You wouldn't wanna end up like the last guy...",
  "Of course if you were ever able to buy and rent out the Grand Anenome, I'd be willing to let this all go.",
  "Well, as if that were even possible for someone like you. Haha, good luck out there. I'll see you soon!",
  "One more thing. Apparently the fish around here like living in places that are joined together. I don't get it. But areas connected by roads seem to do a lot better.",
];
class WelcomeState {
  step = 0;
  getMessage() {
    return messages[this.step];
  }
  nextStep() {
    this.step++;
    if (this.step < messages.length) {
      sounds.speech.currentTime = 0;
      sounds.speech.play();
      getEl("welcomeMsg").innerText = this.getMessage();
    } else {
      actionPanel.closeAll();
    }
  }
}

export const welcomeState = new WelcomeState();
