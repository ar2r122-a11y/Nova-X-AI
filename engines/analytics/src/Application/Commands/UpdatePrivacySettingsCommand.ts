import { ICommand } from "@nova-x-ai/core";
import type { UpdatePrivacySettingsCommand as IUpdatePrivacySettingsCommand } from "../../Contracts/IAnalyticsEngine";

export class UpdatePrivacySettingsCommand implements ICommand, IUpdatePrivacySettingsCommand {
    constructor(
        public readonly piiStrippingEnabled: boolean,
        public readonly promptTextHashingEnabled: boolean,
        public readonly ipAnonymizationEnabled: boolean,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
