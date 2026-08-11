import { ICommand } from "@nova-x-ai/core";
import { IAdvanceSceneCommand } from "../../Contracts/IStoryEngine";

export class AdvanceSceneCommand implements ICommand, IAdvanceSceneCommand {
    constructor(
        public readonly storyId: string,
        public readonly sceneId: string,
        public readonly claims: { roles: string[] }
    ) {}
}
