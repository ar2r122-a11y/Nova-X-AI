import { ICommand } from "@nova-x-ai/core";

export class GenerateImageCommand implements ICommand {
    constructor(
        public readonly sessionId: string,
        public readonly ownerId: string,
        public readonly prompt: string,
        public readonly negativePrompt: string,
        public readonly mode: string,
        public readonly aspectRatio: string,
        public readonly width: number,
        public readonly height: number,
        public readonly candidateCount: number,
        public readonly claims: { roles: string[]; permissions: string[] },
        public readonly seed?: number,
        public readonly steps?: number,
        public readonly cfgScale?: number,
        public readonly visualTags?: string[],
        public readonly styleTokens?: string[],
        public readonly environmentalModifiers?: string[],
        public readonly metadata?: Record<string, unknown>
    ) {}
}
