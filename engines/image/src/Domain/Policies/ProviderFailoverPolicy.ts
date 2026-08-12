
import { ProviderUnavailableException } from "../Exceptions/ImageExceptions";

export class ProviderFailoverPolicy {
    private readonly providers: string[];
    private readonly maxFailoverAttempts: number;

    constructor(providers: string[], maxFailoverAttempts: number = 3) {
        this.providers = providers;
        this.maxFailoverAttempts = maxFailoverAttempts;
    }

    getNextProvider(currentProvider: string): string {
        const currentIndex = this.providers.indexOf(currentProvider);
        if (currentIndex === -1) {
            throw new ProviderUnavailableException(currentProvider);
        }
        const nextIndex = (currentIndex + 1) % this.providers.length;
        return this.providers[nextIndex];
    }

    shouldFailover(attempt: number): boolean {
        return attempt < this.maxFailoverAttempts && this.providers.length > 1;
    }

    getProviders(): string[] {
        return this.providers;
    }
}
