import { describe, it, expect } from "vitest";
import {
    ImageEngineException,
    ImageNotFoundException,
    CandidateNotFoundException,
    AssetNotFoundException,
    RenderJobNotFoundException,
    InvalidImageStateException,
    ResourceBudgetExhaustedException,
    ProviderUnavailableException,
    PromptCompilationException,
    SafetyViolationException,
    InvalidDimensionException
} from "../../src/Domain/Exceptions/ImageExceptions";
import { ImageRuntimeState } from "../../src/Domain/ValueObjects/ImageRuntimeState";

describe("Exceptions", () => {
    it("ImageEngineException should be base", () => {
        const ex = new ImageEngineException("base error");
        expect(ex).toBeInstanceOf(Error);
        expect(ex.message).toBe("base error");
        expect(ex.name).toBe("ImageEngineException");
    });

    it("ImageNotFoundException should extend ImageEngineException", () => {
        const ex = new ImageNotFoundException("img-999");
        expect(ex).toBeInstanceOf(ImageEngineException);
        expect(ex.message).toContain("img-999");
        expect(ex.name).toBe("ImageNotFoundException");
    });

    it("CandidateNotFoundException should extend ImageEngineException", () => {
        const ex = new CandidateNotFoundException("cnd-999");
        expect(ex).toBeInstanceOf(ImageEngineException);
        expect(ex.message).toContain("cnd-999");
        expect(ex.name).toBe("CandidateNotFoundException");
    });

    it("AssetNotFoundException should extend ImageEngineException", () => {
        const ex = new AssetNotFoundException("ast-999");
        expect(ex).toBeInstanceOf(ImageEngineException);
        expect(ex.message).toContain("ast-999");
        expect(ex.name).toBe("AssetNotFoundException");
    });

    it("RenderJobNotFoundException should extend ImageEngineException", () => {
        const ex = new RenderJobNotFoundException("ren-999");
        expect(ex).toBeInstanceOf(ImageEngineException);
        expect(ex.message).toContain("ren-999");
        expect(ex.name).toBe("RenderJobNotFoundException");
    });

    it("InvalidImageStateException should extend ImageEngineException", () => {
        const ex = new InvalidImageStateException(ImageRuntimeState.Initializing, ImageRuntimeState.Rendering);
        expect(ex).toBeInstanceOf(ImageEngineException);
        expect(ex.message).toContain("Initializing");
        expect(ex.message).toContain("Rendering");
        expect(ex.name).toBe("InvalidImageStateException");
    });

    it("ResourceBudgetExhaustedException should extend ImageEngineException", () => {
        const ex = new ResourceBudgetExhaustedException("VRAM");
        expect(ex).toBeInstanceOf(ImageEngineException);
        expect(ex.message).toContain("VRAM");
        expect(ex.name).toBe("ResourceBudgetExhaustedException");
    });

    it("ProviderUnavailableException should extend ImageEngineException", () => {
        const ex = new ProviderUnavailableException("provider-1");
        expect(ex).toBeInstanceOf(ImageEngineException);
        expect(ex.message).toContain("provider-1");
        expect(ex.name).toBe("ProviderUnavailableException");
    });

    it("PromptCompilationException should extend ImageEngineException", () => {
        const ex = new PromptCompilationException("syntax error");
        expect(ex).toBeInstanceOf(ImageEngineException);
        expect(ex.message).toContain("syntax error");
        expect(ex.name).toBe("PromptCompilationException");
    });

    it("SafetyViolationException should extend ImageEngineException", () => {
        const ex = new SafetyViolationException("blocked tag");
        expect(ex).toBeInstanceOf(ImageEngineException);
        expect(ex.message).toContain("blocked tag");
        expect(ex.name).toBe("SafetyViolationException");
    });

    it("InvalidDimensionException should extend ImageEngineException", () => {
        const ex = new InvalidDimensionException("0x0");
        expect(ex).toBeInstanceOf(ImageEngineException);
        expect(ex.message).toContain("0x0");
        expect(ex.name).toBe("InvalidDimensionException");
    });
});
