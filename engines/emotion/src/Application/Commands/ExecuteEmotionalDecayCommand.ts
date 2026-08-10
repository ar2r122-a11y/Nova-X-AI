import { ICommand } from "@nova-x-ai/core";

export class ExecuteEmotionalDecayCommand implements ICommand {
    constructor(
        public readonly characterId: string,
        public readonly deltaTimeMs: number
    ) {}
}
