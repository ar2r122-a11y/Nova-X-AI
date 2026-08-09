/**
 * Nova X AI
 * AI Router
 * Domain Value Object: PromptModel
 *
 * Represents an AI model identifier (e.g., "gpt-4o", "claude-3-5-sonnet-20241022").
 */
export class PromptModel {

    public readonly value: string;

    public readonly provider: string;

    constructor(
        value: string,
        provider: string
    ) {

        if (!value || value.trim().length === 0) {

            throw new Error(
                "PromptModel value cannot be empty."
            );

        }

        if (!provider || provider.trim().length === 0) {

            throw new Error(
                "PromptModel provider cannot be empty."
            );

        }

        this.value = value;

        this.provider = provider;

    }

    public toString(): string {

        return this.value;

    }

    public equals(other: PromptModel): boolean {

        return (
            this.value === other.value &&
            this.provider === other.provider
        );

    }

}
