/**
 * Nova X AI
 * AI Router
 * Domain Service Interface: IProviderRepository
 *
 * Port interface for provider persistence.
 */
import { ProviderRegistration } from "../Entities/ProviderRegistration";

export interface IProviderRepository {

    save(provider: ProviderRegistration): Promise<void>;

    findById(
        providerId: string
    ): Promise<ProviderRegistration | null>;

    findByName(
        name: string
    ): Promise<ProviderRegistration | null>;

    findAll(): Promise<readonly ProviderRegistration[]>;

    findActive(): Promise<ProviderRegistration | null>;

    setActive(
        providerId: string
    ): Promise<void>;

    remove(providerId: string): Promise<void>;

    clear(): Promise<void>;

}
