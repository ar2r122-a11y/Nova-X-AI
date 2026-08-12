import { ICommandHandler } from "@nova-x-ai/core";
import type { IEventBus } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import { ScheduleVoiceTaskCommand } from "../Commands/ScheduleVoiceTaskCommand";

export class ScheduleVoiceTaskCommandHandler implements ICommandHandler<ScheduleVoiceTaskCommand> {
    constructor(
        private readonly voiceEngine: IVoiceEngine,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: ScheduleVoiceTaskCommand): Promise<void> {
        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.voiceEngine.scheduleVoiceTask(command);
    }
}
