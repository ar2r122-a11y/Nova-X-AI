import { ICommand } from "@nova-x-ai/core";
import { ICompleteStoryCommand } from "../../Contracts/IStoryEngine";

export class CompleteStoryCommand implements ICommand, ICompleteStoryCommand {
    constructor(
        public readonly storyId: string,
        public readonly endingId: string,
        public readonly claims: { roles: string[] }
    ) {}
}
