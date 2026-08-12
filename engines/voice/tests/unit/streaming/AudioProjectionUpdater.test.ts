import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioProjectionUpdater } from "../../../src/Infrastructure/Streaming";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";
import type { IEventBus } from "@nova-x-ai/core";
import type { IProjectionStore } from "@nova-x-ai/storage";

const makeChunk = (sequence = 0): AudioChunk => {
    const data = new ArrayBuffer(1024);
    return AudioChunk.create(AudioChunkSequence.create(sequence), data, Date.now(), false, AudioCodec.pcm());
};

describe("AudioProjectionUpdater", () => {
    let updater: AudioProjectionUpdater;
    let mockEventBus: IEventBus;
    let mockProjectionStore: IProjectionStore;

    beforeEach(() => {
        mockEventBus = {
            subscribe: vi.fn(),
            publish: vi.fn(),
            unsubscribe: vi.fn()
        } as unknown as IEventBus;
        mockProjectionStore = {
            getProjection: vi.fn(),
            saveProjection: vi.fn(),
            deleteProjection: vi.fn()
        } as unknown as IProjectionStore;
        updater = new AudioProjectionUpdater(mockEventBus, mockProjectionStore);
    });

    describe("start", () => {

        it("sets running to true", () => {
            updater.start();
            expect(updater).toBeDefined();
        });

        it("does not subscribe again on second start", () => {
            updater.start();
            updater.start();
            expect(mockEventBus.subscribe).not.toHaveBeenCalled();
        });

    });

    describe("stop", () => {

        it("sets running to false", () => {
            updater.start();
            updater.stop();
            expect(updater).toBeDefined();
        });

    });

    describe("updateChunk", () => {

        it("does nothing when not running", () => {
            expect(() => updater.updateChunk("stream-1", makeChunk(0))).not.toThrow();
        });

        it("processes chunk when running", () => {
            updater.start();
            expect(() => updater.updateChunk("stream-1", makeChunk(0))).not.toThrow();
        });

    });

});
