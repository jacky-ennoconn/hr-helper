export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const parseCSVOrText = (text: string): string[] => {
  // Split by newlines, commas, or semicolons
  const separators = /[\n,;]+/;
  return text
    .split(separators)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
};

export const generateMockData = (): string[] => {
  return [
    "James Smith", "Maria Garcia", "Robert Johnson", "Lisa Wilson",
    "Michael Brown", "Jennifer Jones", "William Davis", "Elizabeth Miller",
    "David Martinez", "Linda Anderson", "Richard Taylor", "Patricia Thomas",
    "Joseph Hernandez", "Susan Moore", "Charles Martin", "Jessica Jackson",
    "Thomas White", "Sarah Lopez", "Christopher Lee", "Karen Gonzalez",
    "Daniel Harris", "Nancy Clark", "Matthew Lewis", "Margaret Robinson",
    "Anthony Walker", "Betty Perez", "Donald Hall", "Sandra Young",
    "Mark Allen", "Ashley Sanchez", "Paul Wright", "Kimberly King",
    "Steven Scott", "Emily Green", "Andrew Baker", "Donna Adams",
    "Kenneth Nelson", "Michelle Hill", "Joshua Carter", "Carol Mitchell"
  ];
};

export const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};