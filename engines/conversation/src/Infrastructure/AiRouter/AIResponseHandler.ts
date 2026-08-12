export interface IAIResponseHandler {
    handleResponse(
        content: string,
        _model: string,
        usage: { promptTokens: number; completionTokens: number; totalTokens: number },
        _finishReason: string
    ): Promise<{ content: string; tokenCount: number }>;
}

export class AIResponseHandler implements IAIResponseHandler {
    public async handleResponse(
        content: string,
        _model: string,
        usage: { promptTokens: number; completionTokens: number; totalTokens: number },
        _finishReason: string
    ): Promise<{ content: string; tokenCount: number }> {
        return {
            content,
            tokenCount: usage.completionTokens
        };
    }
}
