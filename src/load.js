export const imgSources = {
  // list image files files here
  grass: "./assets/grass.png",
  road: "./assets/road.png",
  road2: "./assets/road2.png",
  road3: "./assets/road3.png",
  house: "./assets/house.png",
  shell: "./assets/shell.png",
  shell2: "./assets/shell2.png",
  shell3: "./assets/shell3.png",
  shell4: "./assets/shell4.png",
  sand: "./assets/sand.png",
  sand2: "./assets/sand2.png",
  sand3: "./assets/sand3.png",
  anemone11: "./assets/anemone1-1.png",
  anemone12: "./assets/anemone1-2.png",
  anemone13: "./assets/anemone1-3.png",
  anemone21: "./assets/anemone2-1.png",
  anemone22: "./assets/anemone2-2.png",
  anemone23: "./assets/anemone2-3.png",
  anemone41: "./assets/anemone4-1.png",
  anemone42: "./assets/anemone4-2.png",
  anemone43: "./assets/anemone4-3.png",
  question: "./assets/question.png",
  exclamation: "./assets/exclamation.png",
  fish1: "./assets/fish2.png",
  fish2: "./assets/fish3.png",
  fish3: "./assets/fish4.png",
  fish4: "./assets/fish5.png",
  fish5: "./assets/fish6.png",
  fish6: "./assets/fish7.png",
  couple1: "./assets/Couple1.png",
  couple2: "./assets/Couple2.png",
  couple3: "./assets/Couple3.png",
  couple4: "./assets/Couple4.png",
  couple5: "./assets/Couple5.png",
  couple6: "./assets/Couple6.png",
  couple7: "./assets/Couple7.png",
  couple8: "./assets/Couple8.png",
  couple9: "./assets/Couple9.png",
};

const audioSources = {
  // list audio files here
  coins: "./assets/coins2.wav",
  moneybag: "./assets/moneybag.wav",
  craft: "./assets/craft.mp3",
  bloop: "./assets/bloop.wav",
  bloop2: "./assets/bloop2.mp3",
  speech: "./assets/speech.mp3",
  bubble: "./assets/bubble.wav",
  uhoh: "./assets/uhoh.wav",
  peacefulSea1: "./assets/peaceful_sea1.mp3",
  peacefulSea2: "./assets/peaceful_sea2.mp3",
  peacefulSea3: "./assets/peaceful_sea3.mp3",
  background1: "./assets/background1.mp3",
};

export const imgs = {};
export const sounds = {};
export let loaded = 0;
export const amtToLoad = Object.keys(imgSources).length + Object.keys(audioSources).length;

export function preloadAssets() {
  for (let key in imgSources) {
    imgs[key] = new Image();
    imgs[key].src = imgSources[key];
    imgs[key].onload = onResrcLoad;
  }

  for (let key in audioSources) {
    sounds[key] = new Audio(audioSources[key]);
    sounds[key].onloadeddata = onResrcLoad;
  }
}

export const doneLoadingResrcs = () => {
  return loaded == amtToLoad;
};

const onResrcLoad = (e) => {
  loaded++;
  // console.log("loaded", e);
};

export const setupAssetLoader = (updateLoadState, finishedCallback) => {
  window.addEventListener("load", () => {
    preloadAssets();

    let loadInterval = setInterval(() => {
      updateLoadState(loaded / amtToLoad);

      if (doneLoadingResrcs()) {
        clearInterval(loadInterval);
        finishedCallback();
      }
    }, 500);
  });
};
