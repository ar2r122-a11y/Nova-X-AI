import { ICommand } from "@nova-x-ai/core";

export class AdvancePlotCommand implements ICommand {
    constructor(
        public readonly storyId: string,
        public readonly claims: { roles: string[] }
    ) {}
}
