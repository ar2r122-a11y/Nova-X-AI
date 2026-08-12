import type { IContextBuilder } from "../../Domain/Services/ContextBuilder";
import { TokenCount } from "../../Domain/ValueObjects/TokenCount";
import { Message } from "../../Domain/Entities/Message";

export interface IAIContextBuilder {
    buildPromptContext(
        messages: Message[],
        systemPrompt?: string
    ): Promise<{
        readonly systemPrompt: string;
        readonly messages: { role: string; content: string }[];
        readonly totalTokens: TokenCount;
    }>;
}

export class AIContextBuilder implements IAIContextBuilder {
    private readonly contextBuilder: IContextBuilder;

    public constructor(contextBuilder: IContextBuilder) {
        this.contextBuilder = contextBuilder;
    }

    public async buildPromptContext(
        messages: Message[],
        systemPrompt?: string
    ): Promise<{
        readonly systemPrompt: string;
        readonly messages: { role: string; content: string }[];
        readonly totalTokens: TokenCount;
    }> {
        return this.contextBuilder.buildPromptContext(messages, systemPrompt);
    }
}
