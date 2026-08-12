import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceRepositoryImpl } from "../../../src/Infrastructure/Persistence/VoiceRepositoryImpl";
import { VoiceAggregate } from "../../../src/Domain/Aggregates/VoiceAggregate";
import { VoiceId } from "../../../src/Domain/ValueObjects/VoiceId";
import { VoiceStateRef } from "../../../src/Domain/ValueObjects/VoiceState";
import { VoiceProviderId } from "../../../src/Domain/ValueObjects/VoiceProviderId";
import { ProviderCostMetadata } from "../../../src/Domain/ValueObjects/ProviderCostMetadata";

describe("VoiceRepositoryImpl", () => {
    let mockStorageEngine: any;
    let repository: VoiceRepositoryImpl;

    beforeEach(() => {
        mockStorageEngine = {
            getRepository: vi.fn().mockReturnValue({
                getById: vi.fn(),
                save: vi.fn(),
                delete: vi.fn(),
                exists: vi.fn(),
                getAll: vi.fn()
            })
        };
        repository = new VoiceRepositoryImpl(mockStorageEngine);
    });

    describe("findById", () => {
        it("returns null when voice not found", async () => {
            const repo = mockStorageEngine.getRepository();
            repo.getById.mockResolvedValue(null);

            const result = await repository.findById(VoiceId.create("voice-1"));
            expect(result).toBeNull();
            expect(repo.getById).toHaveBeenCalledWith("voice-1");
        });

        it("reconstitutes VoiceAggregate from stored snapshot", async () => {
            const snapshot = {
                voiceId: "voice-1",
                voiceState: "waiting_for_input",
                providerId: "default",
                version: 2,
                totalAudioDurationMs: 1500,
                totalChunksProcessed: 5,
                lastProviderHealth: {
                    estimatedCostMicros: 0,
                    currency: "USD",
                    providerId: "default"
                },
                consecutiveFailures: 0
            };
            const repo = mockStorageEngine.getRepository();
            repo.getById.mockResolvedValue({ id: "voice-1", data: JSON.stringify(snapshot) });

            const result = await repository.findById(VoiceId.create("voice-1"));
            expect(result).toBeInstanceOf(VoiceAggregate);
            expect(result!.getVoiceId().getValue()).toBe("voice-1");
            expect(result!.getVoiceState().getValue()).toBe("waiting_for_input");
            expect(result!.getVersion()).toBe(2);
            expect(result!.getTotalAudioDurationMs()).toBe(1500);
            expect(result!.getTotalChunksProcessed()).toBe(5);
            expect(result!.getConsecutiveFailures()).toBe(0);
        });

        it("throws on malformed JSON", async () => {
            const repo = mockStorageEngine.getRepository();
            repo.getById.mockResolvedValue({ id: "voice-1", data: "not-json" });

            await expect(repository.findById(VoiceId.create("voice-1"))).rejects.toThrow();
        });
    });

    describe("save", () => {
        it("serializes aggregate snapshot and persists it", async () => {
            const aggregate = VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default"));
            aggregate.startSynthesis("req-1", VoiceProviderId.create("default"));
            const repo = mockStorageEngine.getRepository();
            repo.save.mockResolvedValue(undefined);

            await repository.save(aggregate);

            expect(repo.save).toHaveBeenCalledTimes(1);
            const savedEntity = repo.save.mock.calls[0][0];
            expect(savedEntity.id).toBe("voice-1");
            const parsed = JSON.parse(savedEntity.data);
            expect(parsed.voiceId).toBe("voice-1");
            expect(parsed.version).toBe(1);
        });

        it("delegates to storage repository save", async () => {
            const aggregate = VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default"));
            const repo = mockStorageEngine.getRepository();
            repo.save.mockResolvedValue(undefined);

            await repository.save(aggregate);

            expect(repo.save).toHaveBeenCalled();
        });
    });
});
