import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceEventStoreRepositoryImpl } from "../../../src/Infrastructure/Persistence/VoiceEventStoreRepositoryImpl";

describe("VoiceEventStoreRepositoryImpl", () => {
    let mockEventStore: any;
    let repository: VoiceEventStoreRepositoryImpl;

    beforeEach(() => {
        mockEventStore = {
            appendToStream: vi.fn(),
            readStream: vi.fn(),
            getStreamVersion: vi.fn()
        };
        const mockStorageEngine = {
            getEventStore: vi.fn().mockReturnValue(mockEventStore)
        } as any;
        repository = new VoiceEventStoreRepositoryImpl(mockStorageEngine);
    });

    describe("appendToStream", () => {
        it("delegates to eventStore.appendToStream", async () => {
            mockEventStore.appendToStream.mockResolvedValue(undefined);

            await repository.appendToStream("stream-1", [{ type: "event1" }], 0);

            expect(mockEventStore.appendToStream).toHaveBeenCalledWith("stream-1", [{ type: "event1" }], 0);
        });
    });

    describe("readStream", () => {
        it("delegates to eventStore.readStream", async () => {
            const events = [{ type: "event1" }, { type: "event2" }];
            mockEventStore.readStream.mockResolvedValue(events);

            const result = await repository.readStream("stream-1", 0);

            expect(mockEventStore.readStream).toHaveBeenCalledWith("stream-1", 0);
            expect(result).toEqual(events);
        });

        it("returns empty array for stream with no events", async () => {
            mockEventStore.readStream.mockResolvedValue([]);

            const result = await repository.readStream("stream-1", 0);

            expect(result).toEqual([]);
        });
    });

    describe("getStreamVersion", () => {
        it("returns the current stream version", async () => {
            mockEventStore.getStreamVersion.mockResolvedValue(5);

            const result = await repository.getStreamVersion("stream-1");

            expect(mockEventStore.getStreamVersion).toHaveBeenCalledWith("stream-1");
            expect(result).toBe(5);
        });

        it("returns 0 for a new stream", async () => {
            mockEventStore.getStreamVersion.mockResolvedValue(0);

            const result = await repository.getStreamVersion("new-stream");

            expect(result).toBe(0);
        });
    });
});
