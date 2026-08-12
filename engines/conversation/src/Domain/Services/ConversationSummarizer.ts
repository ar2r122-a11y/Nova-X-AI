export interface IConversationSummarizer {
    summarize(messages: { content: string; role: string }[]): Promise<string>;
}

export class ConversationSummarizer implements IConversationSummarizer {
    public async summarize(messages: { content: string; role: string }[]): Promise<string> {
        if (messages.length === 0) {
            return "";
        }
        const parts = messages.map(m => `[${m.role}] ${m.content}`).join("\n");
        if (parts.length <= 500) {
            return parts;
        }
        return parts.slice(0, 500) + "...[truncated]";
    }
}
