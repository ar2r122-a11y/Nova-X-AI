/**
 * Nova X AI
 * AI Router
 * Domain Value Object: ProviderId
 *
 * A value object representing the unique identity of an AI provider.
 * SDS §126.26: Domain has zero external dependencies.
 */
export class ProviderId {

    public readonly value: string;

    constructor(value: string) {

        if (!value || value.trim().length === 0) {

            throw new Error(
                "ProviderId cannot be empty."
            );

        }

        this.value = value;

    }

    public static create(): ProviderId {

        return new ProviderId(
            `provider-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
        );

    }

    public static from(value: string): ProviderId {

        return new ProviderId(value);

    }

    public equals(other: ProviderId): boolean {

        return this.value === other.value;

    }

    public toString(): string {

        return this.value;

    }

}
