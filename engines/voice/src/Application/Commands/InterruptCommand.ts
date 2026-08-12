import { ICommand } from "@nova-x-ai/core";

export class InterruptCommand implements ICommand {
    constructor(
        public readonly voiceId: string,
        public readonly requestId: string,
        public readonly reason: string,
        public readonly correlationId: string = `interrupt-${Date.now()}`,
        public readonly causationId: string = "",
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
