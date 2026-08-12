import { ICommand } from "@nova-x-ai/core";

export class ResumeCommand implements ICommand {
    constructor(
        public readonly voiceId: string,
        public readonly correlationId: string = `resume-${Date.now()}`,
        public readonly causationId: string = "",
        public readonly claims: { roles: string[]; permissions: string[] } = { roles: [], permissions: [] }
    ) {}
}
