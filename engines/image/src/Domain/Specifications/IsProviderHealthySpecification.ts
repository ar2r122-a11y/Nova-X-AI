
export class IsProviderHealthySpecification {
    private readonly healthyProviders: Set<string> = new Set();
    private readonly unhealthyProviders: Set<string> = new Set();

    constructor(providerIds: string[]) {
        for (const id of providerIds) {
            this.healthyProviders.add(id);
        }
    }

    public isSatisfiedBy(providerId: string): boolean {
        return this.healthyProviders.has(providerId) && !this.unhealthyProviders.has(providerId);
    }

    public markUnhealthy(providerId: string): void {
        this.healthyProviders.delete(providerId);
        this.unhealthyProviders.add(providerId);
    }

    public markHealthy(providerId: string): void {
        this.unhealthyProviders.delete(providerId);
        this.healthyProviders.add(providerId);
    }
}
