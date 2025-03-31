import { ClueGenerator } from '../services/clueGenerator';

const clueGenerator = new ClueGenerator();

export async function generateClues(keywords: string[], transcript: string) {
    const wordsWithClues = await Promise.all(
        keywords.map(async (word) => ({
            answer: word,
            clue: await clueGenerator.generateClue(word, transcript)
        }))
    );

    return wordsWithClues;
}
