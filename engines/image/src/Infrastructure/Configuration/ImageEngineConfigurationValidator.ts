import { ImageEngineConfiguration } from "./ImageEngineConfiguration";

export class ImageEngineConfigurationValidator {
    static validate(config: ImageEngineConfiguration): void {
        if (config.candidateCount < 1 || config.candidateCount > 16) {
            throw new Error("candidateCount must be between 1 and 16.");
        }
        if (config.batchSize < 1 || config.batchSize > 32) {
            throw new Error("batchSize must be between 1 and 32.");
        }
        if (config.maxConcurrentJobs < 1 || config.maxConcurrentJobs > 64) {
            throw new Error("maxConcurrentJobs must be between 1 and 64.");
        }
        if (config.retryCount < 0 || config.retryCount > 10) {
            throw new Error("retryCount must be between 0 and 10.");
        }
        const validSensitivity = ["low", "medium", "high"];
        if (!validSensitivity.includes(config.moderationSensitivity)) {
            throw new Error(`moderationSensitivity must be one of ${validSensitivity.join(", ")}.`);
        }
        const validWatermark = ["none", "subtle", "prominent"];
        if (!validWatermark.includes(config.watermarkPolicy)) {
            throw new Error(`watermarkPolicy must be one of ${validWatermark.join(", ")}.`);
        }
        const validCompression = ["lossless", "high", "medium", "low"];
        if (!validCompression.includes(config.compressionProfile)) {
            throw new Error(`compressionProfile must be one of ${validCompression.join(", ")}.`);
        }
    }
}
