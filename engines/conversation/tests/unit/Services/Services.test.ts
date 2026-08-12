import { describe, it, expect } from "vitest";
import { ContextBuilder } from "../../../src/Domain/Services/ContextBuilder";
import { TurnEvaluator } from "../../../src/Domain/Services/TurnEvaluator";
import { LanguageDetector } from "../../../src/Domain/Services/LanguageDetector";
import { TokenBudgetAllocator } from "../../../src/Domain/Services/TokenBudgetAllocator";
import { ConversationSummarizer } from "../../../src/Domain/Services/ConversationSummarizer";
import { TokenCount } from "../../../src/Domain/ValueObjects/TokenCount";
import { TokenBudget } from "../../../src/Domain/ValueObjects/TokenBudget";
import { MessageRole } from "../../../src/Domain/ValueObjects/MessageRole";
import { Message } from "../../../src/Domain/Entities/Message";
import { MessageId } from "../../../src/Domain/ValueObjects/MessageId";

describe("Services", () => {
    it("ContextBuilder should build prompt context within budget", () => {
        const builder = new ContextBuilder({ maxContextTokens: 100 });
        const messages = [
            Message.create(MessageId.create("msg-1"), MessageRole.user(), "Hello", TokenCount.create(10)),
            Message.create(MessageId.create("msg-2"), MessageRole.assistant(), "Hi there", TokenCount.create(10))
        ];
        const context = builder.buildPromptContext(messages, "You are helpful.");
        expect(context.messages.length).toBe(2);
        expect(context.systemPrompt).toBe("You are helpful.");
    });

    it("TurnEvaluator should evaluate within budget", () => {
        const evaluator = new TurnEvaluator(40);
        const result = evaluator.evaluate({ content: "test", tokenCount: TokenCount.create(10) }, { totalTokens: TokenCount.create(0) });
        expect(result.shouldProceed).toBe(true);
        expect(result.latencyMs).toBeLessThanOrEqual(40);
    });

    it("LanguageDetector should detect English", () => {
        const detector = new LanguageDetector();
        expect(detector.detect("Hello world").getValue()).toBe("en");
    });

    it("LanguageDetector should detect Arabic", () => {
        const detector = new LanguageDetector();
        expect(detector.detect("مرحبا").getValue()).toBe("ar");
    });

    it("LanguageDetector should detect mixed language", () => {
        const detector = new LanguageDetector();
        expect(detector.detect("Hello مرحبا").getValue()).toBe("mixed");
    });

    it("TokenBudgetAllocator should allocate budget", () => {
        const budget = TokenBudget.create(TokenCount.create(4096), TokenCount.create(1024), TokenCount.create(2048));
        const allocator = new TokenBudgetAllocator();
        const allocation = allocator.allocate(budget, TokenCount.create(500));
        expect(allocation.system.getValue()).toBe(1024);
        expect(allocation.response.getValue()).toBe(2048);
    });

    it("ConversationSummarizer should summarize messages", async () => {
        const summarizer = new ConversationSummarizer();
        const result = await summarizer.summarize([{ content: "Hello", role: "user" }, { content: "Hi", role: "assistant" }]);
        expect(result).toContain("Hello");
        expect(result).toContain("Hi");
    });

    it("ConversationSummarizer should truncate long summaries", async () => {
        const summarizer = new ConversationSummarizer();
        const longMessages = Array.from({ length: 100 }, (_, i) => ({ content: `Message ${i}`, role: "user" }));
        const result = await summarizer.summarize(longMessages);
        expect(result.length).toBeLessThanOrEqual(500 + "...[truncated]".length);
    });
});
