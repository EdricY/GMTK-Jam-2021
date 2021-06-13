export const getEl = (x) => document.getElementById(x);
export const SIZE = 1000;
export const N = 10;
export const HALFSIZE = SIZE / 2;
export const canvas = getEl("canvas");
canvas.width = SIZE;
canvas.height = SIZE;
export const ctx = canvas.getContext("2d");
export const TAU = Math.PI * 2;
export const HALFRT2 = Math.SQRT1_2;
export const TSIZE = SIZE / N; //TLONGDIAG / Math.SQRT2;
export const TLONGDIAG = TSIZE * Math.SQRT2;
// export const TSIDE = (TSIZE * Math.sqrt(5)) / 4;

export const CYCLE_MILISECONDS = 5 * 1000;
export const MONTH_CYCLES = 10;

export const MONTH_SECONDS = MONTH_CYCLES * CYCLE_MILISECONDS;
export const MONTHS = [
  "Amphitrite",
  "Brizo",
  "Cymopoleia",
  "Doris",
  "Electra",
  "Glaucus",
  "Hippocampi",
  "Ichthyocentaurs",
  "Kympoleia",
  "Leucothea",
  "Nerites",
  "Poseiden",
];

export const MAINTENANCE_LEVELS = ["Low", "Medium", "High"];
export const LOCATIONS = ["North", "South", "East", "West"];

export const lerp = (a, b, frac) => a * (1 - frac) + b * frac;
export const TILE_R = 0;
export const TILE_G = 1;
export const TILE_H = 2;
export const TILE_S = 3;
export const TILE_T = 4;
export const TILE_W = 5;

export const inBounds = (i, j) => {
  if (i < 0) return false;
  if (i >= N) return false;
  if (j == null) return true;

  if (j < 0) return false;
  if (j >= N) return false;
  return true;
};

export const houseNames = [
  "Anemone Place",
  "Fishers Palace",
  "Riverswood Mansion",
  "Stonewill Residence",
  "Wild Willow Estate",
  "Troutriver Mansion",
  "Beechbury Residence",
  "Foreherd Chateau",
  "Suldal Estate",
  "Remlins Residence",
  "Pardel Manor",
  "Nordon Chateau",
  "Grapevine Manor",
  "Graceville Manor",
  "Edgeriver Manor",
  "Froglake Estate",
  "Summergrove Chateau",
  "Livingtero Manor",
  "Fullercard Chateau",
  "Consworth Chateau",
  "Sinrett Chateau",
  "Buckfort Chateau",
  "Ivywood Mansion",
  "Newpoint Mansion",
  "Eastmeadow Chateau",
  "Gracewoods Estate",
  "Seapoint Residence",
  "Mauner Manor",
  "Mulsay Residence",
  "Pakennelly Mansion",
  "Colerene Chateau",
  "Rothsnor Residence",
  "Castle Hill Residence",
  "Starlight Residence",
  "Evergreen Valley Estate",
  "Crow Valley Chateau",
  "Blossomfall Mansion",
  "Blanson Manor",
  "Goldrow Manor",
  "Rainnell Estate",
  "Warridge Manor",
  "Coulton Manor",
];

export const names = [
  "Oscar Smith",
  "Don Lino",
  "Angie Zellweger",
  "Lenny Black",
  "Lola Jolie",
  "Sykes Scorsese",
  "Ernie Marley",
  "Bernie Doug",
  "Frankie Imperioli",
  "Luca Pastore",
  "Cleo Jones",
  "Don Limpet",
  "Guppi Goldberg",
  "Ann Chovy",
  "Cece Lioness",
  "Marlin Brooks",
  "Nemo Gould",
  "Gill Dafoe",
  "Peach Janney",
  "Gurgle Pendleton",
  "Patrick Fager",

  "Araceli Maldonado",
  "Lexi Fowler",
  "Tony Mccullough",
  "Emiliano Stuart",
  "Aliya Ferrell",
  "Seamus Juarez",
  "Ty Luna",
  "Francisco Pham",
  "Casey Kennedy",
  "Haylee Oneill",
  "Kristopher Sweeney",
  "Kelsie Barrera",
  "Kendall Rhodes",
  "Yareli Braun",
  "Monserrat Greer",
  "Tyree Wyatt",
  "Allen Cruz",
  "Julianne Lowe",
  "Gabriela George",
  "Lukas Boyer",
  "Liam Lam",
  "Gustavo Walter",
  "Zion Dean",
  "Akira Whitaker",
];

shuffleArray(names);
shuffleArray(houseNames);

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
