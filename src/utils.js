const fs = require("fs").promises;

const getAllIndexes = (wordScores, value) => {
  var indexes = [],
    i = -1;
  while ((i = wordScores.indexOf(value, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
};

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
  const validWords = await anagrams.filter((r) => possibleWordsUC.includes(r));
  return await this.dedupe(validWords);
};

module.exports.getLongestWord = async (validWords) => {
  const longestWord = [];
  validWords.forEach((word) => {
    if (!longestWord.length) {
      longestWord.push(word);
    }

    if (word.split("").length > longestWord[0].split("").length) {
      longestWord.length = 0;
      longestWord.push(word);
    }

    if (word.split("").length === longestWord[0].split("").length) {
      longestWord.push(word);
    }
  });
  return await this.dedupe(longestWord);
};

module.exports.dedupe = async (array) => {
  return [...new Set(array)];
};

module.exports.getAllMaxIndexes = (wordScores) => {
  return getAllIndexes(wordScores, Math.max.apply(null, wordScores));
};

module.exports.getAllObjectsWithMaxTL = async (
  tripleLetterWordScores,
  validWords
) => {
  const highestTripleScores = tripleLetterWordScores
    .reduce(
      (a, b) => {
        let current = a.pop();
        if (current.tripleLetterWordScore < b.tripleLetterWordScore) return [b];
        if (current.tripleLetterWordScore === b.tripleLetterWordScore)
          return [...a, current, b];
        return [...a, current];
      },
      [tripleLetterWordScores[0]]
    )
    .map((e) => {
      if (!e?.wordIndex) {
        return;
      }
      return e.wordIndex;
    });

  const highestTLWords = [];

  for await (const highestTripleScore of highestTripleScores) {
    highestTLWords.push(validWords[highestTripleScore]);
  }

  return highestTLWords;
};
