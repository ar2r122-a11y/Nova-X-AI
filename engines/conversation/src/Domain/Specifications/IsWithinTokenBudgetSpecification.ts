import { TokenCount } from "../ValueObjects/TokenCount";

export class IsWithinTokenBudgetSpecification {
    private readonly budget: TokenCount;

    public constructor(budget: TokenCount) {
        this.budget = budget;
    }

    public static isSatisfiedBy(used: TokenCount, budget: TokenCount): boolean {
        return used.isLessThanOrEqual(budget);
    }

    public isSatisfied(used: TokenCount): boolean {
        return IsWithinTokenBudgetSpecification.isSatisfiedBy(used, this.budget);
    }
}
