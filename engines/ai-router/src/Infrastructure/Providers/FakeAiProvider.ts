import type { IAiProvider, PromptRequest, PromptResult, StreamChunk } from "../../Domain/Services/IAiProvider";
import { ProviderId } from "../../Domain/ValueObjects/ProviderId";
import { ProviderHealth, ProviderHealthStatus } from "../../Domain/ValueObjects/ProviderHealth";
import { TokenBudget } from "../../Domain/ValueObjects/TokenBudget";

export class FakeAiProvider implements IAiProvider {
    readonly id = new ProviderId("fake");
    readonly name = "Fake AI Provider";
    readonly capabilities = {
        supportsStreaming: true,
        supportsTools: false,
        maxContextTokens: 4096,
        supportedModels: ["fake-model"]
    };

    isAvailable(): boolean {
        return true;
    }

    getHealth(): ProviderHealth {
        return new ProviderHealth(ProviderHealthStatus.Healthy);
    }

    async executePrompt(request: PromptRequest): Promise<PromptResult> {
        const responseText = this.buildResponse(request.prompt);
        return {
            content: responseText,
            model: request.model,
            providerId: this.id.value,
            usage: {
                promptTokens: Math.ceil(request.prompt.length / 4),
                completionTokens: Math.ceil(responseText.length / 4),
                totalTokens: Math.ceil((request.prompt.length + responseText.length) / 4)
            },
            finishReason: "stop",
            latencyMs: 10
        };
    }

    async *executePromptStream(request: PromptRequest): AsyncIterable<StreamChunk> {
        const responseText = this.buildResponse(request.prompt);
        const words = responseText.split(" ");
        for (let i = 0; i < words.length; i++) {
            yield {
                content: words.slice(0, i + 1).join(" "),
                delta: i === 0 ? words[0] : " " + words[i],
                isLast: i === words.length - 1,
                model: request.model,
                usage: {
                    promptTokens: Math.ceil(request.prompt.length / 4),
                    completionTokens: Math.ceil(responseText.length / 4),
                    totalTokens: Math.ceil((request.prompt.length + responseText.length) / 4)
                }
            };
            await new Promise((resolve) => setTimeout(resolve, 30));
        }
    }

    markHealthy(): void {}
    markUnhealthy(_error: string): void {}
    getBudget(): TokenBudget {
        return new TokenBudget(4096);
    }

    private buildResponse(prompt: string): string {
        return `Echo: ${prompt}`;
    }
}
