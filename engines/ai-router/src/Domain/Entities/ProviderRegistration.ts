/**
 * Nova X AI
 * AI Router
 * Domain Entity: ProviderRegistration
 *
 * Represents a registered AI provider within the router.
 */
import { ProviderId } from "../ValueObjects/ProviderId";
import { ProviderHealth } from "../ValueObjects/ProviderHealth";
import { TokenBudget } from "../ValueObjects/TokenBudget";
import { ProviderCapabilities } from "../Services/IAiProvider";

export class ProviderRegistration {

    public readonly id: ProviderId;

    public readonly name: string;

    public readonly capabilities: ProviderCapabilities;

    public readonly priority: number;

    public readonly isEnabled: boolean;

    private health: ProviderHealth;

    private isActive: boolean;

    private readonly registeredAt: number;

    constructor(
        id: ProviderId,
        name: string,
        capabilities: ProviderCapabilities,
        priority: number = 0,
        isEnabled: boolean = true
    ) {

        if (!name || name.trim().length === 0) {

            throw new Error(
                "ProviderRegistration name cannot be empty."
            );

        }

        this.id = id;

        this.name = name;

        this.capabilities = capabilities;

        this.priority = priority;

        this.isEnabled = isEnabled;

        this.health = new ProviderHealth();

        this.isActive = false;

        this.registeredAt = Date.now();

    }

    public getId(): ProviderId {

        return this.id;

    }

    public getHealth(): ProviderHealth {

        return this.health;

    }

    public isActiveProvider(): boolean {

        return this.isActive;

    }

    public activate(): void {

        this.isActive = true;

    }

    public deactivate(): void {

        this.isActive = false;

    }

    public setHealth(health: ProviderHealth): void {

        this.health = health;

    }

    public getBudget(): TokenBudget {

        return new TokenBudget(
            this.capabilities.maxContextTokens
        );

    }

    public isAvailable(): boolean {

        return (
            this.isEnabled &&
            this.health.isHealthy()
        );

    }

    public getRegisteredAt(): number {

        return this.registeredAt;

    }

    public toInfo(): ProviderInfo {

        return {

            id: this.id.value,

            name: this.name,

            isActive: this.isActive,

            isAvailable: this.isAvailable(),

            health: this.health.status,

            priority: this.priority,

            capabilities: this.capabilities

        };

    }

}

export interface ProviderInfo {

    readonly id: string;

    readonly name: string;

    readonly isActive: boolean;

    readonly isAvailable: boolean;

    readonly health: string;

    readonly priority: number;

    readonly capabilities: ProviderCapabilities;

}
