/**
 * Nova X AI
 * AI Router
 * Application Service: AIRouter
 *
 * Orchestrates provider registration, selection, and prompt execution.
 * SDS §126: AI Router is the routing layer between engines and providers.
 */
import { ProviderHealth } from "../Domain/ValueObjects/ProviderHealth";
import { TokenBudget } from "../Domain/ValueObjects/TokenBudget";
import { PromptModel } from "../Domain/ValueObjects/PromptModel";
import {
    IAiProvider,
    PromptRequest,
    PromptResult,
    StreamChunk
} from "../Domain/Services/IAiProvider";
import { ProviderSelector, ProviderSelectionContext } from "../Domain/Services/ProviderSelector";
import { CircuitBreaker } from "../Domain/Services/CircuitBreaker";
import { ProviderRegistration } from "../Domain/Entities/ProviderRegistration";
import type { ProviderInfo } from "../Domain/Entities/ProviderRegistration";
import { IProviderRepository } from "../Domain/Repositories/IProviderRepository";
import { ProviderRegisteredEvent } from "../Domain/Events/ProviderRegisteredEvent";
import { ProviderStatusChangedEvent } from "../Domain/Events/ProviderStatusChangedEvent";

export type {
    ProviderSelectionContext
} from "../Domain/Services/ProviderSelector";
export type { ProviderInfo } from "../Domain/Entities/ProviderRegistration";

export interface AIRouterOptions {
    readonly repository?: IProviderRepository;

    readonly onProviderRegistered?: (
        event: ProviderRegisteredEvent
    ) => void;

    readonly onProviderStatusChanged?: (
        event: ProviderStatusChangedEvent
    ) => void;
}

export class AIRouter {

    private readonly providers = new Map<string, IAiProvider>();

    private readonly registrations = new Map<string, ProviderRegistration>();

    private readonly circuitBreakers = new Map<string, CircuitBreaker>();

    private readonly selector: ProviderSelector;

    private readonly repository?: IProviderRepository;

    private readonly onProviderRegistered?: (
        event: ProviderRegisteredEvent
    ) => void;

    private readonly onProviderStatusChanged?: (
        event: ProviderStatusChangedEvent
    ) => void;

    constructor(
        options: AIRouterOptions = {}
    ) {
        this.repository = options.repository;
        this.onProviderRegistered = options.onProviderRegistered;
        this.onProviderStatusChanged = options.onProviderStatusChanged;
        this.selector = new ProviderSelector(
            this.providers,
            (provider) => {
                const registration =
                    this.registrations.get(
                        provider.id.value
                    );
                return registration
                    ? registration.priority
                    : 0;
            }
        );
    }

    public registerProvider(
        provider: IAiProvider,
        priority: number = 0,
        isEnabled: boolean = true
    ): ProviderRegistration {

        const idValue = provider.id.value;

        if (this.providers.has(idValue)) {

            throw new Error(
                `Provider '${idValue}' is already registered.`
            );

        }

        const registration = new ProviderRegistration(
            provider.id,
            provider.name,
            provider.capabilities,
            priority,
            isEnabled
        );

        this.providers.set(idValue, provider);
        this.registrations.set(idValue, registration);
        this.circuitBreakers.set(idValue, new CircuitBreaker());

        const event = new ProviderRegisteredEvent(
            registration
        );

        this.emitProviderRegistered(event);

        if (this.repository) {

            this.repository.save(registration);

        }

        return registration;

    }

    public unregisterProvider(
        providerId: string
    ): boolean {

        const removed = this.providers.delete(
            providerId
        );

        if (removed) {

            this.registrations.delete(providerId);

            this.circuitBreakers.delete(providerId);

            if (this.repository) {

                this.repository.remove(providerId);

            }

        }

        return removed;

    }

    public getProviders(): readonly ProviderInfo[] {

        return Array.from(
            this.registrations.values()
        ).map(r => r.toInfo());

    }

    public getProvider(
        providerId: string
    ): ProviderRegistration | undefined {

        return this.registrations.get(providerId);

    }

    public getProviderHealth(
        providerId: string
    ): ProviderHealth | undefined {

        const registration =
            this.registrations.get(providerId);

        if (!registration) {

            return undefined;

        }

        const cb =
            this.circuitBreakers.get(providerId);

        return cb
            ? cb.getHealth()
            : registration.getHealth();

    }

