import { TokenCount } from "../ValueObjects/TokenCount";
import { TokenBudget } from "../ValueObjects/TokenBudget";

export interface ITokenBudgetAllocator {
    allocate(budget: TokenBudget, used: TokenCount): {
        readonly system: TokenCount;
        readonly context: TokenCount;
        readonly response: TokenCount;
    };
}

export class TokenBudgetAllocator implements ITokenBudgetAllocator {
    public allocate(budget: TokenBudget, used: TokenCount): {
        readonly system: TokenCount;
        readonly context: TokenCount;
        readonly response: TokenCount;
    } {
        const remaining = budget.getTotalBudget().getValue() - used.getValue();
        const contextTokens = Math.min(budget.getContextWindow().getValue(), remaining);
        return {
            system: budget.getSystemAllocation(),
            context: TokenCount.create(Math.max(0, contextTokens)),
            response: budget.getResponseBuffer()
        };
    }
}
