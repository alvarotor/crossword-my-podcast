import { CrosswordLayoutGenerator, CrosswordWord, CrosswordLayout } from 'crossword-layout-generator';
import { config } from '../config';

interface Crossword {
    table: string[][];
    result: {
        answer: string;
        clue: string;
        startx: number;
        starty: number;
        orientation: string;
    }[];
    rows: number;
    cols: number;
}

export function generateCrosswordLayout(wordsWithClues: CrosswordWord[]): CrosswordLayout {
    let layout: CrosswordLayout | null = null;
    let attempts = 0;

    while (!layout && attempts < 5) { // Retry up to 5 times
        try {
            const generator = new CrosswordLayoutGenerator(wordsWithClues);
            layout = generator.getLayout({
                maxAttempts: 1000,
                preferHorizontal: 0.7,
                maxGridSize: config.crossword.gridSize.max,
                minWords: Math.min(wordsWithClues.length, config.crossword.maxWords)
            });

            // Validate grid size
            if (layout.rows < config.crossword.gridSize.min || layout.cols < config.crossword.gridSize.min) {
                throw new Error('Generated grid is too small.');
            }

            // Validate all words are placed
            const placedWords = new Set(layout.result.map(word => word.answer.toLowerCase()));
            const missingWords = wordsWithClues.filter(word => !placedWords.has(word.answer.toLowerCase()));
            if (missingWords.length > 0) {
                throw new Error(`Some words could not be placed: ${missingWords.map(w => w.answer).join(', ')}`);
            }
        } catch (error) {
            console.warn(`Layout generation failed on attempt ${attempts + 1}:`, error);
            wordsWithClues.pop(); // Remove the last word and retry
            layout = null; // Reset layout for the next attempt
        }
        attempts++;
    }

    if (!layout) {
        throw new Error('Failed to generate crossword layout after multiple attempts.');
    }

    return layout;
}
