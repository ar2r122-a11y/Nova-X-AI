import { ICommand } from "@nova-x-ai/core";

export class DeleteImageCommand implements ICommand {
    constructor(
        public readonly imageId: string,
        public readonly requesterId: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
