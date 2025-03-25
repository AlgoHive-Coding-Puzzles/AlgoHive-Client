export const prettyPrintTitle = (title: string) => {
  // Remove any _ or - characters and split the string into words
  const words = title.replace(/[_-]/g, " ").split(" ");
  // Capitalize the first letter of each word
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalizedWords.join(" ");
};

export const getPuzzleDifficulty = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "easy";
    case "MEDIUM":
      return "medium";
    case "HARD":
      return "hard";
  }
};

export const getPuzzleDifficultySeverity = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "success";
    case "MEDIUM":
      return "primary";
    case "HARD":
      return "danger";
  }
};

/**
 *
 * Puzzle 0 - Part 1 -> Need 1 try
 * Puzzle 0 - Part 2 -> Need 2 tries
 * Puzzle 1 - Part 1 -> Need 3 tries
 * Puzzle 1 - Part 2 -> Need 4 tries
 * Puzzle 2 - Part 1 -> Need 5 tries
 * Puzzle 2 - Part 2 -> Need 6 tries
 * Puzzle 3 - Part 1 -> Need 7 tries
 * Puzzle 3 - Part 2 -> Need 8 tries
 */
export const isPartDone = (
  index: number,
  step: number,
  tryLength: number
): boolean => {
  // Calculer le nombre d'essais nécessaires pour cette partie
  const requiredTries = index * 2 + step;

  return tryLength >= requiredTries;
};

export const isPuzzleUnlocked = (index: number, tryLength: number): boolean => {
  // Return false if the previous puzzle is not done, true otherwise
  if (index >= 0) {
    return isPartDone(index - 1, 2, tryLength);
  }
  // If it's the first puzzle, it's always unlocked
  return true;
};
