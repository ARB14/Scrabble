module.exports.getRack = async (tiles) => {
  const rack = [];
  const tilePicks = Array(7).fill(0);
  for await (const tilePick of tilePicks) {
    rack.push(tiles[Math.floor(Math.random() * tiles.length)]);
  }
  return rack;
};
