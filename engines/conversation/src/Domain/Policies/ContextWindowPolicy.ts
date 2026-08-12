import { TokenCount } from "../ValueObjects/TokenCount";

export class ContextWindowPolicy {
    private readonly maxContextTokens: number;

    public constructor(maxContextTokens: number = 4096) {
        this.maxContextTokens = maxContextTokens;
    }

    public canAccommodate(requiredTokens: TokenCount): boolean {
        return requiredTokens.getValue() <= this.maxContextTokens;
    }

    public getMaxContextTokens(): number {
        return this.maxContextTokens;
    }

    public calculateAvailableTokens(usedTokens: TokenCount): TokenCount {
        const available = this.maxContextTokens - usedTokens.getValue();
        return TokenCount.create(Math.max(0, available));
    }
}
