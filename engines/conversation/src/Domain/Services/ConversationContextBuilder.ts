export interface IConversationContextBuilder {
    buildContext(characterId: string): Promise<{
        readonly memoryContext?: string;
        readonly emotionContext?: string;
        readonly relationshipContext?: string;
        readonly worldContext?: string;
        readonly storyContext?: string;
    }>;
}

export class DefaultConversationContextBuilder implements IConversationContextBuilder {
    async buildContext(_characterId: string) {
        return {};
    }
}
