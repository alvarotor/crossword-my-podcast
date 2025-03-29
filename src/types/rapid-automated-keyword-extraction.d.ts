declare module 'rapid-automated-keyword-extraction' {
    export function rake(
        text: string,
        options: {
            minLength?: number;
            maxLength?: number;
            minKeywordFrequency?: number;
            language?: string;
            removeStopWords?: boolean;
        }
    ): Promise<string[]>;
}
