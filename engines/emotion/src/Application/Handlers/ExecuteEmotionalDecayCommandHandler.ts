import type { IEventBus } from "@nova-x-ai/core";
import { ExecuteEmotionalDecayCommand } from "../Commands/ExecuteEmotionalDecayCommand";
import { EmotionNotFoundException } from "../../Domain/Exceptions";
import type { IEmotionRepository } from "../../Domain/Repositories/IEmotionRepository";

export class ExecuteEmotionalDecayCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly repository: IEmotionRepository
    ) {}

    async handle(command: ExecuteEmotionalDecayCommand): Promise<void> {
        const aggregate = await this.repository.findByCharacterId(command.characterId);
        if (!aggregate) {
            throw new EmotionNotFoundException(command.characterId);
        }

        aggregate.processDecayTick(command.deltaTimeMs);
        await this.repository.save(aggregate);

        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();
    }
}
