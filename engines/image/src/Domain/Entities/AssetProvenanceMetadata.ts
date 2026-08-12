import { ProviderId } from "../ValueObjects/ProviderId";
import { ModelIdentifier } from "../ValueObjects/ModelIdentifier";

export interface AssetProvenanceMetadata {
    readonly promptHash: string;
    readonly modelId: ModelIdentifier;
    readonly providerId: ProviderId;
    readonly sessionId: string;
    readonly correlationId: string;
    readonly createdAt: number;
    readonly worldContext: string;
    readonly characterContext: string;
    readonly storyContext: string;
}
