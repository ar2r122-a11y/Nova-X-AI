import { ICommand } from "@nova-x-ai/core";

export class GenerateThumbnailsCommand implements ICommand {
    constructor(
        public readonly imageId: string,
        public readonly sizes: string[],
        public readonly requesterId: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
