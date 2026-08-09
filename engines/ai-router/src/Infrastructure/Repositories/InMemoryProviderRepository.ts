/**
 * Nova X AI
 * AI Router
 * Infrastructure: InMemoryProviderRepository
 *
 * In-memory implementation of IProviderRepository for testing and prototyping.
 */
import { ProviderRegistration } from "../../Domain/Entities/ProviderRegistration";
import { IProviderRepository } from "../../Domain/Repositories/IProviderRepository";

export class InMemoryProviderRepository implements IProviderRepository {

    private readonly store = new Map<string, ProviderRegistration>();

    public async save(
        provider: ProviderRegistration
    ): Promise<void> {

        this.store.set(
            provider.getId().value,
            provider
        );

    }

    public async findById(
        providerId: string
    ): Promise<ProviderRegistration | null> {

        return this.store.get(providerId) ?? null;

    }

    public async findByName(
        name: string
    ): Promise<ProviderRegistration | null> {

        for (const provider of this.store.values()) {

            if (provider.toInfo().name === name) {

                return provider;

            }

        }

        return null;

    }

    public async findAll(): Promise<readonly ProviderRegistration[]> {

        return Array.from(this.store.values());

    }

    public async findActive(): Promise<ProviderRegistration | null> {

        for (const provider of this.store.values()) {

            if (provider.isActiveProvider()) {

                return provider;

            }

        }

        return null;

    }

    public async setActive(
        providerId: string
    ): Promise<void> {

        const provider =
            this.store.get(providerId);

        if (!provider) {

            throw new Error(
                `Provider '${providerId}' not found.`
            );

        }

        provider.activate();

    }

    public async remove(
        providerId: string
    ): Promise<void> {

        this.store.delete(providerId);

    }

    public async clear(): Promise<void> {

        this.store.clear();

    }

}
