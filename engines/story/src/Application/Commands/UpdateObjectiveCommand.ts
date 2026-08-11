import { ICommand } from "@nova-x-ai/core";
import { IUpdateObjectiveCommand } from "../../Contracts/IStoryEngine";

export class UpdateObjectiveCommand implements ICommand, IUpdateObjectiveCommand {
    constructor(
        public readonly storyId: string,
        public readonly questId: string,
        public readonly objectiveId: string,
        public readonly claims: { roles: string[] },
        public readonly action: "activate" | "complete" | "fail" | "setProgress",
        public readonly progress?: number
    ) {}
}
