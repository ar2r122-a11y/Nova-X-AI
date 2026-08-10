import type { IEventBus } from "@nova-x-ai/core";
import { ResetEmotionalBaselineCommand } from "../Commands/ResetEmotionalBaselineCommand";
import { EmotionalSnapshotDto } from "../DTO/EmotionalSnapshotDto";
import { EmotionNotFoundException } from "../../Domain/Exceptions";
import type { IEmotionRepository } from "../../Domain/Repositories/IEmotionRepository";

export class ResetEmotionalBaselineCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly repository: IEmotionRepository
    ) {}

    async handle(command: ResetEmotionalBaselineCommand): Promise<EmotionalSnapshotDto> {
        const aggregate = await this.repository.findByCharacterId(command.characterId);
        if (!aggregate) {
            throw new EmotionNotFoundException(command.characterId);
        }

        aggregate.resetBaseline();
        await this.repository.save(aggregate);

        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();

        return EmotionalSnapshotDto.fromAggregate(aggregate);
    }
}
