
import { PromptCompilationResult } from "../ValueObjects/PromptCompilationResult";
import { ImageDimensions } from "../ValueObjects/ImageDimensions";
import { ImageFormat } from "../ValueObjects/ImageFormat";
import { ImageRuntimeState } from "../ValueObjects/ImageRuntimeState";

export interface ImageCandidate {
    readonly id: string;
    readonly candidateId: string;
    readonly imageId: string;
    readonly prompt: PromptCompilationResult;
    readonly negativePrompt: string;
    readonly dimensions: ImageDimensions;
    readonly width: number;
    readonly height: number;
    readonly format: ImageFormat;
    readonly generationType: string;
    readonly state: ImageRuntimeState;
    readonly score: number;
    readonly seed: number | null;
    readonly uri: string;
    readonly isSelected: boolean;
    readonly metadata: Record<string, unknown>;
    readonly createdAt: number;
}

export namespace ImageCandidate {
    export function create(props: ImageCandidate): ImageCandidate {
        return props;
    }

    export function createNew(prompt: PromptCompilationResult, dimensions: ImageDimensions, format: ImageFormat, generationType: string): ImageCandidate {
        return {
            id: `cnd-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            candidateId: `cnd-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            imageId: "",
            prompt,
            negativePrompt: "",
            dimensions,
            width: dimensions.getWidth(),
            height: dimensions.getHeight(),
            format,
            generationType,
            state: ImageRuntimeState.Idle,
            score: 0,
            seed: null,
            uri: "",
            isSelected: false,
            metadata: {},
            createdAt: Date.now()
        };
    }

    export function fromSnapshot(snapshot: Record<string, unknown>): ImageCandidate {
        return {
            id: snapshot.id as string,
            candidateId: snapshot.candidateId as string,
            imageId: snapshot.imageId as string,
            prompt: snapshot.prompt as PromptCompilationResult,
            negativePrompt: (snapshot.negativePrompt as string) || "",
            dimensions: snapshot.dimensions as ImageDimensions,
            width: (snapshot.width as number) || 0,
            height: (snapshot.height as number) || 0,
            format: snapshot.format as ImageFormat,
            generationType: snapshot.generationType as string,
            state: snapshot.state as ImageRuntimeState,
            score: (snapshot.score as number) || 0,
            seed: snapshot.seed as number | null,
            uri: (snapshot.uri as string) || "",
            isSelected: (snapshot.isSelected as boolean) || false,
            metadata: (snapshot.metadata as Record<string, unknown>) || {},
            createdAt: snapshot.createdAt as number
        };
    }

    export function toSnapshot(candidate: ImageCandidate): Record<string, unknown> {
        return {
            id: candidate.id,
            candidateId: candidate.candidateId,
            imageId: candidate.imageId,
            prompt: candidate.prompt,
            negativePrompt: candidate.negativePrompt,
            dimensions: candidate.dimensions,
            width: candidate.width,
            height: candidate.height,
            format: candidate.format,
            generationType: candidate.generationType,
            state: candidate.state,
            score: candidate.score,
            seed: candidate.seed,
            uri: candidate.uri,
            isSelected: candidate.isSelected,
            metadata: candidate.metadata,
            createdAt: candidate.createdAt
        };
    }
}
