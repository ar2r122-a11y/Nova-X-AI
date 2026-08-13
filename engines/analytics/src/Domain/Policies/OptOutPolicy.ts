export class OptOutPolicy {
    static validateOptOutChange(currentOptOut: boolean, newOptOut: boolean): void {
        if (currentOptOut === newOptOut) {
            throw new Error("Opt-out status is already set to the requested value.");
        }
    }
}
