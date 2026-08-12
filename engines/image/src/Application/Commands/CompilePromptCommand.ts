import { ICommand } from "@nova-x-ai/core";

export class CompilePromptCommand implements ICommand {
    constructor(
        public readonly imageId: string,
        public readonly prompt: string,
        public readonly negativePrompt: string,
        public readonly visualTags: string[],
        public readonly styleTokens: string[],
        public readonly environmentalModifiers: string[],
        public readonly claims: { roles: string[]; permissions: string[] },
        public readonly metadata?: Record<string, unknown>
    ) {}
}
