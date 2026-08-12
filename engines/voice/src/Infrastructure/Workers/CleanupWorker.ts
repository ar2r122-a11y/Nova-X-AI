import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import type { IAudioStreamingWorker } from "../../Contracts/IAudioStreamingWorker";
import type { RuntimeConfiguration } from "../../Contracts/Runtime";
import { BaseVoiceWorker } from "./BaseVoiceWorker";

export class CleanupWorker extends BaseVoiceWorker {
    constructor() {
        super(3600000);
    }

    protected tickImpl(): Promise<void> {
        return Promise.resolve();
    }
}
