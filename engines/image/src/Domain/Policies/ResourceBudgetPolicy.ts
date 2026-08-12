
import { ResourceBudget } from "../ValueObjects/ResourceBudget";
import { ResourceBudgetExhaustedException } from "../Exceptions/ImageExceptions";

export class ResourceBudgetPolicy {
    enforce(budget: ResourceBudget): void {
        if (budget.isExhausted()) {
            if (budget.getRemainingVRAM() === 0) {
                throw new ResourceBudgetExhaustedException("VRAM");
            }
            if (budget.getRemainingMemory() === 0) {
                throw new ResourceBudgetExhaustedException("memory");
            }
            if (budget.getRemainingTimeMs() === 0) {
                throw new ResourceBudgetExhaustedException("time");
            }
        }
    }
}