    public async executePrompt(
        request: PromptRequest,
        context?: ProviderSelectionContext
    ): Promise<PromptResult> {

        const selection = this.selector.select(
            context
        );

        if (!selection.selected) {

            throw new Error(
                "No AI provider is available to handle the request."
            );

        }

        const candidates = [
            selection.selected,
            ...selection.fallbacks
        ];

        let lastError: Error | null = null;

        for (const candidate of candidates) {

            const registration =
                this.registrations.get(candidate.id.value);

            const budget = registration
                ? registration.getBudget()
                : new TokenBudget(candidate.capabilities.maxContextTokens);

            budget.validate(
                request.maxTokens,
                request.maxTokens
            );

            const cb =
                this.circuitBreakers.get(candidate.id.value);

            if (cb && !cb.canExecute()) {

                continue;

            }

            try {

                return await this.executeWithProvider(
                    candidate,
                    request,
                    budget
                );

            } catch (error) {

                lastError = error instanceof Error
                    ? error
                    : new Error(String(error));

            }

        }

        throw lastError ?? new Error(
            "All providers failed to execute the prompt."
        );

    }

    public async *executePromptStream(
        request: PromptRequest,
        context?: ProviderSelectionContext
    ): AsyncIterable<StreamChunk> {

        const selection = this.selector.select(
            context
        );

        if (!selection.selected) {

            throw new Error(
                "No AI provider is available to handle the request."
            );

        }

        const candidates = [
            selection.selected,
            ...selection.fallbacks
        ];

        let lastError: Error | null = null;

        for (const candidate of candidates) {

            const registration =
                this.registrations.get(candidate.id.value);

            const budget = registration
                ? registration.getBudget()
                : new TokenBudget(candidate.capabilities.maxContextTokens);

            budget.validate(
                request.maxTokens,
                request.maxTokens
            );

            const cb =
                this.circuitBreakers.get(candidate.id.value);

            if (cb && !cb.canExecute()) {

                continue;

            }

            try {

                yield * this.streamWithProvider(
                    candidate,
                    request,
                    budget,
                    cb
                );

                return;

            } catch (error) {

                lastError = error instanceof Error
                    ? error
                    : new Error(String(error));

            }

        }

        throw lastError ?? new Error(
            "All providers failed to stream the prompt."
        );

    }

    public getSelector(): ProviderSelector {

        return this.selector;

    }

    public getProviderModel(
        providerId: string
    ): PromptModel | undefined {

        const registration =
            this.registrations.get(providerId);

        if (!registration) {

            return undefined;

        }

        const models =
            registration.capabilities.supportedModels;

        if (models.length === 0) {

            return undefined;

        }

        return new PromptModel(models[0], providerId);

    }

    private async executeWithProvider(
        provider: IAiProvider,
        request: PromptRequest,
        _budget: TokenBudget
    ): Promise<PromptResult> {

        const cb =
            this.circuitBreakers.get(provider.id.value);

        try {

            const result =
                await provider.executePrompt(request);

            if (cb) {

                cb.recordSuccess();

                this.syncHealth(provider.id.value);

            }

            return result;

        } catch (error) {

            if (cb) {

                cb.recordFailure(
                    error instanceof Error
                        ? error.message
                        : String(error)
                );

                this.syncHealth(provider.id.value);

            }

            throw error;

        }

    }

    private async *streamWithProvider(
        provider: IAiProvider,
        request: PromptRequest,
        _budget: TokenBudget,
        cb?: CircuitBreaker
    ): AsyncIterable<StreamChunk> {

        try {

            for await (const chunk of provider.executePromptStream(request)) {

                yield chunk;

            }

            if (cb) {

                cb.recordSuccess();

                this.syncHealth(provider.id.value);

            }

        } catch (error) {

            if (cb) {

                cb.recordFailure(
                    error instanceof Error
                        ? error.message
                        : String(error)
                );

                this.syncHealth(provider.id.value);

            }

            throw error;

        }

    }

    private syncHealth(providerId: string): void {

        const registration =
            this.registrations.get(providerId);

        const cb =
            this.circuitBreakers.get(providerId);

        if (!registration || !cb) {

            return;

        }

        const previous = registration.getHealth();

        const current = cb.getHealth();

        if (previous.status !== current.status) {

            registration.setHealth(current);

            const event = new ProviderStatusChangedEvent(
                registration,
                current
            );

            this.emitProviderStatusChanged(event);

        }

    }

    private emitProviderRegistered(
        event: ProviderRegisteredEvent
    ): void {

        this.onProviderRegistered?.(event);

    }

    private emitProviderStatusChanged(
        event: ProviderStatusChangedEvent
    ): void {

        this.onProviderStatusChanged?.(event);

    }

}
