const { getTiles } = require("./src/tiles");
const { getRack } = require("./src/rack");
const { pickRackType, enterRack } = require("./src/player");
const {
  getPremutations,
  getAnagrams,
  getPossibleWords,
  getValidWords,
  getLongestWord,
} = require("./src/utils");
const { getHighestScoringWord } = require("./src/scoring");

(async () => {
  const rackType = await pickRackType();
  console.log(rackType)
  const rack =
    rackType.toUpperCase() === "A"
      ? await getRack(await getTiles())
      : await enterRack();
  const premutations = await getPremutations(rack, 2);
  const anagrams = await getAnagrams(premutations);
  const validWords = await getValidWords(anagrams, await getPossibleWords());
  const longestWord = await getLongestWord(validWords);
  const highestScoringWord = await getHighestScoringWord(validWords, true);
  const highestScoringWordWithTripleLetter = await getHighestScoringWord(
    validWords,
    false
  );
  console.log(`Rack: ${rack}`);
  console.log(`Valid Words: ${validWords}`);
  console.log(`Longest Word: ${longestWord}`);
  console.log(`Highest Scoring Word: ${highestScoringWord}`);
  console.log(
    `Highest Scoring Word W/ TL: ${highestScoringWordWithTripleLetter}`
  );
})();
