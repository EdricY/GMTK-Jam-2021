import { selectedTile } from "./cursor";
import { getEl, inBounds } from "./globals";
import { mapData } from "./map";
import { shellNumber } from "./shell";

export const setupButtons = () => {
  getEl("buyBtn").onclick = () => {
    if (!inBounds(selectedTile.i, selectedTile.j)) return;
    const selectedHouse = mapData[selectedTile.i][selectedTile.j];
    if (!selectedHouse.basePrice) return;
    shellNumber.change(-selectedHouse.basePrice);
  };
};
