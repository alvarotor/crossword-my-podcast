import CrosswordsJS from 'crosswords-js';

class CrosswordApp {
    constructor() {
        this.crossword = null;
        document.getElementById('generate-btn').addEventListener('click', () => this.generateCrossword());
        document.getElementById('check-puzzle-btn').addEventListener('click', () => this.checkPuzzle());
        document.getElementById('reveal-answer-btn').addEventListener('click', () => this.revealAnswer());
        document.getElementById('close-modal-btn').addEventListener('click', () => this.closeCompletionModal());

        // Add responsive design adjustments
        window.addEventListener('resize', () => this.adjustGridScale());
        this.adjustGridScale();
    }

    async generateCrossword() {
        const transcript = document.getElementById('transcript-input').value;
        if (!transcript.trim()) {
            this.showError('Please enter a transcript');
            return;
        }

        try {
            const response = await fetch('/generate-crossword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript })
            });

            const data = await response.json();
            if (response.ok) {
                this.renderCrossword(data.crossword);
            } else {
                this.showError(data.error);
            }
        } catch (error) {
            this.showError('Failed to generate crossword');
        }
    }

    renderCrossword(crosswordData) {
        const container = document.getElementById('crossword-grid');
        container.innerHTML = ''; // Clear previous crossword

        this.crossword = new CrosswordsJS.Controller({
            container,
            data: this.formatDataForRenderer(crosswordData)
        });

        // Render clues with numbering
        this.renderClues(crosswordData.result);

        this.crossword.on('clueComplete', () => this.checkCompletion());
    }

    renderClues(words) {
        const acrossClues = document.getElementById('across-clues');
        const downClues = document.getElementById('down-clues');
        acrossClues.innerHTML = '';
        downClues.innerHTML = '';

        words.forEach(word => {
            const clueElement = document.createElement('li');
            clueElement.textContent = `${word.position}. ${word.clue}`;
            if (word.orientation === 'across') {
                acrossClues.appendChild(clueElement);
            } else if (word.orientation === 'down') {
                downClues.appendChild(clueElement);
            }
        });
    }

    formatDataForRenderer(crosswordData) {
        return {
            grid: crosswordData.table,
            clues: {
                across: crosswordData.result.filter(w => w.orientation === 'across').map(w => ({
                    number: w.position,
                    clue: `${w.clue} (${w.answer.length} letters)`,
                    answer: w.answer.replace(/_/g, ' '), // Replace underscores with spaces
                    row: w.starty,
                    col: w.startx
                })),
                down: crosswordData.result.filter(w => w.orientation === 'down').map(w => ({
                    number: w.position,
                    clue: `${w.clue} (${w.answer.length} letters)`,
                    answer: w.answer.replace(/_/g, ' '), // Replace underscores with spaces
                    row: w.starty,
                    col: w.startx
                }))
            }
        };
    }

    checkCompletion() {
        if (this.crossword.isComplete()) {
            this.showCompletionModal();
        }
    }

    checkPuzzle() {
        const cells = document.querySelectorAll('.crossword-cell');
        cells.forEach(cell => {
            const isCorrect = this.crossword.checkCell(cell.dataset.row, cell.dataset.col);
            cell.classList.toggle('correct', isCorrect);
            cell.classList.toggle('incorrect', !isCorrect);
        });
    }

    revealAnswer() {
        this.crossword.revealAll();
        this.showCompletionModal();
    }

    showCompletionModal() {
        const modal = document.getElementById('completion-modal');
        modal.style.display = 'flex';
    }

    closeCompletionModal() {
        const modal = document.getElementById('completion-modal');
        modal.style.display = 'none';
    }

    showError(message) {
        alert(message);
    }

    adjustGridScale() {
        const container = document.getElementById('crossword-grid');
        if (window.innerWidth < 768) {
            container.style.transform = 'scale(0.8)'; // Scale down for smaller screens
        } else {
            container.style.transform = 'scale(1)';
        }
    }
}

new CrosswordApp();