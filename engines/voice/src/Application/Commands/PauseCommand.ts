import { ICommand } from "@nova-x-ai/core";

export class PauseCommand implements ICommand {
    constructor(
        public readonly voiceId: string,
        public readonly correlationId: string = `pause-${Date.now()}`,
        public readonly causationId: string = "",
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
