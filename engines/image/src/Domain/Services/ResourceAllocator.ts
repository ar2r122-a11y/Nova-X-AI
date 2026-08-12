import { ResourceBudget } from "../ValueObjects/ResourceBudget";
import { ResourceBudgetExhaustedException } from "../Exceptions/ResourceBudgetExhaustedException";

export class ResourceAllocator {
    public allocate(budget: ResourceBudget, vram: number, memory: number, timeMs: number): boolean {
        if (budget.getRemainingVRAM() < vram) {
            throw new ResourceBudgetExhaustedException("VRAM");
        }
        if (budget.getRemainingMemory() < memory) {
            throw new ResourceBudgetExhaustedException("memory");
        }
        if (budget.getRemainingTimeMs() < timeMs) {
            throw new ResourceBudgetExhaustedException("time");
        }
        budget.consume(vram, memory, timeMs);
        return true;
    }

    public release(budget: ResourceBudget, vram: number, memory: number, timeMs: number): void {
        budget.consume(-vram, -memory, -timeMs);
    }

    public checkAvailability(budget: ResourceBudget, vram: number, memory: number, timeMs: number): boolean {
        return (
            budget.getRemainingVRAM() >= vram &&
            budget.getRemainingMemory() >= memory &&
            budget.getRemainingTimeMs() >= timeMs
        );
    }
}
