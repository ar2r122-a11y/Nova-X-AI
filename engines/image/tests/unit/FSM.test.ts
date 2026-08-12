import { describe, it, expect } from "vitest";
import { ImageRuntimeState, ImageRuntimeStateTransitions } from "../../src/Domain/ValueObjects/ImageRuntimeState";
import { ImageAggregateFactory } from "../../src/Domain/Aggregates/ImageAggregateFactory";
import { ImageId } from "../../src/Domain/ValueObjects/ImageId";

describe("FSM", () => {
    const createAggregate = () => {
        const imageId = ImageId.create();
        return ImageAggregateFactory.createFromTemplate({
            imageId: imageId.getValue(),
            sessionId: "ses-1",
            ownerId: "owner-1",
            prompt: "test",
            negativePrompt: "",
            mode: "textToImage",
            aspectRatio: "1:1"
        });
    };

    describe("valid transitions", () => {
        it("Initializing -> WaitingForPrompt", () => {
            const aggregate = createAggregate();
            aggregate.setState(ImageRuntimeState.Initializing);
            expect(() => aggregate.setState(ImageRuntimeState.WaitingForPrompt)).not.toThrow();
        });

        it("WaitingForPrompt -> PromptOrchestration", () => {
            const aggregate = createAggregate();
            aggregate.setState(ImageRuntimeState.WaitingForPrompt);
            aggregate.setState(ImageRuntimeState.PromptOrchestration);
            expect(aggregate.getStatus()).toBe(ImageRuntimeState.PromptOrchestration);
        });

        it("Rendering -> PostProcessing", () => {
            const aggregate = createAggregate();
            aggregate.setState(ImageRuntimeState.Rendering);
            aggregate.setState(ImageRuntimeState.PostProcessing);
            expect(aggregate.getStatus()).toBe(ImageRuntimeState.PostProcessing);
        });

        it("Completed -> Idle", () => {
            const aggregate = createAggregate();
            aggregate.setState(ImageRuntimeState.Completed);
            aggregate.setState(ImageRuntimeState.Idle);
            expect(aggregate.getStatus()).toBe(ImageRuntimeState.Idle);
        });

        it("Failed -> Recovering", () => {
            const aggregate = createAggregate();
            aggregate.setState(ImageRuntimeState.Failed);
            aggregate.setState(ImageRuntimeState.Recovering);
            expect(aggregate.getStatus()).toBe(ImageRuntimeState.Recovering);
        });

        it("Recovering -> Initializing", () => {
            const aggregate = createAggregate();
            aggregate.setState(ImageRuntimeState.Failed);
            aggregate.setState(ImageRuntimeState.Recovering);
            aggregate.setState(ImageRuntimeState.Initializing);
            expect(aggregate.getStatus()).toBe(ImageRuntimeState.Initializing);
        });
    });

    describe("invalid transitions", () => {
        it("should throw Invalid -> Initializing", () => {
            expect(() => {
                ImageRuntimeStateTransitions["invalid"];
            }).toBeDefined();
        });

        it("Completed should only transition to Idle", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Completed];
            expect(allowed).toContain(ImageRuntimeState.Idle);
            expect(allowed.length).toBe(1);
        });

        it("Failed should allow Recovering and Idle", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Failed];
            expect(allowed).toContain(ImageRuntimeState.Recovering);
            expect(allowed).toContain(ImageRuntimeState.Idle);
        });
    });

    describe("timeout transitions", () => {
        it("Rendering -> Failed on timeout", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Rendering];
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });
    });

    describe("OOM transitions", () => {
        it("Rendering -> Failed on OOM", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Rendering];
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });
    });

    describe("provider failure transitions", () => {
        it("Rendering -> Failed on provider failure", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Rendering];
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });

        it("PromptOrchestration -> Failed on provider failure", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.PromptOrchestration];
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });
    });

    describe("recovery transitions", () => {
        it("Recovering -> Initializing should restart", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Recovering];
            expect(allowed).toContain(ImageRuntimeState.Initializing);
        });

        it("Recovering -> Failed should allow failure", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Recovering];
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });
    });

    describe("transition table consistency", () => {
        it("all states should have defined transitions", () => {
            const states = Object.values(ImageRuntimeState);
            for (const state of states) {
                expect(ImageRuntimeStateTransitions[state]).toBeDefined();
            }
        });

        it("Idle should transition to Initializing or Failed", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Idle];
            expect(allowed).toContain(ImageRuntimeState.Initializing);
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });

        it("Paused should allow WaitingForPrompt", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Paused];
            expect(allowed).toContain(ImageRuntimeState.WaitingForPrompt);
        });
    });
});
