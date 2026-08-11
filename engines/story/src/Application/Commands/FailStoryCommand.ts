import { ICommand } from "@nova-x-ai/core";
import { IFailStoryCommand } from "../../Contracts/IStoryEngine";

export class FailStoryCommand implements ICommand, IFailStoryCommand {
    constructor(
        public readonly storyId: string,
        public readonly reason: string,
        public readonly claims: { roles: string[] }
    ) {}
}
