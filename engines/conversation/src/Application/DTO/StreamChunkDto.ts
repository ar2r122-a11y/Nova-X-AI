export class StreamChunkDto {
    constructor(
        public readonly conversationId: string,
        public readonly sessionId: string,
        public readonly sequence: number,
        public readonly delta: string,
        public readonly isLast: boolean,
        public readonly model?: string,
        public readonly usage?: {
            readonly promptTokens: number;
            readonly completionTokens: number;
            readonly totalTokens: number;
        }
    ) {}
}
