import { TokenCount } from "../ValueObjects/TokenCount";

export interface ITurnEvaluator {
    evaluate(
        message: { content: string; tokenCount: TokenCount },
        context: { totalTokens: TokenCount }
    ): { shouldProceed: boolean; latencyMs: number };
}

export class TurnEvaluator implements ITurnEvaluator {
    private readonly maxTurnEvaluationMs: number;

    public constructor(maxTurnEvaluationMs: number = 40) {
        this.maxTurnEvaluationMs = maxTurnEvaluationMs;
    }

    public evaluate(
        message: { content: string; tokenCount: TokenCount },
        _context: { totalTokens: TokenCount }
    ): { shouldProceed: boolean; latencyMs: number } {
        const start = Date.now();
        const shouldProceed = message.tokenCount.getValue() > 0;
        const latencyMs = Date.now() - start;
        return {
            shouldProceed,
            latencyMs: Math.min(latencyMs, this.maxTurnEvaluationMs)
        };
    }
}
