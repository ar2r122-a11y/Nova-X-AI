
import { ImageEngineException } from "./ImageEngineException";

export class AssetNotFoundException extends ImageEngineException {
    constructor(assetId: string) {
        super(`Asset not found: ${assetId}`);
        this.name = "AssetNotFoundException";
    }
}
