
import { RenderId } from "../ValueObjects/RenderId";
import { ImageId } from "../ValueObjects/ImageId";
import { ImageRuntimeState } from "../ValueObjects/ImageRuntimeState";
import { ResourceBudget } from "../ValueObjects/ResourceBudget";
import { ImageDimensions } from "../ValueObjects/ImageDimensions";
import { GenerationType } from "../ValueObjects/GenerationType";

export interface RenderJob {
    readonly id: string;
    readonly jobId: RenderId;
    readonly imageId: ImageId;
    readonly state: ImageRuntimeState;
    readonly status: string;
    readonly providerId: string;
    readonly modelId: string;
    readonly dimensions: ImageDimensions;
    readonly prompt: string;
    readonly style: string;
    readonly generationType: GenerationType;
    readonly priority: number;
    readonly attempts: number;
    readonly maxAttempts: number;
    readonly resultAssetId: string | null;
    readonly startedAt: number | null;
    readonly completedAt: number | null;
    readonly failedAt: number | null;
    readonly createdAt: number;
    readonly errorMessage: string | null;
    readonly resourceBudget: ResourceBudget;
    readonly streamChunks: ArrayBuffer[];
}

export namespace RenderJob {
    export function fromSnapshot(snapshot: Record<string, unknown>): RenderJob {
        return {
            id: snapshot.id as string,
            jobId: snapshot.jobId as RenderId,
            imageId: snapshot.imageId as ImageId,
            state: snapshot.state as ImageRuntimeState,
            status: snapshot.status as string,
            providerId: snapshot.providerId as string,
            modelId: snapshot.modelId as string,
            dimensions: snapshot.dimensions as ImageDimensions,
            prompt: snapshot.prompt as string,
            style: snapshot.style as string,
            generationType: snapshot.generationType as GenerationType,
            priority: (snapshot.priority as number) || 0,
            attempts: (snapshot.attempts as number) || 0,
            maxAttempts: (snapshot.maxAttempts as number) || 3,
            resultAssetId: snapshot.resultAssetId as string | null,
            startedAt: snapshot.startedAt as number | null,
            completedAt: snapshot.completedAt as number | null,
            failedAt: snapshot.failedAt as number | null,
            createdAt: snapshot.createdAt as number,
            errorMessage: snapshot.errorMessage as string | null,
            resourceBudget: snapshot.resourceBudget as ResourceBudget,
            streamChunks: []
        };
    }

    export function toSnapshot(job: RenderJob): Record<string, unknown> {
        return {
            id: job.id,
            jobId: job.jobId,
            imageId: job.imageId,
            state: job.state,
            status: job.status,
            providerId: job.providerId,
            modelId: job.modelId,
            dimensions: job.dimensions,
            prompt: job.prompt,
            style: job.style,
            generationType: job.generationType,
            priority: job.priority,
            attempts: job.attempts,
            maxAttempts: job.maxAttempts,
            resultAssetId: job.resultAssetId,
            startedAt: job.startedAt,
            completedAt: job.completedAt,
            failedAt: job.failedAt,
            createdAt: job.createdAt,
            errorMessage: job.errorMessage,
            resourceBudget: job.resourceBudget
        };
    }
}
