import { ICommand } from "@nova-x-ai/core";

export class CancelStreamCommand implements ICommand {
    constructor(
        public readonly voiceId: string,
        public readonly streamId: string,
        public readonly correlationId: string = `cancel-${Date.now()}`,
        public readonly causationId: string = "",
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
