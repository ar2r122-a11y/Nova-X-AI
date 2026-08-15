/**
 * Nova X AI
 * AI Router
 * Infrastructure: OpenRouterAiProvider
 *
 * Adapter over OpenRouter's OpenAI-compatible Chat Completions API
 * (https://openrouter.ai/api/v1/chat/completions).
 *
 * Implements the existing IAiProvider contract so it can be registered
 * with the AI Router transparently. The API key is read from the
 * OPENROUTER_API_KEY environment variable (or injected via config) and
 * is never hard-coded. The model is configurable per-provider so it can
 * be changed without touching the rest of the application.
 */
import type {
    IAiProvider,
    PromptRequest,
    PromptResult,
    ProviderCapabilities,
    PromptTokenUsage,
    StreamChunk
} from "../../Domain/Services/IAiProvider";
import { ProviderId } from "../../Domain/ValueObjects/ProviderId";
import { ProviderHealth, ProviderHealthStatus } from "../../Domain/ValueObjects/ProviderHealth";
import { TokenBudget } from "../../Domain/ValueObjects/TokenBudget";

export interface OpenRouterProviderConfig {

    readonly apiKey?: string;

    readonly model?: string;

    readonly baseUrl?: string;

    readonly httpReferer?: string;

    readonly appTitle?: string;

    readonly serverEndpoint?: string;

}

interface OpenRouterMessage {

    readonly role: "system" | "user" | "assistant" | "tool";

    readonly content: string;

}

interface OpenRouterUsage {

    readonly prompt_tokens?: number;

    readonly completion_tokens?: number;

    readonly total_tokens?: number;

}

interface OpenRouterChoice {

    readonly delta?: { content?: string };

    readonly message?: { content?: string };

    readonly finish_reason?: string | null;

}

interface OpenRouterResponseShape {

    readonly model?: string;

    readonly choices?: readonly OpenRouterChoice[];

    readonly usage?: OpenRouterUsage;

}

export class OpenRouterAiProvider implements IAiProvider {

    readonly id: ProviderId;

    readonly name: string;

    readonly capabilities: ProviderCapabilities;

    private readonly config: {
        readonly apiKey: string;
        readonly model: string;
        readonly baseUrl: string;
        readonly httpReferer: string;
        readonly appTitle: string;
        readonly serverEndpoint?: string;
    };

    private health: ProviderHealth;

    constructor(config: OpenRouterProviderConfig = {}) {

        this.id = new ProviderId("openrouter");

        this.name = "OpenRouter AI Provider";

        const model = config.model ?? "openrouter/free";

        const serverEndpoint = config.serverEndpoint;

        this.config = {
            apiKey: config.apiKey ?? OpenRouterAiProvider.readEnvKey(),
            model,
            baseUrl: config.baseUrl ?? (serverEndpoint ? serverEndpoint : "https://openrouter.ai/api/v1/chat/completions"),
            httpReferer: config.httpReferer ?? "http://localhost:5173",
            appTitle: config.appTitle ?? "Nova X AI",
            serverEndpoint
        };

        this.capabilities = {
            supportsStreaming: true,
            supportsTools: false,
            maxContextTokens: 8192,
            supportedModels: [model]
        };

        this.health = new ProviderHealth(ProviderHealthStatus.Healthy);

    }

    isAvailable(): boolean {

        if (this.config.serverEndpoint) {

            return true;

        }

        return !!this.config.apiKey && this.config.apiKey.length > 0;

    }

    getHealth(): ProviderHealth {

        return this.health;

    }

    markHealthy(): void {

        this.health = this.health.recordSuccess();

    }

    markUnhealthy(error: string): void {

        this.health = this.health.recordFailure(error);

    }

    getBudget(): TokenBudget {

        return new TokenBudget(4096);

    }

