import type { IImageProviderAdapter } from "../../Contracts/IImageProviderAdapter";

export class ProviderSelectionMatrix {
    static readonly PRIORITY = {
        LOCAL: 1,
        FREE: 2,
        CLOUD: 3
    };

    static getMatchingProviders(_adapter: IImageProviderAdapter, requestedMode: string): boolean {
        const supported = ["text-to-image", "image-to-image", "inpainting", "outpainting", "variation"];
        return supported.includes(requestedMode);
    }

    static getProviderPriority(providerName: string): number {
        if (providerName.toLowerCase().includes("local")) {
            return this.PRIORITY.LOCAL;
        }
        if (providerName.toLowerCase().includes("free")) {
            return this.PRIORITY.FREE;
        }
        if (providerName.toLowerCase().includes("cloud")) {
            return this.PRIORITY.CLOUD;
        }
        return 99;
    }
}
