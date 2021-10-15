const { getTiles } = require("./src/tiles");
const { getRack } = require("./src/rack");
const {
  getPremutations,
  getAnagrams,
  getPossibleWords,
  getValidWords,
  getLongestWord,
} = require("./src/utils");

(async () => {
  const rack = await getRack(await getTiles());
  const premutations = await getPremutations(rack, 2);
  const anagrams = await getAnagrams(premutations);
  const validWords = await getValidWords(anagrams, await getPossibleWords());
  const longestWord = await getLongestWord(validWords);
  console.log(`Rack: ${rack}`);
  console.log(`Valid Words: ${validWords}`);
  console.log(`Longest Word: ${longestWord}`);
})();
