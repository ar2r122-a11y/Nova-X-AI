import type { IDomainEvent } from "@nova-x-ai/core";
import { PromptContextDto } from "../../../DTO/AI/PromptContextDto";

export interface IAIRouterAdapter {
    generateNarrative(context: PromptContextDto): Promise<string>;
    generateStructuredResponse<T extends Record<string, unknown>>(
        context: PromptContextDto,
        schema: object
    ): Promise<T>;
}

export class AIRouterAdapter implements IAIRouterAdapter {
    private readonly aiRouterEndpoint: string;
    private readonly defaultHeaders: Record<string, string>;

    constructor(endpoint: string, defaultHeaders: Record<string, string> = {}) {
        this.aiRouterEndpoint = endpoint;
        this.defaultHeaders = defaultHeaders;
    }

    async generateNarrative(context: PromptContextDto): Promise<string> {
        const response = await this.invokeAIRouter("/narrative/generate", {
            promptContext: this.toAIRouterFormat(context),
        });
        return response.narrative as string;
    }

    async generateStructuredResponse<T extends Record<string, unknown>>(
        context: PromptContextDto,
        schema: object
    ): Promise<T> {
        const response = await this.invokeAIRouter("/structured/generate", {
            promptContext: this.toAIRouterFormat(context),
            schema,
        });
        return response.data as T;
    }

    private toAIRouterFormat(context: PromptContextDto): Record<string, unknown> {
        return {
            storyId: context.storyId,
            activeScene: context.activeScene,
            participants: context.participants,
            recentNarrativeLedgerEntries: context.recentNarrativeLedgerEntries,
            activeNarrativeVariables: context.activeNarrativeVariables,
        };
    }

    private async invokeAIRouter(path: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
        const response = await fetch(`${this.aiRouterEndpoint}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...this.defaultHeaders,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`AI Router responded with status: ${response.status}`);
        }

        return response.json();
    }
}
