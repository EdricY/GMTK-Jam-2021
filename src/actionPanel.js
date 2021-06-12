import { getEl } from "./globals";

export class ActionPanel {
    constructor() {
        this.currentObj = null;
        this.currentCompareObj = null;
    }

    setInfo(img, name, content, obj) {
        this.currentObj = obj;

        let infoContent = getEl("infoContent");
        let infoImg = getEl("infoImage");
        let infoName = getEl("infoName");

        infoContent.innerHTML = content;
        infoImg.src = img;
        infoName.innerText = name;
    }

    setCompareInfo(img, name, content, compareObj) {
        let infoRow = getEl("infoRow")
        let infoCompareContent = getEl("infoCompareContent");
        let infoCompareImage = getEl("infoCompareImage");
        let infoCompareName = getEl("infoCompareName");
        let infoCompareLine1 = getEl("infoCompareLine1");
        let infoCompareLine2 = getEl("infoCompareLine2");

        if (img && name && content) {
            this.currentCompareObj = compareObj;

            infoCompareContent.classList.remove("nodisplay");
            infoCompareImage.classList.remove("nodisplay");
            infoCompareName.classList.remove("nodisplay");
            infoCompareLine1.classList.remove("nodisplay");
            infoCompareLine2.classList.remove("nodisplay");
            infoRow.classList.add("space-between");

            infoCompareContent.innerHTML = content;
            infoCompareImage.src = img;
            infoCompareName.innerText = name;
        } else {
            this.currentCompareObj = null;

            infoCompareContent.classList.add("nodisplay");
            infoCompareImage.classList.add("nodisplay");
            infoCompareName.classList.add("nodisplay");
            infoCompareLine1.classList.add("nodisplay");
            infoCompareLine2.classList.add("nodisplay");
            infoRow.classList.remove("space-between");
        }
    }
}

export const actionPanel = new ActionPanel();