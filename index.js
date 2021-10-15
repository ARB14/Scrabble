const fs = require("fs").promises;

(async () => {
  const swap = (chars, i, j) => {
    var tmp = chars[i];
    chars[i] = chars[j];
    chars[j] = tmp;
  };

  const getAnagrams = (input) => {
    var counter = [],
      anagrams = [],
      chars = input.split(""),
      length = chars.length,
      i;

    for (i = 0; i < length; i++) {
      counter[i] = 0;
    }

    anagrams.push(input);
    i = 0;
    while (i < length) {
      if (counter[i] < i) {
        swap(chars, i % 2 === 1 ? counter[i] : 0, i);
        counter[i]++;
        i = 0;
        anagrams.push(chars.join(""));
      } else {
        counter[i] = 0;
        i++;
      }
    }

    return anagrams;
  };

  const getPossibleWords = async () => {
    const twl06 = await fs.readFile("./twl06.txt", "utf8");
    return twl06.replace(/(\r|\r)/gm, "").split("\n");
  };

  const getValidWords = async (anagrams, possibleWords) => {
    const possibleWordsUC = possibleWords.map((possibleWord) =>
      possibleWord.toUpperCase()
    );
    return await anagrams.filter((r) => possibleWordsUC.includes(r));
  };

  const getLongestWord = async (validWords) => {
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
    return longestWord
  };

  const getTiles = async () => {
    const letterSet = [
      Array(9).fill("A"),
      Array(2).fill("B"),
      Array(2).fill("C"),
      Array(4).fill("D"),
      Array(12).fill("E"),
      Array(2).fill("F"),
      Array(3).fill("G"),
      Array(2).fill("H"),
      Array(9).fill("I"),
      Array(1).fill("J"),
      Array(1).fill("K"),
      Array(4).fill("L"),
      Array(2).fill("M"),
      Array(6).fill("N"),
      Array(8).fill("O"),
      Array(2).fill("P"),
      Array(1).fill("Q"),
      Array(6).fill("R"),
      Array(4).fill("S"),
      Array(6).fill("T"),
      Array(4).fill("U"),
      Array(2).fill("V"),
      Array(2).fill("W"),
      Array(1).fill("X"),
      Array(2).fill("Y"),
      Array(1).fill("Z"),
      Array(2).fill(" "),
    ];
    return letterSet.flat();
  };

  const getRack = async (tiles) => {
    const rack = [];
    const tilePicks = Array(7).fill(0);
    for await (const tilePick of tilePicks) {
      rack.push(tiles[Math.floor(Math.random() * tiles.length)]);
    }
    return rack;
  };

  const rack = await getRack(await getTiles());
  const validWords = await getValidWords(
    getAnagrams(rack.join("")),
    await getPossibleWords()
  );
  const longestWord = await getLongestWord(validWords);

  console.log(rack);
  console.log(validWords);
  console.log(longestWord);
})();
