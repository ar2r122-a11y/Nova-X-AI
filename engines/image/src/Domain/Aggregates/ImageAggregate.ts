import { IDomainEvent } from "@nova-x-ai/core";
import { ImageId } from "../ValueObjects/ImageId";
import { SessionId } from "../ValueObjects/SessionId";
import { ImageRuntimeState } from "../ValueObjects/ImageRuntimeState";
import { ImageRuntimeStateTransitions } from "../ValueObjects/ImageRuntimeState";
import { PromptCompilationResult } from "../ValueObjects/PromptCompilationResult";
import { ImageAsset } from "../Entities/ImageAsset";
import { RenderJob } from "../Entities/RenderJob";
import { ImageVariation } from "../Entities/ImageVariation";
import { ThumbnailMetadata } from "../Entities/ThumbnailMetadata";
import { ImageCandidate } from "../Entities/ImageCandidate";
import { AssetId } from "../ValueObjects/AssetId";
import { ProviderId } from "../ValueObjects/ProviderId";
import { GenerationType } from "../ValueObjects/GenerationType";
import { ResourceBudget } from "../ValueObjects/ResourceBudget";
import { ImageStyle } from "../ValueObjects/ImageStyle";
import { ModelIdentifier } from "../ValueObjects/ModelIdentifier";
import { ImageDimensions } from "../ValueObjects/ImageDimensions";
import { ImageFormat } from "../ValueObjects/ImageFormat";
import { AssetProvenance } from "../ValueObjects/AssetProvenance";
import { PromptMetadata } from "../Entities/PromptMetadata";
import { ContentModerationState } from "../Entities/ContentModerationState";
import { CorrelationMetadata } from "../ValueObjects/CorrelationMetadata";
import { ImageEngineException } from "../Exceptions/ImageEngineException";
import { InvalidImageStateException } from "../Exceptions/InvalidImageStateException";
import {
    ImageGenerationRequestedEvent,
    ImageGenerationStartedEvent,
    ImageGenerationCompletedEvent,
    ImageGenerationFailedEvent,
    ImageAssetFinalizedEvent,
    ImageCandidateGeneratedEvent,
    ImageCandidateSelectedEvent,
    ImageCandidatePromotedEvent,
    ImageThumbnailGeneratedEvent,
    ImageRecoveryCompletedEvent,
    ImageResourceBudgetExceededEvent
} from "../Events";

export interface ImageAggregateProps {
    id: ImageId;
    sessionId: SessionId;
    state: ImageRuntimeState;
    prompt: string;
    compiledPrompt: PromptCompilationResult;
    assets: ImageAsset[];
    renderJobs: RenderJob[];
    variations: ImageVariation[];
    thumbnails: ThumbnailMetadata[];
    candidates: ImageCandidate[];
    selectedCandidateId: string | null;
    primaryAssetId: AssetId | null;
    generationType: GenerationType;
    providerId: string;
    modelId: ModelIdentifier;
    dimensions: ImageDimensions;
    style: ImageStyle;
    resourceBudget: ResourceBudget;
    createdAt: number;
    updatedAt: number;
    errorMessage: string | null;
    recoveryCount: number;
    provenance: AssetProvenance;
    promptMetadata: PromptMetadata;
    moderationState: ContentModerationState;
}

export class ImageAggregate {
    private readonly id: ImageId;
    private sessionId: SessionId;
    private state: ImageRuntimeState;
    private prompt: string;
    private compiledPrompt: PromptCompilationResult;
    private assets: ImageAsset[];
    private renderJobs: RenderJob[];
    private variations: ImageVariation[];
    private thumbnails: ThumbnailMetadata[];
    private candidates: ImageCandidate[];
    private selectedCandidateId: string | null;
    private primaryAssetId: AssetId | null;
    private generationType: GenerationType;
    private providerId: string;
    private modelId: ModelIdentifier;
    private dimensions: ImageDimensions;
    private style: ImageStyle;
    private resourceBudget: ResourceBudget;
    private readonly createdAt: number;
    private updatedAt: number;
    private errorMessage: string | null;
    private recoveryCount: number;
    private provenance: AssetProvenance;
    private promptMetadata: PromptMetadata;
    private moderationState: ContentModerationState;
    private readonly uncommittedEvents: IDomainEvent[] = [];
    private correlation: CorrelationMetadata;

