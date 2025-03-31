import { Router, Request, Response, NextFunction } from 'express';
import { validateTranscript } from '../middleware/validation';
import { generateCrossword } from '../controllers/crosswordController';
import path from 'path';
import fs from 'fs';

const router = Router();

router.post('/generate-crossword', validateTranscript, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { transcript } = req.body;
        const crossword = await generateCrossword(transcript);

        // Read all required files
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '../../public/index.html'), 'utf-8');
        const cssContent = fs.readFileSync(path.join(__dirname, '../../public/styles.css'), 'utf-8');
        const jsContent = fs.readFileSync(path.join(__dirname, '../../public/app.js'), 'utf-8');

        // Create HTML with embedded CSS and JS
        const htmlWithEmbeddedContent = htmlTemplate
            .replace('</head>', `<style>${cssContent}</style></head>`)
            .replace('</body>', `
                <script>
                    window.crosswordData = ${JSON.stringify(crossword)};

                    class CrosswordApp {
                        constructor() {
                            this.grid = document.getElementById('crossword-grid');
                            this.acrossClues = document.getElementById('across-clues');
                            this.downClues = document.getElementById('down-clues');
                            this.data = window.crosswordData;
                            this.init();
                        }

                        init() {
                            this.renderGrid();
                            this.renderClues();
                            this.setupEventListeners();
                        }

                        renderGrid() {
                            const table = document.createElement('table');
                            table.className = 'crossword-grid';
                            
                            for (let y = 0; y < this.data.rows; y++) {
                                const row = document.createElement('tr');
                                for (let x = 0; x < this.data.cols; x++) {
                                    const cell = document.createElement('td');
                                    cell.className = 'crossword-cell';
                                    
                                    const cellContent = this.data.table[y][x];
                                    if (cellContent !== '') {
                                        const input = document.createElement('input');
                                        input.type = 'text';
                                        input.maxLength = 1;
                                        input.dataset.x = x.toString();
                                        input.dataset.y = y.toString();
                                        cell.appendChild(input);

                                        // Add cell number if it's a start of word
                                        const wordStart = this.findWordStartingAt(x, y);
                                        if (wordStart) {
                                            const number = document.createElement('div');
                                            number.className = 'cell-number';
                                            number.textContent = wordStart.position;
                                            cell.appendChild(number);
                                        }
                                    } else {
                                        cell.classList.add('blocked');
                                    }
                                    row.appendChild(cell);
                                }
                                table.appendChild(row);
                            }
                            this.grid.appendChild(table);
                        }

                        findWordStartingAt(x, y) {
                            return this.data.result.find(word => 
                                word.startx === x && word.starty === y
                            );
                        }

                        renderClues() {
                            const acrossWords = this.data.result.filter(word => 
                                word.orientation === 'across'
                            );
                            const downWords = this.data.result.filter(word => 
                                word.orientation === 'down'
                            );

                            this.renderClueList(acrossWords, this.acrossClues);
                            this.renderClueList(downWords, this.downClues);
                        }

                        renderClueList(words, container) {
                            words.sort((a, b) => a.position - b.position)
                                .forEach(word => {
                                    const div = document.createElement('div');
                                    div.className = 'clue-item';
                                    div.textContent = \`\${word.position}. \${word.clue}\`;
                                    container.appendChild(div);
                                });
                        }

                        setupEventListeners() {
                            const inputs = document.querySelectorAll('.crossword-cell input');
                            inputs.forEach(input => {
                                input.addEventListener('keyup', (e) => {
                                    if (e.key === 'Enter' || input.value.length === 1) {
                                        this.moveToNextCell(input);
                                    }
                                });
                                input.addEventListener('focus', () => {
                                    this.highlightRelatedCells(input);
                                });
                            });
                        }

                        moveToNextCell(currentInput) {
                            const x = parseInt(currentInput.dataset.x);
                            const y = parseInt(currentInput.dataset.y);
                            const nextInput = document.querySelector(
                                \`input[data-x="\${x + 1}"][data-y="\${y}"],
                                 input[data-x="0"][data-y="\${y + 1}"]\`
                            );
                            if (nextInput) nextInput.focus();
                        }

                        highlightRelatedCells(input) {
                            document.querySelectorAll('.crossword-cell input').forEach(i => 
                                i.parentElement.classList.remove('highlighted')
                            );

                            const x = parseInt(input.dataset.x);
                            const y = parseInt(input.dataset.y);
                            const words = this.data.result.filter(word => 
                                this.isCellPartOfWord(x, y, word)
                            );

                            words.forEach(word => this.highlightWord(word));
                        }

                        isCellPartOfWord(x, y, word) {
                            if (word.orientation === 'across') {
                                return y === word.starty && 
                                       x >= word.startx && 
                                       x < word.startx + word.answer.length;
                            } else {
                                return x === word.startx && 
                                       y >= word.starty && 
                                       y < word.starty + word.answer.length;
                            }
                        }

                        highlightWord(word) {
                            for (let i = 0; i < word.answer.length; i++) {
                                const x = word.orientation === 'across' ? 
                                    word.startx + i : word.startx;
                                const y = word.orientation === 'down' ? 
                                    word.starty + i : word.starty;
                                const input = document.querySelector(
                                    \`input[data-x="\${x}"][data-y="\${y}"]\`
                                );
                                if (input) {
                                    input.parentElement.classList.add('highlighted');
                                }
                            }
                        }
                    }

                    document.addEventListener('DOMContentLoaded', () => {
                        new CrosswordApp();
                    });
                </script>
                </body>
            `);

        res.header('Content-Type', 'text/html');
        res.send(htmlWithEmbeddedContent);
    } catch (error) {
        next(error);
    }
});

export default router;
