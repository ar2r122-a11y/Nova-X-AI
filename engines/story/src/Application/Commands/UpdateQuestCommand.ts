import { ICommand } from "@nova-x-ai/core";
import { IUpdateQuestCommand } from "../../Contracts/IStoryEngine";

export class UpdateQuestCommand implements ICommand, IUpdateQuestCommand {
    constructor(
        public readonly storyId: string,
        public readonly questId: string,
        public readonly action: "activate" | "complete" | "fail",
        public readonly claims: { roles: string[] }
    ) {}
}
