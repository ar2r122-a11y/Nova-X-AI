import { ImageId } from "../ValueObjects/ImageId";
import { ResourceBudget } from "../ValueObjects/ResourceBudget";
import { ImageDimensions } from "../ValueObjects/ImageDimensions";
import { ImageEngineException } from "../Exceptions/ImageEngineException";
import { ResourceBudgetExhaustedException } from "../Exceptions/ResourceBudgetExhaustedException";
import { InvalidDimensionException } from "../Exceptions/InvalidDimensionException";

export class ImageDomainService {
    public validateGenerationRequest(params: {
        imageId: ImageId;
        prompt: string;
        dimensions: ImageDimensions;
        budget: ResourceBudget;
        generationType: string;
    }): void {
        if (!params.prompt || params.prompt.trim().length === 0) {
            throw new ImageEngineException("Prompt cannot be empty.");
        }
        if (params.prompt.length > 10000) {
            throw new ImageEngineException("Prompt exceeds maximum length of 10000 characters.");
        }
        const maxResolution = params.budget.getMaxResolution();
        if (params.dimensions.getWidth() > maxResolution || params.dimensions.getHeight() > maxResolution) {
            throw new InvalidDimensionException(`Dimensions exceed max resolution ${maxResolution}.`);
        }
        if (params.budget.isExhausted()) {
            throw new ResourceBudgetExhaustedException("budget");
        }
    }

    public allocateResources(budget: ResourceBudget, vram: number, memory: number, timeMs: number): ResourceBudget {
        budget.consume(vram, memory, timeMs);
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
        return budget;
    }

    public releaseResources(budget: ResourceBudget): void {
        budget.consume(0, 0, 0);
    }
}
