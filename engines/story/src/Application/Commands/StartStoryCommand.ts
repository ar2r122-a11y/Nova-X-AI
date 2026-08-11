import { ICommand } from "@nova-x-ai/core";
import { IStartStoryCommand } from "../../Contracts/IStoryEngine";

export class StartStoryCommand implements ICommand, IStartStoryCommand {
    constructor(
        public readonly storyId: string,
        public readonly title: string,
        public readonly description: string,
        public readonly claims: { roles: string[] }
    ) {}
}
