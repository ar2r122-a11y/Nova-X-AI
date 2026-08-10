import type { IEventBus } from "@nova-x-ai/core";
import { ProcessEmotionalStimulusCommand } from "../Commands/ProcessEmotionalStimulusCommand";
import { EmotionalSnapshotDto } from "../DTO/EmotionalSnapshotDto";
import { MoodInertiaPolicy } from "../../Domain/Policies/MoodInertiaPolicy";
import { EmotionAggregateFactory } from "../../Domain/Factories/EmotionAggregateFactory";
import { EmotionalStimulus } from "../../Domain/ValueObjects/EmotionalStimulus";
import type { IEmotionRepository } from "../../Domain/Repositories/IEmotionRepository";

export class ProcessEmotionalStimulusCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly repository: IEmotionRepository
    ) {}

    async handle(command: ProcessEmotionalStimulusCommand): Promise<EmotionalSnapshotDto> {
        let aggregate = await this.repository.findByCharacterId(command.characterId);
        if (!aggregate) {
            aggregate = EmotionAggregateFactory.create(command.characterId);
            await this.repository.save(aggregate);
        }

        const stimulus = EmotionalStimulus.create({
            ...command.stimulus,
            stimulusType: command.stimulus.stimulusType as any
        });

        if (!MoodInertiaPolicy.canTransition(aggregate.getCurrentMood(), stimulus, command.sensitivity)) {
            return EmotionalSnapshotDto.fromAggregate(aggregate);
        }

        aggregate.applyStimulus(stimulus, command.sensitivity);
        await this.repository.save(aggregate);

        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();

        return EmotionalSnapshotDto.fromAggregate(aggregate);
    }
}