    async executePrompt(request: PromptRequest): Promise<PromptResult> {

        if (this.config.serverEndpoint) {

            return this.executeViaServer(request);

        }

        const apiKey = this.config.apiKey;

        if (!apiKey || apiKey.length === 0) {

            throw new Error("OpenRouter API key is not configured.");

        }

        const model = this.modelFor(request);

        const messages = this.buildMessages(request);

        const startedAt = Date.now();

        const response = await fetch(this.config.baseUrl, {
            method: "POST",
            headers: this.buildHeaders(apiKey),
            body: JSON.stringify({
                model,
                messages,
                max_tokens: request.maxTokens,
                temperature: request.temperature,
                stream: false
            })
        });

        if (!response.ok) {

            const detail = await OpenRouterAiProvider.safeText(response);

            throw new Error(
                `OpenRouter request failed: ${response.status} ${response.statusText}${detail ? ` — ${detail}` : ""}`
            );

        }

        const json = (await response.json()) as OpenRouterResponseShape;

        const choice = json.choices?.[0];

        const content = choice?.message?.content ?? "";

        return {
            content,
            model: json.model ?? model,
            providerId: this.id.value,
            usage: json.usage ? this.toUsage(json.usage) : this.estimateUsage(request, content),
            finishReason: choice?.finish_reason ?? "stop",
            latencyMs: Date.now() - startedAt
        };

    }

    async *executePromptStream(request: PromptRequest): AsyncIterable<StreamChunk> {

        if (this.config.serverEndpoint) {

            const result = await this.executeViaServer(request);

            yield {

                content: result.content,

                delta: result.content,

                isLast: true,

                model: result.model,

                usage: result.usage

            };

            return;

        }

        const apiKey = this.config.apiKey;

        if (!apiKey || apiKey.length === 0) {

            throw new Error("OpenRouter API key is not configured.");

        }

        const model = this.modelFor(request);

        const messages = this.buildMessages(request);

        const response = await fetch(this.config.baseUrl, {
            method: "POST",
            headers: this.buildHeaders(apiKey),
            body: JSON.stringify({
                model,
                messages,
                max_tokens: request.maxTokens,
                temperature: request.temperature,
                stream: true
            })
        });

        if (!response.ok) {

            const detail = await OpenRouterAiProvider.safeText(response);

            throw new Error(
                `OpenRouter request failed: ${response.status} ${response.statusText}${detail ? ` — ${detail}` : ""}`
            );

        }

        const reader = response.body?.getReader();

        if (!reader) {

            throw new Error("OpenRouter streaming response provided no body reader.");

        }

        const decoder = new TextDecoder();

        let buffer = "";

        let accumulated = "";

        let finishReason = "stop";

        let usage: PromptTokenUsage | undefined;

        try {

            for (; ;) {

                const { done, value } = await reader.read();

                if (done) {

                    break;

                }

                buffer += decoder.decode(value, { stream: true });

                let newline: number;

                while ((newline = buffer.indexOf("\n")) >= 0) {

                    const line = buffer.slice(0, newline);

                    buffer = buffer.slice(newline + 1);

                    const trimmed = line.trim();

                    if (!trimmed.startsWith("data:")) {

                        continue;

                    }

                    const data = trimmed.slice("data:".length).trim();

                    if (data === "[DONE]" || data === "") {

                        yield this.makeChunk(accumulated, "", true, model, usage);

                        return;

                    }

                    const parsed = this.parseSseData(data);

                    if (parsed == null) {

                        continue;

                    }

                    const delta = parsed.choices?.[0]?.delta?.content;

                    if (delta) {

                        accumulated += delta;

                        yield this.makeChunk(accumulated, delta, false, model, usage);

                    }

                    const fr = parsed.choices?.[0]?.finish_reason;

                    if (fr) {

                        finishReason = fr;

                    }

                    if (parsed.usage) {

                        usage = this.toUsage(parsed.usage);

                    }

                }

            }

            buffer += decoder.decode();

            const flushed = buffer.trim();

            if (flushed.startsWith("data:")) {

                const data = flushed.slice("data:".length).trim();

                if (data !== "[DONE]" && data !== "") {

                    const parsed = this.parseSseData(data);

                    if (parsed) {

                        const delta = parsed.choices?.[0]?.delta?.content;

                        if (delta) {

                            accumulated += delta;

                            yield this.makeChunk(accumulated, delta, false, model, usage);

                        }

                    }

                }

            }

            yield this.makeChunk(accumulated, "", true, model, usage, finishReason);

        } finally {

            reader.releaseLock();

        }

    }