    private constructor(props: ImageAggregateProps, correlation: CorrelationMetadata) {
        this.id = props.id;
        this.sessionId = props.sessionId;
        this.state = props.state;
        this.prompt = props.prompt;
        this.compiledPrompt = props.compiledPrompt;
        this.assets = props.assets;
        this.renderJobs = props.renderJobs;
        this.variations = props.variations;
        this.thumbnails = props.thumbnails;
        this.candidates = props.candidates;
        this.selectedCandidateId = props.selectedCandidateId;
        this.primaryAssetId = props.primaryAssetId;
        this.generationType = props.generationType;
        this.providerId = props.providerId;
        this.modelId = props.modelId;
        this.dimensions = props.dimensions;
        this.style = props.style;
        this.resourceBudget = props.resourceBudget;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.errorMessage = props.errorMessage;
        this.recoveryCount = props.recoveryCount;
        this.provenance = props.provenance;
        this.promptMetadata = props.promptMetadata;
        this.moderationState = props.moderationState;
        this.correlation = correlation;
    }

    public static create(
        id: ImageId,
        sessionId: SessionId,
        generationType: GenerationType,
        providerId: string,
        modelId: ModelIdentifier,
        dimensions: ImageDimensions,
        style: ImageStyle,
        budget: ResourceBudget,
        prompt: string,
        provenance: AssetProvenance
    ): ImageAggregate {
        const now = Date.now();
        const correlation = CorrelationMetadata.create({
            correlationId: `corr-${id.getValue()}`,
            requestId: `req-${id.getValue()}`,
            sessionId: sessionId.getValue(),
            traceId: `trace-${id.getValue()}`,
            spanId: `span-${id.getValue()}`,
            schemaVersion: "1.0.0"
        });
        return new ImageAggregate({
            id,
            sessionId,
            state: ImageRuntimeState.Initializing,
            prompt,
            compiledPrompt: PromptCompilationResult.create("", [], 0, [], []),
            assets: [],
            renderJobs: [],
            variations: [],
            thumbnails: [],
            candidates: [],
            selectedCandidateId: null,
            primaryAssetId: null,
            generationType,
            providerId,
            modelId,
            dimensions,
            style,
            resourceBudget: budget,
            createdAt: now,
            updatedAt: now,
            errorMessage: null,
            recoveryCount: 0,
            provenance,
            promptMetadata: {
                originalPrompt: prompt,
                compiledPrompt: "",
                safetyFlags: [],
                tokenCount: 0,
                injectedVisualTags: [],
                styleTokens: [],
                environmentalModifiers: [],
                characterVisualConsistency: ""
            },
            moderationState: {
                rating: "safe" as any,
                flags: [],
                reviewedAt: null,
                reviewedBy: null,
                action: "allow"
            }
        }, correlation);
    }

    public static fromSnapshot(snapshot: object): ImageAggregate {
        const snap = snapshot as Record<string, unknown>;
        const correlation = CorrelationMetadata.create({
            correlationId: `corr-${snap.id}`,
            requestId: `req-${snap.id}`,
            sessionId: snap.sessionId as string,
            traceId: `trace-${snap.id}`,
            spanId: `span-${snap.id}`,
            schemaVersion: "1.0.0"
        });
        const aggregate = new ImageAggregate({
            id: ImageId.fromString(snap.id as string),
            sessionId: SessionId.fromString(snap.sessionId as string),
            state: snap.state as ImageRuntimeState,
            prompt: snap.prompt as string,
            compiledPrompt: PromptCompilationResult.create(snap.compiledPrompt as string, [], 0, [], []),
            assets: [],
            renderJobs: [],
            variations: [],
            thumbnails: [],
            candidates: (snap.candidates as Array<Record<string, unknown>> | undefined)?.map((c: any) =>
                ImageCandidate.create({
                    id: c.id as string,
                    candidateId: c.id as string,
                    imageId: snap.id as string,
                    prompt: PromptCompilationResult.create(snap.compiledPrompt as string, [], 0, [], []),
                    negativePrompt: "",
                    dimensions: ImageDimensions.create(1, 1),
                    width: 1,
                    height: 1,
                    format: ImageFormat.PNG,
                    generationType: (snap.generationType as string) || "",
                    state: ImageRuntimeState.Idle,
                    score: 0,
                    seed: null,
                    uri: "",
                    isSelected: false,
                    metadata: {},
                    createdAt: Date.now()
                })
            ) || [],
            selectedCandidateId: snap.selectedCandidateId as string | null,
            primaryAssetId: snap.primaryAssetId ? AssetId.fromString(snap.primaryAssetId as string) : null,
            generationType: snap.generationType as GenerationType,
            providerId: snap.providerId as string,
            modelId: ModelIdentifier.fromString(snap.modelId as string),
            dimensions: ImageDimensions.create((snap.dimensions as { width: number; height: number }).width, (snap.dimensions as { width: number; height: number }).height),
            style: ImageStyle.create(snap.style as string),
            resourceBudget: ResourceBudget.create(
                (snap.resourceBudget as { vram: number; memory: number; timeout: number; maxResolution: number }).vram,
                (snap.resourceBudget as { vram: number; memory: number; timeout: number; maxResolution: number }).memory,
                (snap.resourceBudget as { vram: number; memory: number; timeout: number; maxResolution: number }).timeout,
                (snap.resourceBudget as { vram: number; memory: number; timeout: number; maxResolution: number }).maxResolution
            ),
            createdAt: snap.createdAt as number,
            updatedAt: snap.updatedAt as number,
            errorMessage: snap.errorMessage as string | null,
            recoveryCount: snap.recoveryCount as number,
            provenance: AssetProvenance.create(
                (snap.provenance as { promptHash: string; modelId: string; providerId: string; sessionId: string; timestamp: number }).promptHash,
                ModelIdentifier.fromString((snap.provenance as { promptHash: string; modelId: string; providerId: string; sessionId: string; timestamp: number }).modelId),
                ProviderId.fromString((snap.provenance as { promptHash: string; modelId: string; providerId: string; sessionId: string; timestamp: number }).providerId),
                (snap.provenance as { promptHash: string; modelId: string; providerId: string; sessionId: string; timestamp: number }).sessionId
            ),
            promptMetadata: snap.promptMetadata as PromptMetadata,
            moderationState: snap.moderationState as ContentModerationState
        }, correlation);
        return aggregate;
    }

