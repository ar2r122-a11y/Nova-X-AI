
import { ImageId } from "../../Domain/ValueObjects/ImageId";
import { ImageAggregateFactory } from "../../Domain/Aggregates/ImageAggregateFactory";
import { ImageNotFoundException } from "../../Domain/Exceptions/ImageExceptions";
import type { IImageRepository } from "../../Contracts/IImageRepository";
import { GenerateImageCommand } from "../Commands/GenerateImageCommand";
import { SelectCandidateCommand } from "../Commands/SelectCandidateCommand";
import { CompilePromptCommand } from "../Commands/CompilePromptCommand";

export class GenerateImageCommandHandler {
    constructor(private readonly repository: IImageRepository) {}

    async handle(command: GenerateImageCommand): Promise<void> {
        const imageId = ImageId.fromString(command.sessionId);
        const existing = await this.repository.findById(imageId.getValue());
        const aggregate = existing ?? ImageAggregateFactory.createFromTemplate({
            imageId: command.sessionId,
            sessionId: command.sessionId,
            ownerId: command.ownerId,
            prompt: command.prompt,
            negativePrompt: command.negativePrompt,
            mode: command.mode,
            aspectRatio: command.aspectRatio
        });
        await this.repository.save(aggregate);
    }
}

export class SelectCandidateCommandHandler {
    constructor(private readonly repository: IImageRepository) {}

    async handle(command: SelectCandidateCommand): Promise<void> {
        const imageId = ImageId.fromString(command.imageId);
        const aggregate = await this.repository.findById(imageId.getValue());
        if (!aggregate) {
            throw new ImageNotFoundException(command.imageId);
        }
        aggregate.setSelectedCandidateId(command.candidateId);
        await this.repository.save(aggregate);
    }
}

export class CompilePromptCommandHandler {
    constructor(private readonly repository: IImageRepository) {}

    async handle(command: CompilePromptCommand): Promise<void> {
        const imageId = ImageId.fromString(command.imageId);
        const aggregate = await this.repository.findById(imageId.getValue());
        if (!aggregate) {
            throw new ImageNotFoundException(command.imageId);
        }
        await this.repository.save(aggregate);
    }
}
