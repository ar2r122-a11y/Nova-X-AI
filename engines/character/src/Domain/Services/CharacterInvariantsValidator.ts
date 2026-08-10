
import { CharacterAggregate } from "../Aggregates";
import { PersonalityTrait } from "../ValueObjects";

export class CharacterInvariantsValidator {
    public static validateAggregate(aggregate: CharacterAggregate): void {
        const identity = aggregate.getIdentity();
        if (!identity.id || identity.id.getValue().trim().length === 0) {
            throw new Error("Character aggregate must have a valid identity.");
        }

        if (identity.name.length > 100) {
            throw new Error("Character name exceeds maximum length of 100 characters.");
        }

        if (identity.title.length > 50) {
            throw new Error("Character title exceeds maximum length of 50 characters.");
        }

        const profile = aggregate.getProfile();
        if (profile.biography.length > 5000) {
            throw new Error("Biography exceeds maximum length of 5000 characters.");
        }

        if (profile.tagline.length > 200) {
            throw new Error("Tagline exceeds maximum length of 200 characters.");
        }

        if (profile.occupation.length > 100) {
            throw new Error("Occupation exceeds maximum length of 100 characters.");
        }

        if (profile.publicNotes.length > 1000) {
            throw new Error("PublicNotes exceeds maximum length of 1000 characters.");
        }

        const appearance = aggregate.getAppearance();
        if (appearance.visualDescription.length > 2000) {
            throw new Error("Visual description exceeds maximum length of 2000 characters.");
        }

        if (appearance.distinguishingMarks.length > 500) {
            throw new Error("Distinguishing marks exceed maximum length of 500 characters.");
        }
    }

    public static validateTraitSchema(traits: Map<string, PersonalityTrait>): void {
        traits.forEach((trait, key) => {
            if (key !== trait.getValue().name) {
                throw new Error(`Trait key "${key}" does not match trait name "${trait.getValue().name}".`);
            }
            const score = trait.getValue().score;
            if (score < 0.0 || score > 1.0) {
                throw new Error(`Trait score for "${key}" must be between 0.0 and 1.0.`);
            }
        });
    }

    public static validateNameUniqueness(name: string, existingNames: string[]): void {
        const normalizedName = name.toLowerCase().trim();
        const exists = existingNames.some((existing) => existing.toLowerCase().trim() === normalizedName);
        if (exists) {
            throw new Error(`Character name "${name}" already exists.`);
        }
    }

    public static validateStateTransition(current: string | { getValue: () => string }, target: string | { getValue: () => string }): boolean {
        const currentVal = typeof current === "string" ? current : current.getValue();
        const targetVal = typeof target === "string" ? target : target.getValue();

        const validTransitions: Record<string, string[]> = {
            active: ["sleeping", "traveling", "incapacitated", "hibernating"],
            sleeping: ["active"],
            incapacitated: ["active", "hibernating"],
            traveling: ["active", "sleeping"],
            hibernating: ["active", "incapacitated"],
            unloaded: ["initializing"],
            initializing: ["active", "unloaded"]
        };

        const allowedTargets = validTransitions[currentVal] || [];
        return allowedTargets.includes(targetVal);
    }
}