    public compilePrompt(originalPrompt: string, visualTags: string[] = [], styleTokens: string[] = [], environmentalModifiers: string[] = []): PromptCompilationResult {
        if (this.state !== ImageRuntimeState.WaitingForPrompt && this.state !== ImageRuntimeState.Idle) {
            throw new InvalidImageStateException(this.state, ImageRuntimeState.PromptOrchestration);
        }
        this.transitionTo(ImageRuntimeState.PromptOrchestration);
        this.prompt = originalPrompt;
        const result = PromptCompilationResult.create(originalPrompt, [], 0, styleTokens, visualTags);
        this.compiledPrompt = result;
        this.promptMetadata = {
            originalPrompt,
            compiledPrompt: result.getCompiledPrompt(),
            safetyFlags: result.getSafetyFlags(),
            tokenCount: result.getTokenCount(),
            injectedVisualTags: visualTags,
            styleTokens,
            environmentalModifiers,
            characterVisualConsistency: ""
        };
        this.uncommittedEvents.push(new ImageGenerationRequestedEvent(this.id, this.generationType, originalPrompt, this.correlation));
        return result;
    }

    public queueRender(): void {
        if (this.state !== ImageRuntimeState.PromptOrchestration) {
            throw new InvalidImageStateException(this.state, ImageRuntimeState.QueuingGPUJob);
        }
        this.transitionTo(ImageRuntimeState.QueuingGPUJob);
    }

    public startRendering(): void {
        if (this.state !== ImageRuntimeState.QueuingGPUJob) {
            throw new InvalidImageStateException(this.state, ImageRuntimeState.Rendering);
        }
        this.transitionTo(ImageRuntimeState.Rendering);
        this.uncommittedEvents.push(new ImageGenerationStartedEvent(this.id, this.correlation));
    }

    public completeRendering(assetId: string): void {
        if (this.state !== ImageRuntimeState.Rendering && this.state !== ImageRuntimeState.PostProcessing) {
            throw new InvalidImageStateException(this.state, ImageRuntimeState.Completed);
        }
        this.transitionTo(ImageRuntimeState.Completed);
        this.updatedAt = Date.now();
        this.uncommittedEvents.push(new ImageGenerationCompletedEvent(this.id, assetId, this.assets.length, this.correlation));
    }

    public failRendering(reason: string): void {
        if (this.state !== ImageRuntimeState.Rendering && this.state !== ImageRuntimeState.QueuingGPUJob) {
            throw new InvalidImageStateException(this.state, ImageRuntimeState.Failed);
        }
        this.transitionTo(ImageRuntimeState.Failed);
        this.errorMessage = reason;
        this.updatedAt = Date.now();
        this.uncommittedEvents.push(new ImageGenerationFailedEvent(this.id, reason, this.correlation));
    }

    public pause(): void {
        if (this.state !== ImageRuntimeState.Rendering && this.state !== ImageRuntimeState.QueuingGPUJob) {
            throw new InvalidImageStateException(this.state, ImageRuntimeState.Paused);
        }
        this.transitionTo(ImageRuntimeState.Paused);
    }

