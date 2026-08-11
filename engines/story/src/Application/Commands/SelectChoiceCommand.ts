import { ICommand } from "@nova-x-ai/core";
import { ISelectChoiceCommand } from "../../Contracts/IStoryEngine";

export class SelectChoiceCommand implements ICommand, ISelectChoiceCommand {
    constructor(
        public readonly storyId: string,
        public readonly sceneId: string,
        public readonly choiceId: string,
        public readonly branchId: string,
        public readonly claims: { roles: string[] }
    ) {}
}
