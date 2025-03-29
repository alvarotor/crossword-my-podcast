import { ClueGenerator } from '../clueGenerator';

describe('ClueGenerator', () => {
    const clueGenerator = new ClueGenerator();

    it('should generate a context-based clue', async () => {
        const context = 'The podcast discusses crossword puzzles.';
        const clue = await clueGenerator.generateClue('crossword', context);
        expect(clue).toContain('_____ puzzles');
    });

    it('should fallback to WordNet for a clue', async () => {
        const clue = await clueGenerator.generateClue('apple', '');
        expect(clue).toBeDefined();
    });

    it('should fallback to dictionary definitions if WordNet fails', async () => {
        const clue = await clueGenerator.generateClue('nonexistentword', '');
        expect(clue).toContain('Related to podcast content');
    });
});
