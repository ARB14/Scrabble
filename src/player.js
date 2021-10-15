const { Console } = require("console");
const reader = require("readline-sync");
/**
 * Starts the turns in the CLI
 * @param {Array} grid
 */
module.exports.enterRack = async () => {
  const tiles = reader.question(
    `Please enter the 7 tiles in your rack (A-Z): `
  );
  if (tiles.split("").length < 7 || tiles.split("").length > 7) {
    console.log("Incorrect number of tiles, please enter 7 (A-Z).");
    return await this.enterRack();
  }
  return tiles.split("");
};

module.exports.pickRackType = async () => {
  const rackType = reader.question(
    `[Rack Type] Please select (M)anual or (A)utomated:`
  );
  if (rackType.toUpperCase() != "M" && rackType.toUpperCase() != "A") {
    console.log(
      "Incorrect option selected, please select either (M)anual or (A)utomated."
    );
    return await this.pickRackType();
  }
  return rackType;
};
