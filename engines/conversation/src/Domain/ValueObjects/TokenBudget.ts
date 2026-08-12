/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: TokenBudget
 */

import { TokenCount } from "./TokenCount";

export class TokenBudget {
    private readonly totalBudget: TokenCount;
    private readonly systemAllocation: TokenCount;
    private readonly responseBuffer: TokenCount;
    private readonly contextWindow: TokenCount;

    private constructor(
        totalBudget: TokenCount,
        systemAllocation: TokenCount,
        responseBuffer: TokenCount,
        contextWindow: TokenCount
    ) {
        this.totalBudget = totalBudget;
        this.systemAllocation = systemAllocation;
        this.responseBuffer = responseBuffer;
        this.contextWindow = contextWindow;
    }

    public static create(
        totalBudget: TokenCount,
        systemAllocation: TokenCount,
        responseBuffer: TokenCount
    ): TokenBudget {
        if (systemAllocation.add(responseBuffer).isGreaterThan(totalBudget)) {
            throw new Error("System allocation plus response buffer exceeds total budget.");
        }
        return new TokenBudget(
            totalBudget,
            systemAllocation,
            responseBuffer,
            totalBudget.subtract(systemAllocation).subtract(responseBuffer)
        );
    }

    public static default(): TokenBudget {
        return TokenBudget.create(
            TokenCount.create(4096),
            TokenCount.create(1024),
            TokenCount.create(2048)
        );
    }

    public getTotalBudget(): TokenCount {
        return this.totalBudget;
    }

    public getSystemAllocation(): TokenCount {
        return this.systemAllocation;
    }

    public getResponseBuffer(): TokenCount {
        return this.responseBuffer;
    }

    public getContextWindow(): TokenCount {
        return this.contextWindow;
    }

    public canAccommodate(required: TokenCount): boolean {
        return this.contextWindow.isGreaterThanOrEqual(required);
    }
}
