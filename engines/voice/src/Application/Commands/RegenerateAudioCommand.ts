import { ICommand } from "@nova-x-ai/core";

export class RegenerateAudioCommand implements ICommand {
    constructor(
        public readonly voiceId: string,
        public readonly requestId: string,
        public readonly text: string,
        public readonly voiceProfileId: string,
        public readonly providerId?: string,
        public readonly correlationId: string = `regen-${Date.now()}`,
        public readonly causationId: string = "",
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