    private static readEnvKey(): string {

        if (typeof process === "undefined" || !process.env) {

            return "";

        }

        return process.env.OPENROUTER_API_KEY ?? "";

    }

    private async executeViaServer(request: PromptRequest): Promise<PromptResult> {

        const startedAt = Date.now();

        const response = await fetch(this.config.serverEndpoint!, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: this.buildMessages(request),
                model: this.modelFor(request),
                max_tokens: request.maxTokens,
                temperature: request.temperature
            })
        });

        if (!response.ok) {

            const detail = await OpenRouterAiProvider.safeText(response);

            throw new Error(
                `Server endpoint failed: ${response.status} ${response.statusText}${detail ? ` — ${detail}` : ""}`
            );

        }

        const json = (await response.json()) as OpenRouterResponseShape;

        const choice = json.choices?.[0];

        const content = choice?.message?.content ?? "";

        return {
            content,
            model: json.model ?? this.modelFor(request),
            providerId: this.id.value,
            usage: json.usage ? this.toUsage(json.usage) : this.estimateUsage(request, content),
            finishReason: choice?.finish_reason ?? "stop",
            latencyMs: Date.now() - startedAt
        };

    }

    private modelFor(_request: PromptRequest): string {

        return this.config.model;

    }

    private buildMessages(request: PromptRequest): OpenRouterMessage[] {

        const messages: OpenRouterMessage[] = [];

        const contextBlocks = [
            request.context?.memoryContext,
            request.context?.emotionContext,
            request.context?.relationshipContext,
            request.context?.worldContext,
            request.context?.storyContext
        ].filter((block): block is string => Boolean(block));

        if (contextBlocks.length > 0) {
            messages.push({ role: "system", content: contextBlocks.join("\n\n") });
        }

        const systemPrompt = request.context?.systemPrompt;

        if (systemPrompt) {

            messages.push({ role: "system", content: systemPrompt });

        }

        const history = request.context?.conversationHistory ?? [];

        for (const message of history) {

            messages.push({
                role: this.mapRole(message.role),
                content: message.content
            });

        }

        messages.push({ role: "user", content: request.prompt });

        return messages;

    }

    private buildHeaders(apiKey: string): Record<string, string> {

        const headers: Record<string, string> = {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        };

        if (this.config.httpReferer) {

            headers["HTTP-Referer"] = this.config.httpReferer;

        }

        if (this.config.appTitle) {

            headers["X-Title"] = this.config.appTitle;

        }

        return headers;

    }

    private static async safeText(response: Response): Promise<string> {

        try {

            return await response.text();

        } catch {

            return "";

        }

    }

    private toUsage(usage: OpenRouterUsage): PromptTokenUsage {

        return {
            promptTokens: usage.prompt_tokens ?? 0,
            completionTokens: usage.completion_tokens ?? 0,
            totalTokens: usage.total_tokens ?? 0
        };

    }

    private estimateUsage(request: PromptRequest, content: string): PromptTokenUsage {

        const promptTokens = Math.ceil(request.prompt.length / 4);

        const completionTokens = Math.ceil(content.length / 4);

        return {
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens
        };

    }

    private makeChunk(
        accumulated: string,
        delta: string,
        isLast: boolean,
        model: string,
        usage: PromptTokenUsage | undefined,
        finishReason?: string
    ): StreamChunk {

        return {
            content: accumulated,
            delta,
            isLast,
            model,
            usage,
            ...(finishReason ? { finishReason } : {})
        };

    }

    private parseSseData(data: string): OpenRouterResponseShape | null {

        try {

            return JSON.parse(data) as OpenRouterResponseShape;

        } catch {

            return null;

        }

    }

    private mapRole(role: "system" | "user" | "assistant" | "tool"): "system" | "user" | "assistant" | "tool" {

        return role;

    }

}
