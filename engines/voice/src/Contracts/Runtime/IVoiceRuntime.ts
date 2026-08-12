import type { RuntimeConfiguration, VoiceRuntimeState } from "./index";

export interface IVoiceRuntime {
    readonly engine: import("../IVoiceEngine").IVoiceEngine;
    readonly configuration: RuntimeConfiguration;
    readonly currentRuntimeState: VoiceRuntimeState;
    start(voiceId: string): Promise<void>;
    stop(voiceId: string): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    transitionTo(targetState: VoiceRuntimeState): Promise<void>;
    handleFailure(reason: string, voiceId: string): Promise<void>;
    recover(voiceId: string): Promise<void>;
    takeSnapshot(voiceId: string): Promise<object>;
    getState(): VoiceRuntimeState;
    getUptimeMs(): number;
    getWorkers(): readonly import("../IAudioStreamingWorker").IAudioStreamingWorker[];
    getHealthChecks(): readonly import("../IProviderHealthCheck").IProviderHealthCheck[];
}
