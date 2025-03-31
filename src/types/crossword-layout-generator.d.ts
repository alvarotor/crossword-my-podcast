declare module 'crossword-layout-generator' {
    export interface CrosswordWord {
        answer: string;
        clue: string;
        startx?: number;
        starty?: number;
        position?: number;
        orientation?: string;
    }

    export interface CrosswordResult {
        startx: number;
        starty: number;
        orientation: string;
        position: number;
        answer: string;
        clue: string;
    }

    export interface CrosswordLayout {
        table: string[][];
        result: CrosswordResult[];
        table_string: string;
        rows: number;
        cols: number;
    }

    export interface LayoutOptions {
        maxAttempts?: number;
        preferHorizontal?: number;
        maxGridSize?: number;
        minWords?: number;
    }

    const generator: {
        generateLayout(words: CrosswordWord[], options?: LayoutOptions): CrosswordLayout;
    };
    
    export = generator;
}
