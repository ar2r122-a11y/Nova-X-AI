import { describe, it, expect } from "vitest";
import { EmotionalSnapshotDto } from "../../src/Application/DTO/EmotionalSnapshotDto";
import { EmotionalContextDto } from "../../src/Application/DTO/EmotionalContextDto";
import { EmotionalHistoryDto } from "../../src/Application/DTO/EmotionalHistoryDto";
import { EmotionAggregate } from "../../src/Domain/Aggregates/EmotionAggregate";
import { EmotionalStimulus } from "../../src/Domain/ValueObjects/EmotionalStimulus";

describe("DTOs", () => {
    it("EmotionalSnapshotDto maps from aggregate", () => {
        const aggregate = EmotionAggregate.create("char-1");
        aggregate.applyStimulus(
            EmotionalStimulus.create({
                sourceId: "test",
                stimulusType: "dialogue",
                intensity: 0.5,
                valence: 0.2
            }),
            1.0
        );
        const dto = EmotionalSnapshotDto.fromAggregate(aggregate);
        expect(dto.characterId).toBe("char-1");
        expect(dto.primaryEmotion).toBe(aggregate.getPrimaryEmotion().getValue());
        expect(dto.pleasure).toBe(aggregate.getPAD().getPleasure());
        expect(dto.arousal).toBe(aggregate.getPAD().getArousal());
        expect(dto.dominance).toBe(aggregate.getPAD().getDominance());
    });

    it("EmotionalContextDto builds prompt context", () => {
        const aggregate = EmotionAggregate.create("char-1");
        const dto = EmotionalContextDto.fromAggregate(aggregate);
        expect(dto.characterId).toBe("char-1");
        expect(dto.promptContext).toContain("Current Emotion");
        expect(dto.promptContext).toContain("PAD");
    });

    it("EmotionalHistoryDto returns empty entries for new aggregate", () => {
        const aggregate = EmotionAggregate.create("char-1");
        const dto = EmotionalHistoryDto.fromAggregate(aggregate);
        expect(dto.characterId).toBe("char-1");
        expect(dto.entries.length).toBe(0);
    });

    it("EmotionalHistoryDto returns entries after stimulus", () => {
        const aggregate = EmotionAggregate.create("char-1");
        aggregate.applyStimulus(
            EmotionalStimulus.create({
                sourceId: "test",
                stimulusType: "dialogue",
                intensity: 0.5,
                valence: 0.2
            }),
            1.0
        );
        const dto = EmotionalHistoryDto.fromAggregate(aggregate);
        expect(dto.entries.length).toBeGreaterThan(0);
    });
});