    public resume(): void {
        if (this.state !== ImageRuntimeState.Paused) {
            throw new InvalidImageStateException(this.state, ImageRuntimeState.Rendering);
        }
        this.transitionTo(ImageRuntimeState.Rendering);
    }

    public cancel(): void {
        if (this.state === ImageRuntimeState.Completed || this.state === ImageRuntimeState.Failed) {
            throw new InvalidImageStateException(this.state, ImageRuntimeState.Failed);
        }
        this.transitionTo(ImageRuntimeState.Failed);
        this.errorMessage = "Cancelled by user.";
        this.updatedAt = Date.now();
    }

    public addAsset(asset: ImageAsset): void {
        if (this.resourceBudget.isExhausted()) {
            this.uncommittedEvents.push(new ImageResourceBudgetExceededEvent(this.id, "memory", this.correlation));
            throw new ImageEngineException("Resource budget exhausted.");
        }
        this.assets.push(asset);
        this.resourceBudget.consume(0, asset.sizeBytes / (1024 * 1024), 0);
        this.updatedAt = Date.now();
        this.uncommittedEvents.push(new ImageAssetFinalizedEvent(this.id, asset.assetId.getValue(), this.correlation));
    }

    public finalizeAsset(assetId: AssetId): void {
        const asset = this.assets.find(a => a.assetId.equals(assetId));
        if (!asset) {
            throw new ImageEngineException(`Asset ${assetId.getValue()} not found.`);
        }
        this.updatedAt = Date.now();
    }

    public addCandidate(candidate: ImageCandidate): void {
        if (this.state !== ImageRuntimeState.WaitingForPrompt && this.state !== ImageRuntimeState.Idle && this.state !== ImageRuntimeState.PromptOrchestration) {
            throw new InvalidImageStateException(this.state, ImageRuntimeState.PromptOrchestration);
        }
        this.candidates.push(candidate);
        this.updatedAt = Date.now();
        this.uncommittedEvents.push(new ImageCandidateGeneratedEvent(this.id, candidate.id, this.correlation));
    }

    public selectCandidate(candidateId: string): void {
        const candidate = this.candidates.find(c => c.id === candidateId);
        if (!candidate) {
            throw new ImageEngineException(`Candidate ${candidateId} not found.`);
        }
        this.selectedCandidateId = candidateId;
        this.updatedAt = Date.now();
        this.uncommittedEvents.push(new ImageCandidateSelectedEvent(this.id, candidateId, 0, this.correlation));
    }

    public promoteToPrimary(assetId: AssetId, isPrimary: boolean): void {
        const asset = this.assets.find(a => a.assetId.equals(assetId));
        if (!asset) {
            throw new ImageEngineException(`Asset ${assetId.getValue()} not found.`);
        }
        if (isPrimary) {
            this.primaryAssetId = assetId;
        }
        this.updatedAt = Date.now();
        this.uncommittedEvents.push(new ImageCandidatePromotedEvent(this.id, assetId.getValue(), isPrimary, this.correlation));
    }

