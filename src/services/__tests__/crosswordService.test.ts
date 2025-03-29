import { generateCrosswordLayout } from '../crosswordService';

describe('generateCrosswordLayout', () => {
    it('should generate a valid crossword layout', () => {
        const wordsWithClues = [
            { answer: 'podcast', clue: 'A digital audio file', position: 1 },
            { answer: 'crossword', clue: 'A word puzzle', position: 2 }
        ];
        const layout = generateCrosswordLayout(wordsWithClues);
        expect(layout).toBeDefined();
        expect(layout.result).toHaveLength(wordsWithClues.length);
    });

    it('should handle multi-word answers', () => {
        const wordsWithClues = [
            { answer: 'social media', clue: 'Online platforms', position: 1 }
        ];
        const layout = generateCrosswordLayout(wordsWithClues);
        expect(layout.result[0].answer).toBe('social_media');
    });

    it('should throw an error if words cannot fit', () => {
        const wordsWithClues = [
            { answer: 'a'.repeat(100), clue: 'Too long to fit', position: 1 }
        ];
        expect(() => generateCrosswordLayout(wordsWithClues)).toThrow('Failed to generate crossword layout');
    });
});
