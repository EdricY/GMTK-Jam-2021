import { inBounds } from "./globals";
import { levelManager } from "./levelManager";
import { HouseNumbers, map } from "./map";

export const roadCost = {
  cost: 200,
  increment: 20,
};

export let ufMap = [];

export function buildUFRoad(i, j) {
  for (const [offsetI, offsetJ] of [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]) {
    const ii = i + offsetI;
    const jj = j + offsetJ;
    if (!inBounds(ii, jj)) continue;
    const tile = map.mapData[ii][jj];
    if (!tile) continue;
    if (tile.road || tile.isHouse) {
      union(ufMap[i][j], ufMap[ii][jj]);
    }
  }
}

export function setupUF() {
  ufMap = [];
  for (let i = 0; i < levelManager.mapNumbers.length; i++) {
    ufMap.push([]);
    for (let j = 0; j < levelManager.mapNumbers[0].length; j++) {
      ufMap[i][j] = makeSet(i, j);
    }
  }
}

// union-find
export const makeSet = (i, j) => {
  const singleton = {
    size: 1,
    i: i,
    j: j,
  };
  singleton.parent = singleton;
  singleton.houses = HouseNumbers.includes(levelManager.mapNumbers[i][j]) ? 1 : 0;

  return singleton;
};

export const find = (node) => {
  if (node.parent !== node) {
    node.parent = find(node.parent);
  }

  return node.parent;
};

export const union = (node1, node2) => {
  const root1 = find(node1);
  const root2 = find(node2);
  if (root1 === root2) return;

  const houses = root1.houses + root2.houses;

  if (root1.size < root2.size) {
    //root 2 bigger
    root1.parent = root2;
    root2.size = root1.size + root2.size;
    root2.houses = houses;
  } else {
    //root 1 bigger (or same)
    root2.parent = root1;
    root1.size = root1.size + root2.size;
    root1.houses = houses;
  }
};