    public generateThumbnail(assetId: AssetId, size: number): ThumbnailMetadata {
        const asset = this.assets.find(a => a.assetId.equals(assetId));
        if (!asset) {
            throw new ImageEngineException(`Asset ${assetId.getValue()} not found.`);
        }
        const thumbnail: ThumbnailMetadata = {
            id: `thumb-${Date.now()}`,
            thumbnailId: `thumb-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            assetId,
            size: size as any,
            width: Math.floor(asset.width / (asset.height / size)),
            height: size,
            format: asset.format,
            path: `thumbnails/${assetId.getValue()}_${size}.${asset.format}`,
            createdAt: Date.now()
        };
        this.thumbnails.push(thumbnail);
        this.updatedAt = Date.now();
        this.uncommittedEvents.push(new ImageThumbnailGeneratedEvent(this.id, thumbnail.thumbnailId, size, this.correlation));
        return thumbnail;
    }

    public recover(): void {
        if (this.state !== ImageRuntimeState.Failed) {
            throw new InvalidImageStateException(this.state, ImageRuntimeState.Recovering);
        }
        this.transitionTo(ImageRuntimeState.Recovering);
        this.recoveryCount++;
        this.errorMessage = null;
        this.updatedAt = Date.now();
        this.uncommittedEvents.push(new ImageRecoveryCompletedEvent(this.id, this.correlation));
    }

    private transitionTo(newState: ImageRuntimeState): void {
        const current = this.state;
        const allowed = ImageRuntimeStateTransitions[current] || [];
        if (!allowed.includes(newState)) {
            throw new InvalidImageStateException(current, newState);
        }
        this.state = newState;
        this.updatedAt = Date.now();
    }

    public getSnapshot(): object {
        return {
            id: this.id.getValue(),
            sessionId: this.sessionId.getValue(),
            state: this.state,
            prompt: this.prompt,
            compiledPrompt: this.compiledPrompt.getCompiledPrompt(),
            assets: this.assets.map(a => ({
                assetId: a.assetId.getValue(),
                width: a.width,
                height: a.height,
                sizeBytes: a.sizeBytes,
                format: a.format,
                isPrimary: a.isPrimary
            })),
            renderJobs: this.renderJobs.map(r => ({ id: r.id, state: r.state })),
            variations: this.variations.map(v => ({ id: v.id })),
            thumbnails: this.thumbnails.map(t => ({ id: t.id })),
            candidates: this.candidates.map(c => ({ id: c.id })),
            selectedCandidateId: this.selectedCandidateId,
            primaryAssetId: this.primaryAssetId?.getValue() || null,
            generationType: this.generationType,
            providerId: this.providerId,
            modelId: this.modelId.getValue(),
            dimensions: { width: this.dimensions.getWidth(), height: this.dimensions.getHeight() },
            style: this.style.getValue(),
            resourceBudget: {
                vram: this.resourceBudget.getVRAMBudget(),
                memory: this.resourceBudget.getMemoryBudget(),
                timeout: this.resourceBudget.getTimeoutMs(),
                maxResolution: this.resourceBudget.getMaxResolution()
            },
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            errorMessage: this.errorMessage,
            recoveryCount: this.recoveryCount,
            provenance: {
                promptHash: this.provenance.getPromptHash(),
                modelId: this.provenance.getModelId().getValue(),
                providerId: this.provenance.getProviderId().getValue(),
                sessionId: this.provenance.getSessionId(),
                timestamp: this.provenance.getTimestamp()
            },
            promptMetadata: this.promptMetadata,
            moderationState: this.moderationState
        };
    }

    public restoreFromSnapshot(snapshot: object): void {
        const snap = snapshot as Record<string, unknown>;
        this.state = snap.state as ImageRuntimeState;
        this.prompt = snap.prompt as string;
        this.selectedCandidateId = snap.selectedCandidateId as string | null;
        this.primaryAssetId = snap.primaryAssetId ? AssetId.fromString(snap.primaryAssetId as string) : null;
        this.providerId = snap.providerId as string;
        this.updatedAt = Date.now();
    }

    public setState(state: ImageRuntimeState): void {
        this.transitionTo(state);
    }

    public getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    public commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    public getId(): ImageId {
        return this.id;
    }

    public getSessionId(): SessionId {
        return this.sessionId;
    }

    public getState(): ImageRuntimeState {
        return this.state;
    }

    public getStatus(): ImageRuntimeState {
        return this.state;
    }

    public getPrompt(): string {
        return this.prompt;
    }

    public getNegativePrompt(): string {
        return this.promptMetadata.originalPrompt;
    }

    public getMode(): GenerationType {
        return this.generationType;
    }

    public getAspectRatio(): string {
        return `${this.dimensions.getWidth()}:${this.dimensions.getHeight()}`;
    }

    public getSelectedCandidateId(): string | null {
        return this.selectedCandidateId;
    }

    public setSelectedCandidateId(candidateId: string | null): void {
        this.selectedCandidateId = candidateId;
        this.updatedAt = Date.now();
    }

    public getPrimaryAssetId(): AssetId | null {
        return this.primaryAssetId;
    }

    public getOwnerId(): string {
        return this.provenance.getProviderId().getValue();
    }

    public getMetadata(): Record<string, unknown> {
        return this.promptMetadata as unknown as Record<string, unknown>;
    }

    public getCreatedAt(): number {
        return this.createdAt;
    }

    public getCompletedAt(): number | null {
        return this.assets.length > 0 ? this.updatedAt : null;
    }

    public getAssets(): ImageAsset[] {
        return this.assets;
    }

    public getCandidates(): ImageCandidate[] {
        return this.candidates;
    }

    public getThumbnails(): ThumbnailMetadata[] {
        return this.thumbnails;
    }

    public getVariations(): ImageVariation[] {
        return this.variations;
    }

    public getRenderJobs(): RenderJob[] {
        return this.renderJobs;
    }

    public getError(): string | null {
        return this.errorMessage;
    }
}
