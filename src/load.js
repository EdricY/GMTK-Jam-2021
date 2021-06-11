const imgSources = {
  // list image files files here
  grass: "./assets/grass.png",
};

const audioSources = {
  // list audio files here
};
export const imgs = {};
export const sounds = {};
export let loaded = 0;
export const amtToLoad = Object.keys(imgSources).length + Object.keys(audioSources).length;

window.imgs = imgs;

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
window.sounds = sounds;

export const doneLoadingResrcs = () => {
  return loaded == amtToLoad;
};

const onResrcLoad = () => {
  loaded++;
  // console.log("loaded", loaded);
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
