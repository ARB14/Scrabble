const fs = require("fs").promises;

module.exports.getPremutations = async (rack, minWordLength) => {
  const premute = (n, srcRack, rackLetters, allPremutations) => {
    if (n == 0) {
      if (rackLetters.length > 0) {
        allPremutations[allPremutations.length] = rackLetters;
      }
      return;
    }
    for (var j = 0; j < srcRack.length; j++) {
      premute(
        n - 1,
        srcRack.slice(j + 1),
        rackLetters.concat([srcRack[j]]),
        allPremutations
      );
    }
    return;
  };

  const allPremutations = [];
  for (let i = minWordLength; i < rack.length; i++) {
    premute(i, rack, [], allPremutations);
  }
  allPremutations.push(rack);
  return allPremutations;
};

module.exports.getAnagrams = async (premutations) => {
  const anagrams = [];
  for await (const premutation of premutations) {
    anagrams.push(premutation.join(""));
  }
  return anagrams;
};

module.exports.getPossibleWords = async () => {
  const twl06 = await fs.readFile("./twl06.txt", "utf8");
  return twl06.replace(/(\r|\r)/gm, "").split("\n");
};

module.exports.getValidWords = async (anagrams, possibleWords) => {
  const possibleWordsUC = possibleWords.map((possibleWord) =>
    possibleWord.toUpperCase()
  );
  return await anagrams.filter((r) => possibleWordsUC.includes(r));
};

module.exports.getLongestWord = async (validWords) => {
  let longestWord = "";
  validWords.forEach((word) => {
    if (longestWord === "") {
      longestWord = word;
    } else {
      if (word.split("").length > longestWord.split().length) {
        longestWord = word;
      }
    }
  });
  return longestWord;
};
