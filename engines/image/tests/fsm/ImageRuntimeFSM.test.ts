import { describe, it, expect } from "vitest";
import { ImageRuntimeState, ImageRuntimeStateTransitions } from "../../src/Domain/ValueObjects/ImageRuntimeState";
import { ImageAggregateFactory } from "../../src/Domain/Aggregates/ImageAggregateFactory";
import { ImageId } from "../../src/Domain/ValueObjects/ImageId";

describe("ImageRuntimeFSM", () => {
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

    describe("happy path", () => {
        it("should complete full lifecycle: Initializing -> WaitingForPrompt -> PromptOrchestration -> QueuingGPUJob -> Rendering -> PostProcessing -> GeneratingThumbnails -> SavingAsset -> StreamingImage -> Completed", () => {
            const aggregate = createAggregate();
            aggregate.setState(ImageRuntimeState.Initializing);
            expect(aggregate.getStatus()).toBe(ImageRuntimeState.Initializing);

            aggregate.setState(ImageRuntimeState.WaitingForPrompt);
            aggregate.setState(ImageRuntimeState.PromptOrchestration);
            aggregate.setState(ImageRuntimeState.QueuingGPUJob);
            aggregate.setState(ImageRuntimeState.Rendering);
            aggregate.setState(ImageRuntimeState.PostProcessing);
            aggregate.setState(ImageRuntimeState.GeneratingThumbnails);
            aggregate.setState(ImageRuntimeState.SavingAsset);
            aggregate.setState(ImageRuntimeState.StreamingImage);
            aggregate.setState(ImageRuntimeState.Completed);
            expect(aggregate.getStatus()).toBe(ImageRuntimeState.Completed);
        });
    });

    describe("recovery paths", () => {
        it("Failed -> Recovering -> Initializing should restart", () => {
            const aggregate = createAggregate();
            aggregate.setState(ImageRuntimeState.Failed);
            aggregate.setState(ImageRuntimeState.Recovering);
            aggregate.setState(ImageRuntimeState.Initializing);
            expect(aggregate.getStatus()).toBe(ImageRuntimeState.Initializing);
        });

        it("Failed -> Idle should allow restart", () => {
            const aggregate = createAggregate();
            aggregate.setState(ImageRuntimeState.Failed);
            aggregate.setState(ImageRuntimeState.Idle);
            expect(aggregate.getStatus()).toBe(ImageRuntimeState.Idle);
        });
    });

    describe("timeout handling", () => {
        it("Rendering -> Failed on timeout", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Rendering];
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });
    });

    describe("OOM handling", () => {
        it("Rendering -> Failed on OOM", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Rendering];
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });
    });

    describe("provider failure handling", () => {
        it("Rendering -> Failed on provider failure", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Rendering];
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });

        it("PromptOrchestration -> Failed on provider failure", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.PromptOrchestration];
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });

        it("QueuingGPUJob -> Failed on provider failure", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.QueuingGPUJob];
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });
    });

    describe("cancellation", () => {
        it("WaitingForPrompt -> Paused should allow cancellation", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.WaitingForPrompt];
            expect(allowed).toContain(ImageRuntimeState.Paused);
        });

        it("Paused -> WaitingForPrompt should allow restart", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Paused];
            expect(allowed).toContain(ImageRuntimeState.WaitingForPrompt);
        });
    });

    describe("restart after terminal states", () => {
        it("Completed -> Idle should allow restart", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Completed];
            expect(allowed).toContain(ImageRuntimeState.Idle);
        });

        it("Idle -> Initializing should allow start", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.Idle];
            expect(allowed).toContain(ImageRuntimeState.Initializing);
        });
    });

    describe("transition table consistency", () => {
        it("all states should have defined transitions", () => {
            const states = Object.values(ImageRuntimeState);
            for (const state of states) {
                expect(ImageRuntimeStateTransitions[state]).toBeDefined();
            }
        });

        it("SavingAsset should transition to StreamingImage or Completed or Failed", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.SavingAsset];
            expect(allowed).toContain(ImageRuntimeState.StreamingImage);
            expect(allowed).toContain(ImageRuntimeState.Completed);
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });

        it("StreamingImage should transition to Completed or Failed", () => {
            const allowed = ImageRuntimeStateTransitions[ImageRuntimeState.StreamingImage];
            expect(allowed).toContain(ImageRuntimeState.Completed);
            expect(allowed).toContain(ImageRuntimeState.Failed);
        });
    });
});
