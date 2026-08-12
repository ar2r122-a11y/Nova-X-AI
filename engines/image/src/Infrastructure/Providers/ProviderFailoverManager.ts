import type { IImageProviderAdapter } from "../../Contracts/IImageProviderAdapter";

export class ProviderFailoverManager {
    private readonly providers: IImageProviderAdapter[] = [];
    private currentProviderIndex = 0;

    registerProvider(adapter: IImageProviderAdapter): void {
        this.providers.push(adapter);
    }

    async getNextAvailableProvider(): Promise<IImageProviderAdapter | null> {
        const startIndex = this.currentProviderIndex;
        for (let i = 0; i < this.providers.length; i++) {
            const index = (startIndex + i) % this.providers.length;
            try {
                const available = await this.providers[index].isAvailable();
                if (available) {
                    this.currentProviderIndex = index;
                    return this.providers[index];
                }
            } catch {
                continue;
            }
        }
        return null;
    }

    async executeWithFailover<T>(
        executeFn: (adapter: IImageProviderAdapter) => Promise<T>,
        fallbackValue: T
    ): Promise<T> {
        for (let i = 0; i < this.providers.length; i++) {
            try {
                const adapter = this.providers[i];
                const available = await adapter.isAvailable();
                if (!available) {
                    continue;
                }
                return await executeFn(adapter);
            } catch {
                continue;
            }
        }
        return fallbackValue;
    }

    reset(): void {
        this.currentProviderIndex = 0;
    }
}
