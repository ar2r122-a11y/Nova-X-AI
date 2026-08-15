import type { IEventBus } from "@nova-x-ai/core";
import { VoiceEngine } from "@nova-x-ai/voice";
import { getSharedStorageEngine } from "./SharedInfrastructure";

export class VoiceEngineClient {
    private static instance: VoiceEngine | null = null;
    private static initPromise: Promise<VoiceEngine | null> | null = null;

    static async getEngine(): Promise<VoiceEngine | null> {
        if (VoiceEngineClient.instance) {
            return VoiceEngineClient.instance;
        }
        if (VoiceEngineClient.initPromise) {
            return VoiceEngineClient.initPromise;
        }

        VoiceEngineClient.initPromise = VoiceEngineClient.createEngine();
        try {
            VoiceEngineClient.instance = await VoiceEngineClient.initPromise;
            return VoiceEngineClient.instance;
        } catch {
            VoiceEngineClient.instance = null;
            VoiceEngineClient.initPromise = null;
            return null;
        }
    }

    private static async createEngine(): Promise<VoiceEngine | null> {
        try {
            const storageEngine = getSharedStorageEngine();
            const eventBus = storageEngine.eventBus as IEventBus;
            const engine = new VoiceEngine(
                eventBus,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any
            );
            await engine.initialize("default");
            return engine;
        } catch {
            return null;
        }
    }

    static async reset(): Promise<void> {
        if (VoiceEngineClient.instance) {
            try {
                await VoiceEngineClient.instance.shutdown();
            } catch {
                // ignore shutdown errors
            }
            VoiceEngineClient.instance = null;
            VoiceEngineClient.initPromise = null;
        }
    }
}
