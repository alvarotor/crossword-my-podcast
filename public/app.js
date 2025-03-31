class CrosswordApp {
    constructor() {
        this.gridContainer = document.getElementById('crossword-grid');
        this.acrossClues = document.getElementById('across-clues');
        this.downClues = document.getElementById('down-clues');
        this.activeCell = null;
        this.activeOrientation = 'across';
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        if (!this.activeCell) return;

        if (e.key.match(/^[a-zA-Z]$/)) {
            this.activeCell.value = e.key.toUpperCase();
            this.moveToNextCell();
        } else if (e.key === 'Backspace') {
            if (this.activeCell.value === '') {
                this.moveToPrevCell();
            }
            this.activeCell.value = '';
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || 
                   e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            this.handleArrowKey(e.key);
            e.preventDefault();
        }
    }

    renderCrossword(crosswordData) {
        this.gridContainer.innerHTML = '';
        const grid = document.createElement('table');
        grid.className = 'crossword-grid';
        
        for (let y = 0; y < crosswordData.rows; y++) {
            const row = document.createElement('tr');
            for (let x = 0; x < crosswordData.cols; x++) {
                const cell = document.createElement('td');
                cell.className = 'crossword-cell';
                
                const wordStart = crosswordData.result.find(
                    word => word.startx === x && word.starty === y
                );
                
                if (wordStart) {
                    const number = document.createElement('span');
                    number.className = 'cell-number';
                    number.textContent = wordStart.position;
                    cell.appendChild(number);
                }
                
                if (crosswordData.table[y][x] !== '.') {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.dataset.x = x;
                    input.dataset.y = y;
                    input.addEventListener('focus', () => this.handleCellFocus(input));
                    cell.appendChild(input);
                } else {
                    cell.classList.add('blocked');
                }
                
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
        
        this.gridContainer.appendChild(grid);
        this.renderClues(crosswordData.result);
    }

    renderClues(words) {
        const across = words.filter(word => word.orientation === 'across');
        const down = words.filter(word => word.orientation === 'down');
        
        this.acrossClues.innerHTML = '<h3>Across</h3>' + this.formatClueList(across);
        this.downClues.innerHTML = '<h3>Down</h3>' + this.formatClueList(down);
    }

    formatClueList(words) {
        return `<ul>${words.map(word => 
            `<li data-word="${word.answer}">
                <span class="clue-number">${word.position}.</span> 
                ${word.clue} (${word.answer.length})
            </li>`
        ).join('')}</ul>`;
    }

    handleCellFocus(input) {
        this.activeCell = input;
        this.highlightWord();
    }

    highlightWord() {
        // Remove previous highlights
        document.querySelectorAll('.highlighted').forEach(cell => 
            cell.classList.remove('highlighted'));
        
        // Add new highlights
        const x = parseInt(this.activeCell.dataset.x);
        const y = parseInt(this.activeCell.dataset.y);
        
        document.querySelectorAll('.crossword-cell input').forEach(input => {
            const cellX = parseInt(input.dataset.x);
            const cellY = parseInt(input.dataset.y);
            
            if ((this.activeOrientation === 'across' && cellY === y) ||
                (this.activeOrientation === 'down' && cellX === x)) {
                input.parentElement.classList.add('highlighted');
            }
        });
    }

    moveToNextCell() {
        const x = parseInt(this.activeCell.dataset.x);
        const y = parseInt(this.activeCell.dataset.y);
        
        const nextCell = this.findNextCell(x, y);
        if (nextCell) {
            nextCell.focus();
        }
    }

    moveToPrevCell() {
        const x = parseInt(this.activeCell.dataset.x);
        const y = parseInt(this.activeCell.dataset.y);
        
        const prevCell = this.findPrevCell(x, y);
        if (prevCell) {
            prevCell.focus();
        }
    }

    findNextCell(x, y) {
        const dx = this.activeOrientation === 'across' ? 1 : 0;
        const dy = this.activeOrientation === 'down' ? 1 : 0;
        return document.querySelector(
            `.crossword-cell input[data-x="${x + dx}"][data-y="${y + dy}"]`
        );
    }

    findPrevCell(x, y) {
        const dx = this.activeOrientation === 'across' ? 1 : 0;
        const dy = this.activeOrientation === 'down' ? 1 : 0;
        return document.querySelector(
            `.crossword-cell input[data-x="${x - dx}"][data-y="${y - dy}"]`
        );
    }
}

// Initialize the app
const app = new CrosswordApp();