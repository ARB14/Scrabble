const { getTileScores, getTripleLetterScores } = require("./tiles");
const { dedupe, getAllMaxIndexes, getAllObjectsWithMaxTL } = require("./utils");

const getWordScores = async (validWords) => {
  const wordScores = [];
  const tileScores = await getTileScores();
  for await (const word of validWords) {
    const chars = word.split("");
    let wordScore = 0;
    for await (const char of chars) {
      const alphaValue = char.toLowerCase().charCodeAt(0) - 97 + 1;
      wordScore = wordScore + tileScores[alphaValue - 1];
    }
    wordScores.push(wordScore);
    wordScore = 0;
  }
  return wordScores;
};

const getHighestScoringWordDefault = async (validWords, wordScores) => {
  const maxIndexes = getAllMaxIndexes(wordScores);
  const highestScoringWords = [];
  for await (const maxIndex of maxIndexes) {
    highestScoringWords.push(validWords[maxIndex]);
  }
  return await dedupe(highestScoringWords);
};

const getHighestScoringWordWithTripleLetter = async (
  validWords,
  wordScores
) => {
  const tileScores = await getTileScores();
  const tripleLetterScores = await getTripleLetterScores();
  const expandedWords = [];
  for await (const word of validWords) {
    const chars = word.split("");
    const dupedWords = [];
    for await (const char of chars) {
      dupedWords.push(word);
    }
    expandedWords.push(dupedWords);
  }

  const tripleLetterWordScores = [];
  let uniqueWordCounter = 0;
  for await (const expandedWordsRow of expandedWords) {
    let dupedWordCounter = 0;
    for await (const word of expandedWordsRow) {
      tripleLetterWordScores.push({
        wordIndex: uniqueWordCounter,
        word: word,
        char: word.split("")[dupedWordCounter],
        defaultLetterScore:
          tileScores[
            word.split("")[dupedWordCounter].toLowerCase().charCodeAt(0) -
              97 +
              1 -
              1
          ],
        tripleLetterScore:
          tripleLetterScores[
            word.split("")[dupedWordCounter].toLowerCase().charCodeAt(0) -
              97 +
              1 -
              1
          ],
      });
      dupedWordCounter++;
    }
    uniqueWordCounter++;
  }

  for await (const tripleLetterWordScore of tripleLetterWordScores) {
    tripleLetterWordScore.defaultWordScore =
      wordScores[tripleLetterWordScore.wordIndex];
    tripleLetterWordScore.tripleLetterWordScore =
      wordScores[tripleLetterWordScore.wordIndex] -
      tripleLetterWordScore.defaultLetterScore +
      tripleLetterWordScore.tripleLetterScore;
  }
  const highestTripleScores = await getAllObjectsWithMaxTL(
    tripleLetterWordScores,
    validWords
  );
  return await dedupe(highestTripleScores);
};

module.exports.getHighestScoringWord = async (
  validWords,
  isDefaultLetterScores
) => {
  const wordScores = await getWordScores(validWords);

  if (!isDefaultLetterScores) {
    return getHighestScoringWordWithTripleLetter(validWords, wordScores);
  }

  return getHighestScoringWordDefault(validWords, wordScores);
};
