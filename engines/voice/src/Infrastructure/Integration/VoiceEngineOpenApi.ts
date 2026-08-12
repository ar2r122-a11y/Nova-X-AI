import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import type { IVoiceRuntime } from "../../Contracts/Runtime/IVoiceRuntime";

export class VoiceEngineOpenApi {
    constructor(private readonly engine: IVoiceEngine, private readonly runtime: IVoiceRuntime | null = null) {}

    getVoiceEngine(): IVoiceEngine | null {
        return this.engine;
    }

    getRuntime(): IVoiceRuntime | null {
        return this.runtime;
    }
}
