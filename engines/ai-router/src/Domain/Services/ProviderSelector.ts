/**
 * Nova X AI
 * AI Router
 * Domain Service: ProviderSelector
 *
 * Routing logic for selecting the appropriate AI provider.
 * Implements fallback/routing behavior and provider selection.
 *
 * SDS §1: AI Router is the routing layer between engines and providers.
 * SDS §126: Provider selection, fallback/routing behavior.
 */
import { ProviderId } from "../ValueObjects/ProviderId";
import { IAiProvider } from "./IAiProvider";
import type { ProviderInfo } from "../Entities/ProviderRegistration";

export type ProviderSelectionStrategy =
    | "priority"
    | "round-robin"
    | "weighted";

export interface ProviderSelectionContext {

    readonly providerHint?: ProviderId;

    readonly strategy?: ProviderSelectionStrategy;

    readonly exclude?: readonly string[];

}

export interface ProviderSelectionResult {

    readonly selected: IAiProvider | null;

    readonly fallbacks: readonly IAiProvider[];

    readonly skipped: readonly string[];

    readonly reason: ProviderSelectionReason;

}

export enum ProviderSelectionReason {

    Success = "Success",

    NoProviders = "NoProviders",

    HintedProviderUnavailable = "HintedProviderUnavailable",

    AllProvidersUnhealthy = "AllProvidersUnhealthy",

}

export class ProviderSelector {

    private roundRobinIndex = 0;

    constructor(
        private readonly providers: Map<string, IAiProvider>,
        private readonly getPriority: (provider: IAiProvider) => number = () => 0
    ) {}

    public select(
        context?: ProviderSelectionContext
    ): ProviderSelectionResult {

        const available = this.getAvailableProviders(
            context?.exclude
        );

        if (available.length === 0) {

            const allIds = Array.from(
                this.providers.keys()
            );

            return {

                selected: null,

                fallbacks: [],

                skipped: allIds,

                reason: ProviderSelectionReason.NoProviders

            };

        }

        // If a hinted provider is specified and available, use it
        if (context?.providerHint) {

            const hinted =
                this.providers.get(
                    context.providerHint.value
                );

            if (hinted && hinted.isAvailable()) {

                const fallbacks =
                    available.filter(
                        p => p.id.value !==
                            context!.providerHint!.value
                    );

                return {

                    selected: hinted,

                    fallbacks,

                    skipped: [],

                    reason:
                        ProviderSelectionReason.Success

                };

            }

            // Hinted provider not available - fall through to fallback

            const skipped = [
                context.providerHint.value
            ];

            const fallbackResult =
                this.selectWithFallback(
                    available,
                    context
                );

            return {

                selected: fallbackResult.selected,

                fallbacks: fallbackResult.fallbacks,

                skipped: [
                    ...skipped,
                    ...fallbackResult.skipped
                ],

                reason: fallbackResult.selected
                    ? ProviderSelectionReason.Success
                    : ProviderSelectionReason.AllProvidersUnhealthy

            };

        }

        return this.selectWithFallback(
            available,
            context
        );

    }

    private selectWithFallback(
        available: IAiProvider[],
        context?: ProviderSelectionContext
    ): ProviderSelectionResult {

        const strategy =
            context?.strategy ??
            "priority";

        let selected: IAiProvider | null = null;

        let fallbacks: IAiProvider[] = [];

        if (strategy === "round-robin") {

            selected =
                this.roundRobinSelect(available);

            fallbacks = available.filter(
                p => p !== selected
            );

        } else if (strategy === "weighted") {

            selected =
                this.weightedSelect(available);

            fallbacks = available.filter(
                p => p !== selected
            );

        } else {

            // Default: priority-based selection
            const sorted =
                this.sortByPriority(available);

            selected = sorted[0] ?? null;

            fallbacks = sorted.slice(1);

        }

        const skipped: string[] = [];

        return {

            selected,

            fallbacks,

            skipped,

            reason: selected
                ? ProviderSelectionReason.Success
                : ProviderSelectionReason.AllProvidersUnhealthy

        };

    }

    public selectFallback(
        failedProviderId: ProviderId,
        context?: ProviderSelectionContext
    ): IAiProvider | null {

        const available = this.getAvailableProviders(
            context?.exclude
        );

        const fallbacks = available.filter(
            p => !p.id.equals(failedProviderId)
        );

        if (fallbacks.length === 0) {

            return null;

        }

        const sorted =
            this.sortByPriority(fallbacks);

        return sorted[0];

    }

    public getAvailableProviders(
        exclude?: readonly string[]
    ): IAiProvider[] {

        const excludeSet =
            new Set(exclude ?? []);

        return Array.from(
            this.providers.values()
        ).filter(
            p =>
                p.isAvailable() &&
                !excludeSet.has(p.id.value)
        );

    }

    public getProviders(): readonly IAiProvider[] {

        return Array.from(
            this.providers.values()
        );

    }

    public hasProvider(
        providerId: ProviderId
    ): boolean {

        return this.providers.has(
            providerId.value
        );

    }

    public getProvider(
        providerId: ProviderId
    ): IAiProvider | undefined {

        return this.providers.get(
            providerId.value
        );

    }

    public getProviderInfo(): ProviderInfo[] {

        return Array.from(
            this.providers.values()
        ).map(
            p => ({

                id: p.id.value,

                name: p.name,

                isActive: false,

                isAvailable: p.isAvailable(),

                health: p.getHealth().status,

                priority: this.getPriority(p),

                capabilities: p.capabilities

            })
        );

    }

    private sortByPriority(
        providers: IAiProvider[]
    ): IAiProvider[] {

        return [...providers].sort(
            (a, b) => {

                const ah = a.getHealth();

                const bh = b.getHealth();

                if (
                    ah.isUnhealthy() &&
                    !bh.isUnhealthy()
                ) {

                    return 1;

                }

                if (
                    !ah.isUnhealthy() &&
                    bh.isUnhealthy()
                ) {

                    return -1;

                }

                const ap = ah.isDegraded() ? 1 : 0;

                const bp = bh.isDegraded() ? 1 : 0;

                if (ap !== bp) {

                    return ap - bp;

                }

                const priorityA = this.getPriority(a);

                const priorityB = this.getPriority(b);

                return priorityA - priorityB;

            }
        );

    }

    private roundRobinSelect(
        providers: IAiProvider[]
    ): IAiProvider {

        if (providers.length === 0) {

            throw new Error(
                "Cannot select from empty provider list."
            );

        }

        const selected =
            providers[
                this.roundRobinIndex % providers.length
            ];

        this.roundRobinIndex =
            (this.roundRobinIndex + 1) %
            providers.length;

        return selected;

    }

    private weightedSelect(
        providers: IAiProvider[]
    ): IAiProvider | null {

        const available =
            providers.filter(
                p => p.isAvailable()
            );

        if (available.length === 0) {

            return null;

        }

        if (available.length === 1) {

            return available[0];

        }

        // Weighted selection based on priority
        const totalWeight =
            available.reduce(
                (sum, p) =>
                    sum + (p.getHealth().isDegraded()
                        ? 0.5
                        : 1),
                0
            );

        let r = Math.random() * totalWeight;

        for (const provider of available) {

            const weight =
                provider.getHealth().isDegraded()
                ? 0.5
                : 1;

            r -= weight;

            if (r <= 0) {

                return provider;

            }

        }

        return available[available.length - 1];

    }

}
