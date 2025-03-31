class CrosswordApp {
    constructor() {
        this.gridContainer = document.getElementById('crossword-grid');
        this.acrossClues = document.getElementById('across-clues');
        this.downClues = document.getElementById('down-clues');
        this.crosswordData = window.crosswordData;
        this.init();
    }

    init() {
        if (this.crosswordData) {
            const crossword = new Crossword({
                container: this.gridContainer,
                data: this.crosswordData,
                onCorrect: () => this.checkCompletion(),
            });

            this.renderClues();
        }
    }

    renderClues() {
        const { across, down } = this.crosswordData.clues;
        
        across.forEach(clue => {
            this.acrossClues.innerHTML += `
                <div class="clue-item" data-number="${clue.number}">
                    ${clue.number}. ${clue.clue}
                </div>
            `;
        });

        down.forEach(clue => {
            this.downClues.innerHTML += `
                <div class="clue-item" data-number="${clue.number}">
                    ${clue.number}. ${clue.clue}
                </div>
            `;
        });
    }

    checkCompletion() {
        if (this.crosswordData.isComplete) {
            alert('Congratulations! You solved the crossword!');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CrosswordApp();
});