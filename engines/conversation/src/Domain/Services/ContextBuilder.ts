import { TokenCount } from "../ValueObjects/TokenCount";
import { Message } from "../Entities/Message";

export interface IContextBuilder {
    buildPromptContext(
        messages: readonly Message[],
        systemPrompt?: string,
        tokenBudget?: TokenCount
    ): {
        readonly systemPrompt: string;
        readonly messages: { role: string; content: string }[];
        readonly totalTokens: TokenCount;
    };
}

export class ContextBuilder implements IContextBuilder {
    private readonly contextWindowPolicy: { maxContextTokens: number };

    public constructor(contextWindowPolicy: { maxContextTokens: number } = { maxContextTokens: 4096 }) {
        this.contextWindowPolicy = contextWindowPolicy;
    }

    public buildPromptContext(
        messages: readonly Message[],
        systemPrompt?: string,
        tokenBudget?: TokenCount
    ): {
        readonly systemPrompt: string;
        readonly messages: { role: string; content: string }[];
        readonly totalTokens: TokenCount;
    } {
        const budget = tokenBudget || TokenCount.create(this.contextWindowPolicy.maxContextTokens);
        let availableTokens = budget.getValue();
        const contextMessages: { role: string; content: string }[] = [];

        if (systemPrompt) {
            const systemTokens = TokenCount.create(systemPrompt.length / 4);
            availableTokens -= systemTokens.getValue();
        }

        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            const messageTokens = message.getTokenCount().getValue();
            if (availableTokens - messageTokens < 0) {
                break;
            }
            availableTokens -= messageTokens;
            contextMessages.unshift({
                role: message.getRole().getValue(),
                content: message.getContent()
            });
        }

        return {
            systemPrompt: systemPrompt || "",
            messages: contextMessages,
            totalTokens: TokenCount.create(budget.getValue() - availableTokens)
        };
    }
}
