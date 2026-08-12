
import { ProviderId } from "./ProviderId";
import { ModelIdentifier } from "./ModelIdentifier";

export class AssetProvenance {
    private readonly promptHash: string;
    private readonly modelId: ModelIdentifier;
    private readonly providerId: ProviderId;
    private readonly timestamp: number;
    private readonly sessionId: string;

    private constructor(promptHash: string, modelId: ModelIdentifier, providerId: ProviderId, timestamp: number, sessionId: string) {
        this.promptHash = promptHash;
        this.modelId = modelId;
        this.providerId = providerId;
        this.timestamp = timestamp;
        this.sessionId = sessionId;
    }

    public static create(promptHash: string, modelId: ModelIdentifier, providerId: ProviderId, sessionId: string): AssetProvenance {
        if (!promptHash || promptHash.trim().length === 0) {
            throw new Error("PromptHash cannot be empty.");
        }
        return new AssetProvenance(promptHash, modelId, providerId, Date.now(), sessionId);
    }

    public static fromTimestamp(timestamp: number): AssetProvenance {
        return new AssetProvenance("", ModelIdentifier.fromString("unknown"), ProviderId.fromString("unknown"), timestamp, "");
    }

    public getPromptHash(): string {
        return this.promptHash;
    }

    public getModelId(): ModelIdentifier {
        return this.modelId;
    }

    public getProviderId(): ProviderId {
        return this.providerId;
    }

    public getTimestamp(): number {
        return this.timestamp;
    }

    public getSessionId(): string {
        return this.sessionId;
    }
}
