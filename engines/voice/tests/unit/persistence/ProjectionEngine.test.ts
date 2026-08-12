import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectionEngine } from "../../../src/Infrastructure/Projections/ProjectionEngine";
import { IEventHandler, IDomainEvent } from "@nova-x-ai/core";

describe("ProjectionEngine", () => {
    let mockEventBus: any;
    let mockProjectionStore: any;
    let engine: ProjectionEngine;

    beforeEach(() => {
        mockEventBus = {
            subscribe: vi.fn()
        };
        mockProjectionStore = {
            listProjections: vi.fn().mockResolvedValue(["voice-state", "audio-stream"]),
            resetProjection: vi.fn().mockResolvedValue(undefined)
        };
        engine = new ProjectionEngine(mockEventBus, mockProjectionStore);
    });

    describe("start", () => {
        it("sets running flag to true", () => {
            engine.start();
            expect(engine["running"]).toBe(true);
        });

        it("does not throw on double start", () => {
            engine.start();
            engine.start();
            expect(engine["running"]).toBe(true);
        });
    });

    describe("stop", () => {
        it("sets running flag to false", () => {
            engine.start();
            engine.stop();
            expect(engine["running"]).toBe(false);
        });
    });

    describe("registerHandler", () => {
        it("registers handler for event type", () => {
            const handler: IEventHandler<IDomainEvent> = {
                handle: vi.fn()
            };

            engine.registerHandler("EVT_VOICE_VoiceInitialized", handler as any);

            expect(engine["handlers"].get("EVT_VOICE_VoiceInitialized")).toContain(handler);
        });

        it("allows multiple handlers for same event type", () => {
            const handler1: IEventHandler<IDomainEvent> = { handle: vi.fn() };
            const handler2: IEventHandler<IDomainEvent> = { handle: vi.fn() };

            engine.registerHandler("EVT_VOICE_VoiceInitialized", handler1 as any);
            engine.registerHandler("EVT_VOICE_VoiceInitialized", handler2 as any);

            const handlers = engine["handlers"].get("EVT_VOICE_VoiceInitialized");
            expect(handlers).toHaveLength(2);
            expect(handlers).toContain(handler1);
            expect(handlers).toContain(handler2);
        });
    });

    describe("rebuild", () => {
        it("resets projection via store", async () => {
            await engine.rebuild("voice-state");

            expect(mockProjectionStore.resetProjection).toHaveBeenCalledWith("voice-state");
        });
    });

    describe("getStatus", () => {
        it("returns status for all projections", async () => {
            mockProjectionStore.listProjections.mockResolvedValue(["proj-a", "proj-b"]);

            const status = await engine.getStatus();

            expect(status).toHaveLength(2);
            expect(status[0].name).toBe("proj-a");
            expect(status[1].name).toBe("proj-b");
            expect(status[0].isRunning).toBe(false);
        });

        it("returns isRunning true when engine is started", async () => {
            engine.start();
            mockProjectionStore.listProjections.mockResolvedValue(["proj-a"]);

            const status = await engine.getStatus();

            expect(status[0].isRunning).toBe(true);
        });
    });
});
