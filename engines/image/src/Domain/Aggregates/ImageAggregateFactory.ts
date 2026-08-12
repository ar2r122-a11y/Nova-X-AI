
import { ImageAggregate } from "./ImageAggregate";
import { ImageId } from "../ValueObjects/ImageId";
import { SessionId } from "../ValueObjects/SessionId";
import { GenerationType } from "../ValueObjects/GenerationType";
import { ResourceBudget } from "../ValueObjects/ResourceBudget";
import { ImageDimensions } from "../ValueObjects/ImageDimensions";
import { ImageStyle } from "../ValueObjects/ImageStyle";
import { ModelIdentifier } from "../ValueObjects/ModelIdentifier";
import { AssetProvenance } from "../ValueObjects/AssetProvenance";
import { ProviderId } from "../ValueObjects/ProviderId";
import { ImageRuntimeState } from "../ValueObjects/ImageRuntimeState";

export class ImageAggregateFactory {
    public static create(
        imageId: ImageId,
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
        return ImageAggregate.create(imageId, sessionId, generationType, providerId, modelId, dimensions, style, budget, prompt, provenance);
    }

    public static fromSnapshot(snapshot: object): ImageAggregate {
        return ImageAggregate.fromSnapshot(snapshot);
    }

    public static createFromTemplate(template: {
        imageId: string;
        sessionId: string;
        ownerId: string;
        prompt: string;
        negativePrompt: string;
        mode: string;
        aspectRatio: string;
        status?: string;
        candidateCount?: number;
    }): ImageAggregate {
        const id = ImageId.fromString(template.imageId);
        const sessionId = SessionId.fromString(template.sessionId);
        const generationType = template.mode as GenerationType;
        const dimensions = ImageDimensions.create(1024, 1024);
        const style = ImageStyle.create("photorealistic");
        const budget = ResourceBudget.create(4096, 8192, 90000, 1024);
        const modelId = ModelIdentifier.fromString("default-model");
        const providerId = template.ownerId || "default-provider";
        const provenance = AssetProvenance.create(
            btoa(template.prompt).slice(0, 32),
            modelId,
            ProviderId.fromString(providerId),
            sessionId.getValue()
        );

        const aggregate = ImageAggregate.create(id, sessionId, generationType, providerId, modelId, dimensions, style, budget, template.prompt, provenance);
        aggregate.setState(ImageRuntimeState.WaitingForPrompt);
        if (template.status) {
            aggregate.setState(template.status as any);
        }
        return aggregate;
    }
}
