import { TokenCount } from "../ValueObjects/TokenCount";
import { ConversationAggregate } from "../Aggregates/ConversationAggregate";

export interface IConversationDomainService {
    assembleAIContext(
        aggregate: ConversationAggregate,
        systemPrompt?: string
    ): Promise<{
        readonly systemPrompt: string;
        readonly messages: { role: string; content: string }[];
        readonly languageCode: string;
        readonly totalTokens: TokenCount;
    }>;
    evaluateTurn(
        aggregate: ConversationAggregate
    ): Promise<{ shouldProceed: boolean; latencyMs: number }>;
    compressConversation(
        aggregate: ConversationAggregate
    ): Promise<string | undefined>;
}

export class ConversationDomainService implements IConversationDomainService {
    private readonly contextBuilder: import("./ContextBuilder").IContextBuilder;
    private readonly languageDetector: import("./LanguageDetector").ILanguageDetector;
    private readonly summarizer: import("./ConversationSummarizer").IConversationSummarizer;

    public constructor(
        contextBuilder: import("./ContextBuilder").IContextBuilder,
        languageDetector: import("./LanguageDetector").ILanguageDetector,
        summarizer: import("./ConversationSummarizer").IConversationSummarizer
    ) {
        this.contextBuilder = contextBuilder;
        this.languageDetector = languageDetector;
        this.summarizer = summarizer;
    }

    public async assembleAIContext(
        aggregate: ConversationAggregate,
        systemPrompt?: string
    ): Promise<{
        readonly systemPrompt: string;
        readonly messages: { role: string; content: string }[];
        readonly languageCode: string;
        readonly totalTokens: TokenCount;
    }> {
        const messages = aggregate.getMessages();
        const context = this.contextBuilder.buildPromptContext(messages, systemPrompt);

        const languageCode = messages.length > 0
            ? this.languageDetector.detect(messages[messages.length - 1].getContent())
            : this.languageDetector.detect("");

        return {
            systemPrompt: context.systemPrompt,
            messages: context.messages,
            languageCode: languageCode.getValue(),
            totalTokens: context.totalTokens
        };
    }

    public async evaluateTurn(_aggregate: ConversationAggregate): Promise<{ shouldProceed: boolean; latencyMs: number }> {
        return {
            shouldProceed: true,
            latencyMs: 0
        };
    }

    public async compressConversation(aggregate: ConversationAggregate): Promise<string | undefined> {
        const messages = aggregate.getMessages();
        if (messages.length <= 2) {
            return undefined;
        }
        return this.summarizer.summarize(messages.map(m => ({ content: m.getContent(), role: m.getRole().getValue() })));
    }
}
