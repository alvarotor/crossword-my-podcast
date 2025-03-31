import { CrosswordLayoutGenerator, CrosswordWord } from 'crossword-layout-generator';
import { config } from '../config';

interface CrosswordLayout {
    table: string[][];
    result: {
        answer: string;
        clue: string;
        startx: number;
        starty: number;
        orientation: string;
        position: number; // Added for clue numbering
    }[];
    rows: number;
    cols: number;
}

export function generateCrosswordLayout(wordsWithClues: CrosswordWord[]): CrosswordLayout {
    let layout: CrosswordLayout | null = null;
    let attempts = 0;

    // Normalize words: convert to uppercase, remove spaces
    const normalizedWords = wordsWithClues.map(word => ({
        answer: word.answer.toUpperCase().replace(/\s+/g, ''),
        clue: word.clue
    }));

    while (!layout && attempts < 5) {
        try {
            const generator = new CrosswordLayoutGenerator(normalizedWords);
            const generatedLayout = generator.getLayout({
                maxAttempts: 1000,
                preferHorizontal: 0.7,
                maxGridSize: config.crossword.gridSize.max,
                minWords: Math.min(normalizedWords.length, config.crossword.maxWords)
            });

            if (!generatedLayout || !generatedLayout.result) {
                throw new Error('Layout generation failed');
            }

            // Add position numbers to words for clue references
            const result = generatedLayout.result.map((word, index) => ({
                ...word,
                position: index + 1
            }));

            layout = {
                table: generatedLayout.table,
                result,
                rows: generatedLayout.rows,
                cols: generatedLayout.cols
            };

            // Validate grid size
            if (layout.rows < config.crossword.gridSize.min || 
                layout.cols < config.crossword.gridSize.min) {
                throw new Error('Generated grid is too small.');
            }

            // Validate word placement and intersections
            const placedWords = new Set(layout.result.map(word => word.answer));
            const intersectionCount = countIntersections(layout);
            
            if (intersectionCount < Math.floor(layout.result.length / 2)) {
                throw new Error('Not enough word intersections');
            }

            const missingWords = normalizedWords.filter(
                word => !placedWords.has(word.answer)
            );
            
            if (missingWords.length > 0) {
                console.warn(
                    `Some words could not be placed: ${missingWords.map(w => w.answer).join(', ')}`
                );
                // Update words list to only include placed words
                normalizedWords.length = 0;
                normalizedWords.push(...wordsWithClues.filter(
                    word => placedWords.has(word.answer.toUpperCase().replace(/\s+/g, ''))
                ));
            }

        } catch (error) {
            console.warn(`Layout generation attempt ${attempts + 1} failed:`, error);
            if (normalizedWords.length > 3) { // Keep at least 3 words
                normalizedWords.pop();
            }
            layout = null;
        }
        attempts++;
    }

    if (!layout) {
        throw new Error('Failed to generate crossword layout after multiple attempts');
    }

    return layout;
}

function countIntersections(layout: CrosswordLayout): number {
    let intersections = 0;
    const grid = Array(layout.rows).fill(null)
        .map(() => Array(layout.cols).fill(0));

    // Mark all cells used by words
    layout.result.forEach(word => {
        const dx = word.orientation === 'across' ? 1 : 0;
        const dy = word.orientation === 'down' ? 1 : 0;
        
        for (let i = 0; i < word.answer.length; i++) {
            const x = word.startx + (dx * i);
            const y = word.starty + (dy * i);
            grid[y][x]++;
            if (grid[y][x] > 1) {
                intersections++;
            }
        }
    });

    return intersections;
}
