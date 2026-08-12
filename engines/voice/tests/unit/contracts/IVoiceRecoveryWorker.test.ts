import { describe, it, expect } from "vitest";
import { VoiceRecoveryWorker } from "../../../src/Infrastructure/Workers/VoiceRecoveryWorker";
import type { IVoiceRecoveryWorker } from "../../../src/Contracts/IVoiceRecoveryWorker";

describe("IVoiceRecoveryWorker", () => {
    it("VoiceRecoveryWorker implements IVoiceRecoveryWorker", () => {
        const worker = new VoiceRecoveryWorker();
        expect(worker).toBeInstanceOf(VoiceRecoveryWorker);
        expect(worker.workerName).toBeDefined();
        expect(typeof worker.setEngine).toBe("function");
        expect(typeof worker.setVoiceId).toBe("function");
        expect(typeof worker.configure).toBe("function");
        expect(typeof worker.start).toBe("function");
        expect(typeof worker.stop).toBe("function");
        expect(typeof worker.pause).toBe("function");
        expect(typeof worker.resume).toBe("function");
        expect(typeof worker.isRunning).toBe("function");
        expect(typeof worker.getHealth).toBe("function");
        expect(typeof worker.recover).toBe("function");
    });
});
