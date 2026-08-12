
import { ImageEngineException } from "./ImageEngineException";

export class RenderJobNotFoundException extends ImageEngineException {
    constructor(renderJobId: string) {
        super(`Render job not found: ${renderJobId}`);
        this.name = "RenderJobNotFoundException";
    }
}
