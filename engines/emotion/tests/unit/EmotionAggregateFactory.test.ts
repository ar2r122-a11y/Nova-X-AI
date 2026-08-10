import { describe, it, expect } from "vitest";
import { EmotionAggregateFactory } from "../../src/Domain/Factories/EmotionAggregateFactory";

describe("EmotionAggregateFactory", () => {
    it("creates aggregate with correct baseline", () => {
        const aggregate = EmotionAggregateFactory.create("char-1");
        expect(aggregate.getCharacterId()).toBe("char-1");
        expect(aggregate.getPAD().getPleasure()).toBe(0.0);
        expect(aggregate.getPAD().getArousal()).toBe(0.2);
        expect(aggregate.getPAD().getDominance()).toBe(0.5);
    });

    it("reconstitutes aggregate from snapshot", () => {
        const original = EmotionAggregateFactory.create("char-1");
        const snapshot = original.getSnapshot() as any;
        const restored = EmotionAggregateFactory.reconstitute(snapshot);
        expect(restored.getCharacterId()).toBe(original.getCharacterId());
        expect(restored.getPrimaryEmotion().getValue()).toBe(original.getPrimaryEmotion().getValue());
    });
});
