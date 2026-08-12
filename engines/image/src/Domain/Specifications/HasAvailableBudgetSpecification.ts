
import { ResourceBudget } from "../ValueObjects/ResourceBudget";

export class HasAvailableBudgetSpecification {
    public isSatisfiedBy(budget: ResourceBudget): boolean {
        return !budget.isExhausted();
    }
}
