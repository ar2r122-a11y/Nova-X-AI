export interface IContextCompressor {
    compress(messages: { content: string; tokenCount: number }[], targetTokens: number): Promise<{ content: string; tokenCount: number }[]>;
    getStrategy(): string;
    setStrategy(strategy: string): void;
}
