export class ProviderCostMetadata {
    private readonly estimatedCostMicros: number;
    private readonly currency: string;
    private readonly providerId: string;

    private constructor(estimatedCostMicros: number, currency: string, providerId: string) {
        this.estimatedCostMicros = estimatedCostMicros;
        this.currency = currency;
        this.providerId = providerId;
    }

    public static create(estimatedCostMicros: number, currency: string, providerId: string): ProviderCostMetadata {
        if (estimatedCostMicros < 0) {
            throw new Error("ProviderCostMetadata estimatedCostMicros cannot be negative.");
        }
        if (!currency || currency.trim().length === 0) {
            throw new Error("ProviderCostMetadata currency cannot be empty.");
        }
        return new ProviderCostMetadata(estimatedCostMicros, currency.trim(), providerId);
    }

    public static free(providerId: string): ProviderCostMetadata {
        return new ProviderCostMetadata(0, "USD", providerId);
    }

    public static fromProvider(providerId: string, costMicros: number): ProviderCostMetadata {
        return ProviderCostMetadata.create(costMicros, "USD", providerId);
    }

    public getEstimatedCostMicros(): number {
        return this.estimatedCostMicros;
    }

    public getCurrency(): string {
        return this.currency;
    }

    public getProviderId(): string {
        return this.providerId;
    }

    public isFree(): boolean {
        return this.estimatedCostMicros === 0;
    }
}
