import { UpdatePrivacySettingsCommand } from "../Commands/UpdatePrivacySettingsCommand";

export class UpdatePrivacySettingsValidator {
    static validate(command: UpdatePrivacySettingsCommand): void {
        if (typeof command.piiStrippingEnabled !== "boolean") {
            throw new Error("piiStrippingEnabled must be a boolean.");
        }
        if (typeof command.promptTextHashingEnabled !== "boolean") {
            throw new Error("promptTextHashingEnabled must be a boolean.");
        }
        if (typeof command.ipAnonymizationEnabled !== "boolean") {
            throw new Error("ipAnonymizationEnabled must be a boolean.");
        }
    }
}
