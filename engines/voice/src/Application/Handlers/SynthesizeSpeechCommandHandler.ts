import { ICommandHandler } from "@nova-x-ai/core";
import type { IEventBus } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import { SynthesizeSpeechCommand } from "../Commands/SynthesizeSpeechCommand";
import { SynthesizeSpeechValidator } from "../Validators/SynthesizeSpeechValidator";

export class SynthesizeSpeechCommandHandler implements ICommandHandler<SynthesizeSpeechCommand> {
    constructor(
        private readonly voiceEngine: IVoiceEngine,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: SynthesizeSpeechCommand): Promise<void> {
        const validator = new SynthesizeSpeechValidator();
        validator.validate(command);

        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.voiceEngine.synthesizeSpeech(command);
    }
}
