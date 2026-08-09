/**
 * Nova X AI
 * AI Router
 * Domain Value Object: TokenBudget
 *
 * Enforces token/context budgeting for prompt execution.
 * SDS §126: AI Router enforces token budgeting.
 */
export class TokenBudget {

    public readonly maxTokens: number;

    public readonly reservedTokens: number;

    public readonly contextTokens: number;

    constructor(
        maxTokens: number,
        reservedTokens: number = 1024,
        contextTokens: number = 4096
    ) {

        if (maxTokens <= 0) {

            throw new Error(
                "TokenBudget maxTokens must be greater than zero."
            );

        }

        if (reservedTokens < 0) {

            throw new Error(
                "TokenBudget reservedTokens cannot be negative."
            );

        }

        if (contextTokens <= 0) {

            throw new Error(
                "TokenBudget contextTokens must be greater than zero."
            );

        }

        this.maxTokens = maxTokens;

        this.reservedTokens = reservedTokens;

        this.contextTokens = contextTokens;

    }

    public get availableTokens(): number {

        return this.maxTokens - this.reservedTokens;

    }

    public get contextWindow(): number {

        return this.contextTokens;

    }

    public validate(
        estimatedPromptTokens: number,
        estimatedCompletionTokens: number
    ): void {

        const total =
            estimatedPromptTokens + estimatedCompletionTokens;

        if (
            estimatedPromptTokens > this.contextTokens
        ) {

            throw new Error(
                `Estimated prompt tokens (${estimatedPromptTokens}) exceed context budget (${this.contextTokens}).`
            );

        }

        if (total > this.maxTokens) {

            throw new Error(
                `Estimated total tokens (${total}) exceed max budget (${this.maxTokens}).`
            );

        }

    }

    public canFit(
        estimatedPromptTokens: number,
        estimatedCompletionTokens: number
    ): boolean {

        try {

            this.validate(
                estimatedPromptTokens,
                estimatedCompletionTokens
            );

            return true;

        } catch {

            return false;

        }

    }

}
