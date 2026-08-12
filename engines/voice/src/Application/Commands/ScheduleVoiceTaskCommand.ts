import { ICommand } from "@nova-x-ai/core";

export class ScheduleVoiceTaskCommand implements ICommand {
    constructor(
        public readonly voiceId: string,
        public readonly text: string,
        public readonly profileId: string,
        public readonly scheduledAt: number,
        public readonly priority: number,
        public readonly maxRetries: number,
        public readonly correlationId: string = `schedule-${Date.now()}`,
        public readonly causationId: string = "",
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
