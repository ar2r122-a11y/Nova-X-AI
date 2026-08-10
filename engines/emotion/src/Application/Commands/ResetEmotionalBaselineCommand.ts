import { ICommand } from "@nova-x-ai/core";

export class ResetEmotionalBaselineCommand implements ICommand {
    constructor(
        public readonly characterId: string
    ) {}
}
